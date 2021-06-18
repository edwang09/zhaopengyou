import * as PIXI from "pixi.js";
import { Hand } from "./components/hand";
import { Hud } from "./components/hud";
import { IPlayerData, IRoomData } from "./interfaces/playerData";
import { IUserData } from "./interfaces/userdata";
import EventEmitter = require('eventemitter3');
import { PlayerArea } from "./components/playerarea";
import { Player, Room } from "./interfaces/ISocket";
import { HUD_DIMENSION, OPTIONS, PLAYER_AREA_POSITION, TEST_CARDS, USER_HAND } from "./constants/dimension";
import { Options } from "./components/options";

export class GameRoom {
  app: PIXI.Application;
  container: PIXI.Container;
    userHud: Hud;
    userData: IUserData;
    // roomData: IRoomData;
    globalEventHandler: EventEmitter;
  constructor(app: PIXI.Application, userData: IUserData, roomData: IRoomData, globalEventHandler: EventEmitter) {
    this.app = app;
    this.globalEventHandler = globalEventHandler
    this.userData = userData
    this.initializeContainer();
    const user:IPlayerData = roomData.players.filter(p=>p.id === userData.id)[0]
    this.displayHand(user);
    this.displayUser(user);
    this.displayPlayers(roomData.players)
    this.displayOptions()
  }
  initializeContainer(): void {
    console.log("gameroom");
    this.container = new PIXI.Container();
    this.container.height = this.app.screen.height;
    this.container.width = this.app.screen.width;
    this.container.x = 0;
    this.container.y = 0;
    this.container.visible = true;
    this.container.interactive = true;
    this.app.stage.addChild(this.container);
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  displayHand(user:IPlayerData): void {
      //TODO: initialize with user cards
    const handArea = new Hand(TEST_CARDS);
    this.container.addChild(handArea);
    handArea.x = USER_HAND.X;
    handArea.y = USER_HAND.Y;
  }
  displayUser(user:IPlayerData): void {
    this.userHud = new Hud(user);
    this.userHud.x = HUD_DIMENSION.USER_X;
    this.userHud.y = HUD_DIMENSION.USER_Y;
    this.container.addChild(this.userHud);
  }
  displayPlayers(players? : IPlayerData[]): void {
    console.log(players)
    players = this.arrangePlayer(players)
    console.log(players)
        players.map((p, id)=>{
        const player = new PlayerArea(p, 
            PLAYER_AREA_POSITION[id].X,
            PLAYER_AREA_POSITION[id].Y,
            PLAYER_AREA_POSITION[id].SIDE)
        this.container.addChild(player)
    })
  }

  displayOptions():void{
    const option:Options = new Options(this.globalEventHandler);
    this.container.addChild(option)
    option.x = OPTIONS.X
    option.y = OPTIONS.Y
  }





















  arrangePlayer( players: IPlayerData[]): IPlayerData[]{
    const uindex = players.findIndex((p)=>p.id === this.userData.id)
    return [...players.slice(0,uindex),...players.slice(uindex+1)]
  }
  update(roomData: Room):void{
      console.log(roomData)
      this.container.removeChildren()
      const players = roomData.players
      const user:IPlayerData = players.filter(p=>p.id === this.userData.id)[0]
      console.log(user)
      this.displayHand(user);
      this.displayUser(user);
      this.displayPlayers(players)

  }
}
