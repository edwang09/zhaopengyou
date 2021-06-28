import * as PIXI from "pixi.js";
import { makeInteractive } from "../helpers/helper";
export class ImageButton extends PIXI.Sprite {
  textHandler: PIXI.Text;
  constructor(texture: PIXI.Texture, cb: () => void) {
    super(texture);
    makeInteractive(this, () => {
      cb();
    });
  }
  public toggleDisable(on: boolean) {
    this.interactive = on;
  }
}
