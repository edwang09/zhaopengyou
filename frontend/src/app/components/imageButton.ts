import * as PIXI from "pixi.js";
import { makeInteractive } from "../helpers/helper";
export class ImageButton extends PIXI.Sprite {
  textHandler: PIXI.Text;
  defaultTexture: PIXI.Texture;
  constructor(texture: PIXI.Texture, cb: () => void) {
    super(texture);
    this.defaultTexture = texture;
    makeInteractive(this, () => {
      cb();
    });
  }
  public toggleDisable(on: boolean) {
    this.interactive = on;
  }
}
