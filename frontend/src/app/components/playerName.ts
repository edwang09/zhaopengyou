import EventEmitter = require("eventemitter3");
import * as PIXI from "pixi.js";
import { HUD_DIMENSION, OPTIONS } from "../constants/dimension";
import { GameRoom } from "../gameroom";
import { addText, adjustToCenterOfContainer, makeInteractive, renderContainer, renderSprite } from "../helpers/helper";
import { playerName, TSlevel } from "../textstyle";
import { Button } from "./button";
import { Hud } from "./hud";

export class PlayerName extends PIXI.Text {
  hud: Hud;
  constructor(hud: Hud, playername="Waiting...") {
    super(playername, playerName);
    this.hud = hud;
    renderSprite(this, this.hud, 70, 45);
  }
  update(playername="Waiting..."){
    this.text = playername
  }
}
