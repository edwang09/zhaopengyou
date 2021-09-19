import * as PIXI from "pixi.js";
import { adjustToCenterOfContainer, makeInteractive } from "../helpers/helper";

export class SelectableSprite extends PIXI.Sprite {
  data: string;
  circle: PIXI.Sprite;
  constructor(texture: PIXI.Texture, data: string, cb: () => void) {
    super(texture);
    this.data = data;
    this.circle = new PIXI.Sprite(PIXI.Loader.shared.resources['circle'].texture);
    this.circle.visible = false
    this.circle.width = 90;
    this.circle.height = 90;
    adjustToCenterOfContainer(this.circle, this.width/2, this.height/2)
    this.addChild(this.circle)
    makeInteractive(this, () => {
      cb();
    });
  }
  toggle(on: boolean) {
    if (on){ 
      this.circle.visible = true
    }else {
      this.circle.visible = false
    }
  }
  
}
