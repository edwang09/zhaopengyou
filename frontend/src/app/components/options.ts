import EventEmitter = require("eventemitter3");
import * as PIXI from "pixi.js";
import { OPTIONS } from "../constants/dimension";
import { adjustToCenterOfContainer, makeInteractive } from "../helpers/helper";
import { Button } from "./button";

export class Options extends PIXI.Container {
  cards: string[];
  eventHandler: EventEmitter;
  constructor(eventHandler: EventEmitter) {
    super();
    this.eventHandler = eventHandler;
    this.renderIcons();
  }
  renderIcons(): void {
    const info: PIXI.Sprite = PIXI.Sprite.from(
      PIXI.Loader.shared.resources["icon"].textures["info.png"]
    );
    info.anchor.set(0.5, 0)
    info.x = OPTIONS.OFFSET_X + OPTIONS.GAP *3;
    info.y = OPTIONS.OFFSET_Y;

    const leader: PIXI.Sprite = PIXI.Sprite.from(
      PIXI.Loader.shared.resources["icon"].textures["leader.png"]
    );
    leader.anchor.set(0.5, 0)
    leader.x = OPTIONS.OFFSET_X + OPTIONS.GAP * 1;
    leader.y = OPTIONS.OFFSET_Y;

    const reverse: PIXI.Sprite = PIXI.Sprite.from(
      PIXI.Loader.shared.resources["icon"].textures["reverse.png"]
    );
    reverse.anchor.set(0.5, 0)
    reverse.x = OPTIONS.OFFSET_X
    reverse.y = OPTIONS.OFFSET_Y;

    const audio: PIXI.Sprite = PIXI.Sprite.from(
      PIXI.Loader.shared.resources["icon"].textures["audio.png"]
    );
    audio.anchor.set(0.5, 0)
    audio.x = OPTIONS.OFFSET_X + OPTIONS.GAP * 4;
    audio.y = OPTIONS.OFFSET_Y;

    const setting: PIXI.Sprite = PIXI.Sprite.from(
      PIXI.Loader.shared.resources["icon"].textures["setting.png"]
    );
    setting.anchor.set(0.5, 0)
    setting.x = OPTIONS.OFFSET_X + OPTIONS.GAP * 2;
    setting.y = OPTIONS.OFFSET_Y;

    this.addChild(info);
    this.addChild(leader);
    this.addChild(reverse);
    this.addChild(audio);
    this.addChild(setting);

    makeInteractive(info, () => {
      console.log("info");
    });
    makeInteractive(leader, () => {
      console.log("leader");
    });
    makeInteractive(reverse, () => {
      console.log("reverse");
    });
    makeInteractive(audio, () => {
      console.log("audio");
    });
    makeInteractive(setting, () => {
      console.log("setting");
    });
  }
}
