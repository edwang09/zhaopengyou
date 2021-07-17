import * as PIXI from "pixi.js";
import EventEmitter = require("eventemitter3");
import { io, Socket } from "socket.io-client";
import { Loader } from "./loader";
import { Background } from "./background";
import { Lobby } from "./lobby";
import { Register } from "./register";
import { GameRoom } from "./gameroom";
import { Response, IRoom, ILobbyRoom, ClientEvents, ServerEvents, RoomID, Trump, Ticket, Player } from "./interfaces/ISocket";
import { actionStates } from "./enums/enums";
const SERVER_URL = "ws://localhost:3000";

export class GameApp extends PIXI.Application{
  //util
  eventHandler: EventEmitter;
  socket: Socket<ServerEvents, ClientEvents>;
  //data
  userData: Player;
  roomId: RoomID;
  //childern
  gameroom: GameRoom;
  lobby: Lobby;
  background: Background;
  register: Register;
  cb: () => void;

  constructor(parent: HTMLElement, width: number, height: number, cb = ()=>{}) {
    super({width, height, forceCanvas:true});
    this.cb = cb
    document.body.appendChild(this.view);
    // if(parent.lastElementChild) parent.replaceChild(this.view, parent.lastElementChild); // Hack for parcel HMR

    const loader: Loader = new Loader();
    loader.load(this.onAssetsLoaded.bind(this));
    console.log("app created")
  }

  onAssetsLoaded() {
    console.log("app asset loaded")
    this.eventHandler = new EventEmitter();
    this.handleEvents();
    this.socket = io(SERVER_URL);
    this.handleSocket();
    this.background = new Background(this);
    this.lobby = new Lobby(this);
    this.cb()
  }
  handleEvents(): void {
    this.eventHandler
      .on("lobby:join", (roomid) => {
        const player = this.userData;
        this.socket.emit("lobby:join", roomid, player, this.handleRoomJoin.bind(this));
      })
      .on("lobby:create", (name?: string) => {
        const room: IRoom = {
          name: name || `${this.userData.name}'s room`,
          players: [this.userData, null, null, null, null, null],
          trump: {number:"02", count:0, lastCall:[]},
          startLevel: "02",
        };
        this.socket.emit("lobby:create", room,this.userData, (res: Response<IRoom>) => {
          if ("error" in res) {
            console.error(res);
          } else {
            console.log(`room created`);
            window.sessionStorage.setItem("roomId", res.data.id);
            this.roomId = res.data.id
            this.arrangeRoom(res.data);
            // delete this afterwards
            this.socket.emit("room:prepare", this.roomId,this.userData.id, true)
          }
        });
      })
      .on("room:leave", ()=>{
        console.log("room:leave")
        this.socket.emit("lobby:leave", this.roomId,this.userData.id)
        this.roomId = null
        this.distroyRoom()
      })
      .on("room:prepare", (prepared:boolean)=>{
        console.log("room:prepare")
        this.socket.emit("room:prepare", this.roomId,this.userData.id, prepared)
      })
      .on("room:call", (trump:Trump)=>{
        console.log("room:call")
        this.socket.emit("room:call", this.roomId,this.userData.id, trump)
      })
      .on("room:kitty", (kitty:string[])=>{
        console.log("room:kitty")
        this.socket.emit("room:kitty", this.roomId,this.userData.id, kitty)
      })
      .on("room:ticket", (tickets:Ticket[])=>{
        console.log("room:ticket")
        this.socket.emit("room:ticket", this.roomId,this.userData.id, tickets)
      })
      .on("room:play", (cards:string[])=>{
        console.log("room:play")
        this.socket.emit("room:play", this.roomId,this.userData.id, cards)
      })
  }
  handleSocket(): void {
    this.socket.on("connect", () => {
      this.registerUser();
    });
    this.socket.on("disconnect", () => {
      console.log("socket disconnect");
    });
    this.socket.on("lobby:created", (room: ILobbyRoom) => {
      console.log("lobby:created");
      this.lobby.appendRoom(room);
    });
    this.socket.on("lobby:list", (rooms: ILobbyRoom[]) => {
      console.log("lobby:created");
      this.lobby.listRoom(rooms);
    });
    this.socket.on("lobby:updated", (room: ILobbyRoom) => {
      console.log("lobby:updated");
      this.lobby.updateRoom(room);
    });
    this.socket.on("room:player:updated", (room: IRoom) => {
      console.log("room:player:updated : " + room.players)
      this.gameroom.updatePlayers(room);
      this.gameroom.switchState(room)

    });
    this.socket.on("room:card:updated", (room: IRoom) => {
      console.log("room:card:updated : " + room.players)
      this.gameroom.updatePlayerCards(room);
      this.gameroom.switchState(room)
    });
    this.socket.on("room:event", (actionState: actionStates) => {
      this.handleActionState(actionState)
    });
    this.socket.on("player:deal", (cards: string[]) => {
      console.log("player:deal : ",cards)
      this.gameroom.dealHands(cards)
    });
    
    this.socket.on("player:kitty", (cards: string[]) => {
      console.log("player:kitty : ",cards)
      this.gameroom.dealKittys(cards)
      this.gameroom.action.switchState(actionStates.KITTY)
    });
    this.socket.on("room:trump:updated", (room: IRoom) => {
      console.log("player:trump:updated : ", room.trump)
      this.gameroom.updateTrump(room);
    });
    this.socket.on("room:ticket:updated", (room: IRoom) => {
      console.log("player:ticket:updated : ", room.tickets)
      this.gameroom.updatePlayers(room);
      this.gameroom.updateTicket(room);    
      this.gameroom.switchState(room)
    });
    this.socket.on("player:play", () => {
      this.gameroom.action.switchState(actionStates.PLAY);
    });
  }
  handleActionState(actionState: actionStates) {
    this.gameroom.action.switchState(actionState)
  }

  registerUser(): void {
    const user = window && window.sessionStorage ? window.sessionStorage.getItem("userData") : undefined;
    const roomid = window && window.sessionStorage ? window.sessionStorage.getItem("roomId") : undefined;
    if (user === null) {
      this.register = new Register(this);
      this.register.show((userData: Player) => {
        window.sessionStorage.setItem("userData", JSON.stringify(userData));
        this.userData = userData;
        this.register.hide();
        this.lobby.show();
        console.log("lobby")
      });
    } else if (roomid === null) {
      this.userData = JSON.parse(user);
      this.lobby.show();
      console.log("lobby")
    } else {
      this.userData = JSON.parse(user);
      console.log("auto rejoining room")
      this.socket.emit("lobby:join", roomid, this.userData, this.handleRoomJoin.bind(this));
    }
  }
  arrangeRoom(roomData: IRoom): void {
    this.lobby.hide();
    console.log("lobby")
    if (this.gameroom === undefined){
      this.gameroom = new GameRoom(this, roomData);
    }
    this.gameroom.updateTicket(roomData)
    this.gameroom.updatePlayers(roomData)
    this.gameroom.updateTrump(roomData)
    this.gameroom.updatePlayerCards(roomData)
    this.gameroom.switchState(roomData)
  }
  distroyRoom() {
    this.lobby.show();
    console.log("lobby")
    this.stage.removeChild(this.gameroom)
    this.gameroom = null
  }
  handleRoomJoin(res: Response<{room:IRoom, hand?:string[]}>){
    if ("error" in res) {
      console.error(res);
      window.sessionStorage.removeItem("roomId");
      this.registerUser();
    } else {
      console.log(res.data)
      this.roomId = res.data.room.id
      window.sessionStorage.setItem("roomId", res.data.room.id);
      console.log(`room joined`);
      this.arrangeRoom(res.data.room);
      this.gameroom.dealHands(res.data.hand || [])
    }
  }
}
