import * as PIXI from "pixi.js";
import { adjustToCenterOfContainer, makeInteractive } from "../helpers/helper";

export class SelectableText extends PIXI.Text {
  data: string;
  circle: PIXI.Sprite;
  constructor(text: string, style: PIXI.TextStyle, data: string, cb: () => void) {
    super(text, style);
    this.data = data;
    this.circle = new PIXI.Sprite(PIXI.Loader.shared.resources['circle'].texture);
    this.circle.visible = false
    this.addChild(this.circle)
    this.circle.width = 60;
    this.circle.height = 60;
    adjustToCenterOfContainer(this.circle, this.width/2, this.height/2)
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
