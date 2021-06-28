import EventEmitter = require("eventemitter3");
import * as PIXI from "pixi.js";
import { HUD_DIMENSION, OPTIONS } from "../constants/dimension";
import { GameRoom } from "../gameroom";
import { addText, adjustToCenterOfContainer, makeInteractive, renderContainer, renderSprite } from "../helpers/helper";
import { campStyle, playerName, TSlevel, white } from "../textstyle";
import { Button } from "./button";
import { Hud } from "./hud";

export class PlayerCamp extends PIXI.Container {

  hud: Hud;
  background: PIXI.Graphics;
  camptext: PIXI.Text;
  constructor(hud: Hud, playercamp = "unknown") {
    super();
    this.hud = hud;
    this.background = new PIXI.Graphics();
    this.background.lineStyle(0);
    this.background.beginFill(0x00aa00);
    this.background.drawRoundedRect(-45, -15, 90, 30, 6);
    this.background.endFill();
    this.camptext = new PIXI.Text(playercamp, campStyle);
    renderContainer(this.background, this);
    renderSprite(this.camptext, this);
    renderContainer(this, this.hud, HUD_DIMENSION.WIDTH / 2, 155);
  }  
  updateCamp(camp = "unknown") {
    this.camptext.text = camp
  }
}
