import { Errors, sanitizeErrorMessage } from "../utils";
import { Components } from "../app";
import { actionStates, ClientEvents, Response, ServerEvents } from "../events";
import { Server, Socket } from "socket.io";
import { v4 as uuid } from "uuid";
import { idSchema, IRoom, RoomID, Player, PlayerID, MAX_PLAYER, ILobbyRoom, Ticket, Trump, playerCamp } from "./room.schema";
import { StripeRoom } from "./room.repository";
import { resolvePlay, newDeck } from "../helpers/helper";
import { InMemoryHandRepository } from "./hand.repository";

export function registerRoomHandlers(
  io: Server<ClientEvents, ServerEvents>,
  socket: Socket<ClientEvents, ServerEvents>,
  components: Components
): void {

  // list lobby
  const { roomRepository, handRepository } = components;
  roomRepository.listLobby().then((rooms: ILobbyRoom[]) => {
    socket.emit("lobby:list", rooms);
  });

  socket.on("disconnect", function () {
    socket.rooms.forEach(async (roomid: string) => {
      socket.leave(roomid);
      if (roomid !== "lobby") {
        const room: IRoom = await roomRepository.removePlayerBySocketId(roomid, socket.id);
        io.to(roomid).emit("room:player:updated", room);
        io.to("lobby").emit("lobby:updated", StripeRoom(room));
      }
    });
  });
  socket.on("lobby:create", async function (newRoom: {name:string, startLevel:string}, player:Player, callback: (res: Response<IRoom>) => void) {
    // validate the payload
    const room:IRoom = {...newRoom, id: uuid(),
    players:[]}; 
    room.trump = {
      number: room.startLevel, 
      count:0
    }
    room.players = [{...player,
      socketid: socket.id,
      level:newRoom.startLevel,
      actionState : actionStates.PREPARE,
      points:[],
      cards:[]
    }, null, null, null, null, null
    ]

    // persist the entity
    try {
      await roomRepository.save(room);
      socket.join(room.id);
      socket.leave("lobby");
      io.to("lobby").emit("lobby:created", StripeRoom(room));
    } catch (e) {
      return callback({
        error: sanitizeErrorMessage(e),
      });
    }

    // acknowledge the creation
    callback({
      data: room,
    });
  });

  socket.on("lobby:join", async function (roomid: RoomID, player: Player, callback: (res: Response<{ room: IRoom; hand?: string[] }>) => void) {
    const { error } = idSchema.validate(roomid);
    if (error) {
      console.error(error)
      return callback({
        error: Errors.ENTITY_NOT_FOUND,
      });
    }
    try {
      console.log(roomid)
      const room: IRoom = await roomRepository.findById(roomid);
      console.log(room)
      //rejoin
      if (room.players.some((p) => p && p.id === player.id)) {
        const hand: string[] = await handRepository.getById(player.id);
        console.log("player rejoining...")
        room.players = room.players.map((p) => {
          if (p && p.id === player.id) return { ...player, socketid: socket.id };
          return p;
        });
        callback({ data: { room, hand } });
        // first time joining
      } else if (room.players.filter((p) => p).length < MAX_PLAYER) {
        let firstNull = true;
        console.log(room.players);
        room.players = room.players.map((p) => {
          if (firstNull && p === null) {
            firstNull = false;
            return { ...player, socketid: socket.id, actionState: actionStates.PREPARE, level: room.startLevel, cards:[], points:[] };
          }
          return p;
        });
        console.log(room.players);
        io.to(roomid).emit("room:player:updated", room);
        socket.join(roomid);
        socket.leave("lobby");
        io.to("lobby").emit("lobby:updated", StripeRoom(room));
        callback({ data: { room } });
      } else {
        throw "maximum room capacity reached";
      }
    } catch (e) {
      callback({
        error: sanitizeErrorMessage(e),
      });
    }
  });

  socket.on("lobby:leave", async function (roomid: RoomID, playerid: PlayerID) {
    const { error } = idSchema.validate(roomid);
    if (error) {
      return console.error({
        error: Errors.ENTITY_NOT_FOUND,
      });
    }

    try {
      socket.leave(roomid);
      const room: IRoom = await roomRepository.removePlayerById(roomid, playerid);
      io.to(roomid).emit("room:player:updated", room);
      socket.join("lobby");
      socket.leave(roomid);
      io.to("lobby").emit("lobby:updated", StripeRoom(room));
    } catch (e) {
      console.error(e);
    }
  });
  socket.on("room:prepare", async function (roomid: RoomID, playerid: PlayerID, prepare: boolean) {
    console.log("room:prepare");
    const room: IRoom = await roomRepository.findById(roomid);
    room.players = room.players.map((p) => {
      if (p && p.id === playerid) {
        return { ...p, prepared: prepare };
      } else {
        return p;
      }
    });
    try {
      io.to(room.id).emit("room:player:updated", room);
      if (room.players.filter((p) => p && p.prepared).length == MAX_PLAYER){ 
        room.players = room.players.map((p) => {
          if (p) {
            return { ...p, actionState: actionStates.CALL };
          }
          return p;
        });
        io.to(room.id).emit("room:player:updated", room);
        startGame(io, socket, room, handRepository);
      }
    } catch (error) {
      console.error({
        error: sanitizeErrorMessage(error),
      });
    }
  });
  socket.on("room:call", async function (roomid: RoomID, playerid: PlayerID, trump: Trump) {
    console.log("room:call");
    const room: IRoom = await roomRepository.findById(roomid);
    if (validateCall(trump, room.trump)) {
      room.trump = trump;
      room.players = room.players.map((p) => (p && p.id === playerid ? { ...p, cards: trump.lastCall as string[] } : p));
      roomRepository.save(room);
      try {
        io.to(room.id).emit("room:trump:updated", room);
      } catch (error) {
        console.error(error);
      }
    }
  });
  socket.on("room:kitty", async function (roomid: RoomID, playerid: PlayerID, cards: string[]) {
    console.log("room:kitty");
    const room: IRoom = await roomRepository.findById(roomid);
    room.kitty = cards;
    try {
      await handRepository.remove(playerid, cards);
    } catch (error) {
      console.error(error);
    }
  });
  socket.on("room:ticket", async function (roomid: RoomID, playerid: PlayerID, tickets: Ticket[]) {
    console.log("room:ticket");
    const room: IRoom = await roomRepository.findById(roomid);
    room.tickets = tickets;
    const playerIndex = room.players.findIndex((p) => p && p.id === playerid);
    try {
      room.players[playerIndex].camp = playerCamp.DEALER;
      room.players = room.players.map((p) => {
        return { ...p, actionState: actionStates.CLEAR, cards:[] };
      });
      room.players[playerIndex].actionState = actionStates.PLAY;
      io.to(room.id).emit("room:ticket:updated", room);
      io.to(room.id).emit("room:player:updated", room);
    } catch (error) {
      console.error(error);
    }
  });
  socket.on("room:play", async function (roomid: RoomID, playerid: PlayerID, cards: string[]) {
    console.log("room:play");
    const room: IRoom = await roomRepository.findById(roomid);
    const [nextIndex, newRoom] = resolvePlay(room,playerid,cards)
    await roomRepository.save(newRoom)
    try {
      await handRepository.remove(playerid, cards);
      io.to(room.id).emit("room:card:updated", room);
      // TODO: this may be no use
      if (room.players[nextIndex].socketid) {
        io.to(room.players[nextIndex].socketid).emit("player:play");
      }
    } catch (error) {
      console.error(error);
    }
  });
  // socket.on("lobby:update", updateRoom);
  // socket.on("lobby:delete", deleteRoom);
}
function startGame(io: Server, socket: Socket, room: IRoom, handRepository: InMemoryHandRepository) {
  io.to(room.id).emit("room:event", actionStates.CALL);
  dealCard(io, socket, room, handRepository);
}
function dealCard(io: Server, socket: Socket, room: IRoom, handRepository: InMemoryHandRepository) {
  const deck = newDeck();
  room.players.forEach((p) => {
    handRepository.init((p as Player).id);
  });
  // Dealing start from dealer or 0 when there is no dealer yet
  let index = room.dealerIndex || 0;
  const dealCardInterval = setInterval(async () => {
    if (deck.length > 6) {
      const card = deck.pop() as string;
      try {
        await handRepository.add((room.players[index] as Player).id, [card]);
        io.to((room.players[index] as Player)?.socketid).emit("player:deal", [card]);
      } catch (error) {
        console.error(error);
      }
      index = (index + 1) % 6;
    } else {
      clearInterval(dealCardInterval);
      setTimeout(async () => {
        await buryCard(io, socket, room, handRepository, deck);
      }, 1000);
    }
  }, 30);
}
async function buryCard(io: Server, socket: Socket, room: IRoom, handRepository: InMemoryHandRepository, deck: string[]) {
  if (!room.dealerIndex && room.trump.callerId){ 
    room.dealerIndex = room.players.findIndex((p) => p && p.id === room.trump.callerId);
  }
  room.initiatorIndex = room.dealerIndex
  try {
    room.players = room.players.map((p,idx) => {
      if (p && room.dealerIndex  === idx) {
        return { ...p, actionState: actionStates.KITTY };
      }else if(p){
        return { ...p, actionState: actionStates.CLEAR };
      }
      return p;
    });
    io.to(room.id).emit("room:player:updated", room);
    io.to((room.players[room.dealerIndex as number] as Player).socketid).emit("player:kitty", deck);
    await handRepository.add((room.players[room.dealerIndex as number] as Player).id, deck);
  } catch (error) {
    console.error(error);
  }
}

function validateCall(newtrump: Trump, trump: Trump) {
  return newtrump.count > trump.count;
}
