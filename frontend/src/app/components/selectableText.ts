import * as PIXI from "pixi.js";
import { makeInteractive } from "../helpers/helper";

export class SelectableText extends PIXI.Text {
  data: string;
  graphics: any;
  constructor(text: string, style: PIXI.TextStyle, data: string, cb: () => void) {
    super(text, style);
    this.data = data;
    this.graphics = new PIXI.Graphics();
    this.graphics.lineStyle(2, 0xFF00FF, 1);
    this.graphics.beginFill(0xffffff, 0.25);
    this.graphics.drawRoundedRect(0, 0, 25, 25, 8);
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
