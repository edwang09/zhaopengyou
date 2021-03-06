import EventEmitter = require("eventemitter3");
import * as PIXI from "pixi.js";
import { cards, cardsDisplay } from "../constants/cards";
import { HUD_DIMENSION, OPTIONS } from "../constants/dimension";
import { GameRoom } from "../gameroom";
import { addText, adjustToCenterOfContainer, makeInteractive, renderContainer, renderSprite } from "../helpers/helper";
import { TSlevel } from "../textstyle";
import { Button } from "./button";
import { Hud } from "./hud";

export class Level extends PIXI.Sprite {
  hud: Hud;
    text: PIXI.Text;
  constructor(hud: Hud, level:string) {
    super(PIXI.Loader.shared.resources["star"].texture);
    this.hud = hud;
    this.text = addText(this, cardsDisplay[cards.indexOf(level)], TSlevel);
    renderSprite(this, this.hud, 30, 45);
  }
  updateLevel(level:string):void{
      this.text.text = cardsDisplay[cards.indexOf(level)]
  }
}
