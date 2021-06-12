import { Loader } from "./loader";
import { Background } from "./background";
import { Lobby } from "./lobby";
import { Register } from "./register";
import { IUserData } from "./interfaces/userdata";
import * as PIXI from "pixi.js";
import EventEmitter = require('eventemitter3');
import { io, Socket } from "socket.io-client";
import { Response, Room , ClientEvents, ServerEvents, RoomID} from "./interfaces/ISocket";
import { GameRoom } from "./gameroom";
import { IRoomData, IPlayerData } from "./interfaces/playerData";
const SERVER_URL = "ws://localhost:3000";
export class GameApp{
  private app: PIXI.Application;
  userData:IPlayerData;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  roomData:IRoomData;
  eventHandler:EventEmitter;
  socket: Socket<ServerEvents, ClientEvents>;
  lobby: Lobby;
  gameroom: GameRoom;

  constructor(parent: HTMLElement, width: number, height: number) {
    this.eventHandler = new EventEmitter();
    this.handleEvents();
    this.app = new PIXI.Application({
      width,
      height
    });
    parent.replaceChild(this.app.view, parent.lastElementChild); // Hack for parcel HMR
    
    // init Pixi loader
    const loader : Loader = new Loader();
    // Load assets
    loader.load(this.onAssetsLoaded.bind(this));

  }
  

  private onAssetsLoaded() {
    this.socket = io(SERVER_URL);
    this.handleSocket();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const background: Background = new Background(this.app);
    this.lobby = new Lobby(this.app, this.eventHandler);
    this.registerUser()
    //TODO: store user data only in register or globally ???
    // this.socket.emit("lobby:list")
  }
  handleEvents():void {
    this.eventHandler
    .on('lobby:join', (roomid)=>{
      console.log("join")
      const player = this.userData;
      this.socket.emit("lobby:join", roomid, player, (res: Response<Room>)=>{
        console.log(res)
        if ("error" in res){
          console.error(res)
        }else{
          console.log(`room joined`)
          console.log(res.data.players)
          window.sessionStorage.setItem("roomId", res.data.id)
          this.arrangeRoom(res.data)
        }
      })
    })
    .on('lobby:create', (name? :string)=>{
      const room: IRoomData = {
        name : name || `${this.userData.name}'s room`,
        players : [this.userData]
      }
      this.socket.emit("lobby:create", room, (res: Response<Room>)=>{
        if ("error" in res){
          console.error(res)
        }else{
          console.log(`room ${res.data} created`)
          window.sessionStorage.setItem("roomId", res.data.id)
          this.arrangeRoom(res.data)
        }
      })
    })
  }
  handleSocket():void {
    this.socket.on('connect', ()=>{
      console.log('socket connected');
    })
    this.socket.on('disconnect', ()=>{
      console.log('socket disconnect');
    })
    this.socket.on('lobby:created', (room: Room)=>{
      console.log("lobby:created")
      console.log(room)
      this.lobby.appendRoom(room)
    })
    this.socket.on('lobby:list', (rooms: Room[])=>{
      console.log("lobby:created")
      console.log(rooms)
      this.lobby.listRoom(rooms)
    })
    this.socket.on('lobby:updated', (room: Room)=>{
      console.log("lobby:updated")
      console.log(room)
      this.lobby.updateRoom(room)
    })
    this.socket.on('room:updated', (room: Room)=>{
      console.log("room:updated")
      console.log(room)
      this.roomData = room;
      this.gameroom.update(room)
    })
  }

  registerUser():void{
    const user = window.sessionStorage.getItem("userData")
    const roomid = window.sessionStorage.getItem("roomId")
    if (user === null){
      const register: Register = new Register(this.app);
      register.show((userData: IPlayerData)=>{
        window.sessionStorage.setItem("userData", JSON.stringify(userData))
        this.userData = userData;
        register.hide();
        this.lobby.show();
      });
    }else if (roomid === null){
      this.userData = JSON.parse(user);
      this.lobby.show();
    }else{
      this.userData = JSON.parse(user);
      this.socket.emit("lobby:join", roomid, this.userData, (res: Response<Room>)=>{
        console.log(res)
        if ("error" in res){
          console.error(res)
          window.sessionStorage.removeItem("roomId")
          this.registerUser();
        }else{
          console.log(`room joined`)
          console.log(res.data)
          this.arrangeRoom(res.data)
        }
      })
    }
  }
  arrangeRoom(room:Room):void{
    this.lobby.hide();
    this.roomData = room;
    console.log(this.roomData)
    this.gameroom = new GameRoom(this.app, this.userData, this.roomData, this.eventHandler);
  }



}
