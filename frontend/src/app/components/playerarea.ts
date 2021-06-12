import * as PIXI from "pixi.js";
import { IPlayerData } from "../interfaces/playerData";
import { Hud } from "./hud";
import { Hand } from "./hand";
import { PLAYER_AREA_DIMENSION,HUD_DIMENSION } from "../constants/dimension";


  export class PlayerArea extends PIXI.Container{
    cards:string[];
    constructor(player:IPlayerData, x:number, y:number, side:number) {
        super();
        this.height = PLAYER_AREA_DIMENSION.HEIGHT;
        this.width = PLAYER_AREA_DIMENSION.WIDTH;
        this.x = x;
        this.y = y;
        this.visible = true;
        this.displayHud(player, side)
        this.displayCards(side)
    }
    displayHud(player:IPlayerData, side:number):void{
        const hud = new Hud(player)
        this.addChild(hud)
        hud.x = side * (PLAYER_AREA_DIMENSION.WIDTH-HUD_DIMENSION.WIDTH)
        hud.y = 0
    }
    displayCards(side:number):void{
        const hand = new Hand(["h03", "d04", "s12"], "small", false, side);
        this.addChild(hand)
        hand.x = HUD_DIMENSION.WIDTH - side * HUD_DIMENSION.WIDTH
        hand.y = 0
    }



  }