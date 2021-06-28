import * as PIXI from "pixi.js";
import { makeInteractive } from "../helpers/helper";

export class SelectableSprite extends PIXI.Sprite {
  data: string;
  graphics: PIXI.Graphics;
  constructor(texture: PIXI.Texture, data: string, cb: () => void) {
    super(texture);
    this.data = data;
    this.graphics = new PIXI.Graphics();
    this.graphics.lineStyle(2, 0xFF00FF, 1);
    this.graphics.beginFill(0x650A5A, 0.25);
    this.graphics.drawRoundedRect(0, 0, 50, 50, 8);
    this.graphics.endFill();
    this.graphics.visible = false
    this.addChild(this.graphics)
    makeInteractive(this, () => {
      cb();
    });
  }
  toggle(on: boolean) {
    if (on){ 
      this.graphics.visible = true
    }else {
      this.graphics.visible = false
    }
  }
  
}
