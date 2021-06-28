import EventEmitter = require("eventemitter3");
import * as PIXI from "pixi.js";
import { HUD_DIMENSION, OPTIONS } from "../constants/dimension";
import { GameRoom } from "../gameroom";
import { addText, adjustToCenterOfContainer, makeInteractive, renderContainer, renderSprite } from "../helpers/helper";
import { TSlevel } from "../textstyle";
import { Button } from "./button";
import { Hud } from "./hud";
const levelArray = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];

export class Level extends PIXI.Sprite {
  hud: Hud;
    text: PIXI.Text;
  constructor(hud: Hud, level:number) {
    super(PIXI.Loader.shared.resources["star"].texture);
    this.hud = hud;
    this.text = addText(this, levelArray[level], TSlevel);
    renderSprite(this, this.hud, 30, 45);
  }
  updateLevel(level:number):void{
      this.text.text = levelArray[level]
  }
}
