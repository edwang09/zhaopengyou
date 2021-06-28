import EventEmitter = require("eventemitter3");
import * as PIXI from "pixi.js";
import { OPTIONS } from "../constants/dimension";
import { GameRoom } from "../gameroom";
import { adjustToCenterOfContainer, makeInteractive, renderContainer } from "../helpers/helper";
import { Button } from "./button";

export class Options extends PIXI.Container {
  cards: string[];
  room: GameRoom;
  constructor(room:GameRoom) {
    super();
    this.room = room;
    this.renderIcons();
    renderContainer(this, this.room, OPTIONS.X,OPTIONS.Y)
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
      this.room.app.eventHandler.emit("room:leave")
    });
    makeInteractive(audio, () => {
      console.log("audio");
    });
    makeInteractive(setting, () => {
      console.log("setting");
    });
  }
}
