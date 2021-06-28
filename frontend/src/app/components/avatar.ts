import EventEmitter = require("eventemitter3");
import * as PIXI from "pixi.js";
import { HUD_DIMENSION, OPTIONS } from "../constants/dimension";
import { GameRoom } from "../gameroom";
import { adjustToCenterOfContainer, makeInteractive, renderContainer, renderSprite } from "../helpers/helper";
import { Button } from "./button";
import { Hud } from "./hud";

export class Avatar extends PIXI.AnimatedSprite {
  cards: string[];
  hud: Hud;
  constructor(hud: Hud, avatarIndex: string) {
    const avatarTextures = [
      PIXI.Loader.shared.resources["avatar"].spritesheet.textures[`b${avatarIndex}.png`],
      PIXI.Loader.shared.resources["avatar"].spritesheet.textures[`y${avatarIndex}.png`],
    ];
    super(avatarTextures);
    this.hud = hud;
    renderSprite(this, this.hud, HUD_DIMENSION.WIDTH / 2, 100);
  }
  startBlink():void{
      this.gotoAndPlay(0)
  }
  stopBlink():void{
      this.gotoAndStop(1)
  }
  updateAvatar(avatarIndex: string):void{
    const avatarTextures = [
        PIXI.Loader.shared.resources["avatar"].spritesheet.textures[`b${avatarIndex}.png`],
        PIXI.Loader.shared.resources["avatar"].spritesheet.textures[`y${avatarIndex}.png`],
      ];
    this.textures = avatarTextures
  }
}
