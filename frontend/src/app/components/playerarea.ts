import * as PIXI from "pixi.js";
import { IPlayerData } from "../interfaces/playerData";
import { Hud } from "./hud";
import { Hand } from "./hand";
import { PLAYER_AREA_DIMENSION,HUD_DIMENSION } from "../constants/dimension";
import { handTypes } from "../enums/enums";
import { Play } from "./play";
import { renderContainer } from "../helpers/helper";
import { GameRoom } from "../gameroom";
import { Player } from "../interfaces/ISocket";


  export class PlayerArea extends PIXI.Container{


    cards:string[];
    hud: Hud;
    playHandler: Play;
    room: GameRoom;
    constructor(room:GameRoom, player:Player, x:number, y:number, side:number) {
        super();
        this.height = PLAYER_AREA_DIMENSION.HEIGHT;
        this.width = PLAYER_AREA_DIMENSION.WIDTH;
        this.x = x;
        this.y = y;
        this.room = room;
        this.visible = true;
        this.displayHud(player, side)
        this.displayCards(side)
        renderContainer(this, this.room, x,y)
    }
    displayHud(player:Player, side:number):void{
        this.hud = new Hud(this, player, side * (PLAYER_AREA_DIMENSION.WIDTH-HUD_DIMENSION.WIDTH),0)
    }
    displayCards(side:number):void{
        this.playHandler = new Play(this,HUD_DIMENSION.WIDTH - side * HUD_DIMENSION.WIDTH, 0, [], handTypes.PLAYER_CARD, side);
    }
    updatePlayer(player: Player) {
      this.hud.update(player)
    }
    updateCards(cards: string[] =[]) {
      this.playHandler.update(cards)
    }
}