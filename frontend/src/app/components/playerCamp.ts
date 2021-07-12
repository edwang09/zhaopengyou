import EventEmitter = require("eventemitter3");
import * as PIXI from "pixi.js";
import { HUD_DIMENSION, OPTIONS } from "../constants/dimension";
import { playerCamp } from "../enums/enums";
import { GameRoom } from "../gameroom";
import { addText, adjustToCenterOfContainer, makeInteractive, renderContainer, renderSprite } from "../helpers/helper";
import { campStyle, playerName, TSlevel, white } from "../textstyle";
import { Button } from "./button";
import { Hud } from "./hud";

export class PlayerCamp extends PIXI.Container {
  hud: Hud;
  background: PIXI.Graphics;
  camptext: PIXI.Text;
  constructor(hud: Hud, playercamp = playerCamp.UNKNOWN) {
    super();
    this.hud = hud;
    this.background = new PIXI.Graphics();
    this.background.lineStyle(0);
    this.background.beginFill(this.getCampBackgroundColor(playercamp));
    this.background.drawRoundedRect(-45, -15, 90, 30, 6);
    this.background.endFill();
    this.camptext = new PIXI.Text(this.getCampText(playercamp), campStyle);
    renderContainer(this.background, this);
    renderSprite(this.camptext, this);
    renderContainer(this, this.hud, HUD_DIMENSION.WIDTH / 2, 155);
  }
  updateCamp(camp = playerCamp.UNKNOWN) {
    this.camptext.text = this.getCampText(camp);
    this.background.clear()
    this.background.lineStyle(0);
    this.background.beginFill(this.getCampBackgroundColor(camp));
    this.background.drawRoundedRect(-45, -15, 90, 30, 6);
    this.background.endFill();
  }
  getCampText(camp: playerCamp): string {
    switch (camp) {
      case playerCamp.DEALER:
        return "dealer";
      case playerCamp.HOUSE:
        return "house";
      case playerCamp.PLAYER:
        return "player";
      default:
        return "unknown";
    }
  }
  
  getCampBackgroundColor(camp: playerCamp): number {
    switch (camp) {
      case playerCamp.DEALER:
        return 0xaa0000;
      case playerCamp.HOUSE:
        return 0xaa0000;
      case playerCamp.PLAYER:
        return 0x0000aa;
      default:
        return 0x00aa00;
    }
  }
}
