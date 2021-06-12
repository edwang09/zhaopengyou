import { Errors, mapErrorDetails, sanitizeErrorMessage } from "../utils";
import { Components } from "../app";
import { ClientEvents, Response, ServerEvents } from "../events";
import { Server, Socket } from "socket.io";
import { v4 as uuid } from "uuid";
import {
  roomSchema,
  idSchema,
  Room,
  RoomID,
  Player,
  PlayerID,
  MAX_PLAYER,
} from "./room.schema";

export function registerRoomHandlers(
  io: Server<ClientEvents, ServerEvents>,
  socket: Socket<ClientEvents, ServerEvents>,
  components: Components
): void {
  const { roomRepository } = components;

  roomRepository.findAll().then((rooms: Room[]) => {
    socket.emit("lobby:list", rooms);
  });
  socket.on("disconnect", function () {
    socket.rooms.forEach(async (roomid:string)=>{
      socket.leave(roomid)
      if (roomid !== 'lobby'){
        const room:Room = await roomRepository.findById(roomid)
        room.players = room.players.filter((player) => player.socketid !== socket.id)
        roomRepository.save(room)
      }
    })
  });
  socket.on(
    "lobby:create",
    async function (
      payload: Omit<Room, "id">,
      callback: (res: Response<Room>) => void
    ) {
      // validate the payload
      const { error, value } = roomSchema.tailor("create").validate(payload, {
        abortEarly: false,
        stripUnknown: true,
      });
      if (error) {
        return callback({
          error: Errors.INVALID_PAYLOAD,
          errorDetails: mapErrorDetails(error.details),
        });
      }
      console.log(value.players[0])

      value.id = uuid();
      value.players[0].socketid = socket.id;

      // persist the entity
      try {
        await roomRepository.save(value);
        socket.join(value.id);
        io.to("lobby").emit("lobby:created", value);
      } catch (e) {
        return callback({
          error: sanitizeErrorMessage(e),
        });
      }

      // acknowledge the creation
      callback({
        data: value,
      });
    }
  );
  socket.on(
    "lobby:join",
    async function (
      roomid: RoomID,
      player: Player,
      callback: (res: Response<Room>) => void
    ) {
      const { error } = idSchema.validate(roomid);
      if (error) {
        return callback({
          error: Errors.ENTITY_NOT_FOUND,
        });
      }
      try {
        const room = await roomRepository.findById(roomid);
        if(room.players.some(p=>p.id === player.id)){
          room.players.map(p=>{
            if(p.id === player.id) return {...player, socketid:socket.id}
            return p;
          })
          callback({ data: room });
        }else if (room.players.length < MAX_PLAYER) {
          room.players.push({...player, socketid: socket.id});
          io.to("lobby").emit("lobby:updated", room);
          io.to(roomid).emit("room:updated", room);
          socket.join(roomid);
          console.log(room)
          callback({ data: room });
        } else {
          throw "maximum room capacity reached";
        }
      } catch (e) {
        callback({
          error: sanitizeErrorMessage(e),
        });
      }
    }
  );

  socket.on(
    "lobby:leave",
    async function (
      roomid: RoomID,
      playerid: PlayerID
    ) {
      const { error } = idSchema.validate(roomid);
      if (error) {
        return console.error({
          error: Errors.ENTITY_NOT_FOUND,
        });
      }

      try {
        const room = await roomRepository.findById(roomid);
        room.players.filter((player) => player.id !== playerid);
        io.to("lobby").emit("lobby:updated", room);
        socket.leave(roomid);
      } catch (e) {
        console.error({
          error: sanitizeErrorMessage(e),
        });
      }
    }
  );
  // socket.on("lobby:read", readRoom);
  // socket.on("lobby:update", updateRoom);
  // socket.on("lobby:delete", deleteRoom);
}
