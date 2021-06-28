import * as PIXI from "pixi.js";
import { GameApp } from "./app";
import { renderSprite } from "./helpers/helper";

export class Background {
  app: GameApp;
  constructor(app: GameApp) {
    this.app = app;
    const background: PIXI.Sprite = PIXI.Sprite.from(PIXI.Loader.shared.resources["background"].texture);
    renderSprite(background, this.app.stage, this.app.view.width / 2, this.app.view.height / 2);
  }
}
