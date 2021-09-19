import EventEmitter = require("eventemitter3");
import { sound } from '@pixi/sound';
import * as PIXI from "pixi.js";
import { OPTIONS } from "../constants/dimension";
import { GameRoom } from "../gameroom";
import { adjustToCenterOfContainer, makeInteractive, renderContainer } from "../helpers/helper";
import { Button } from "./button";

export class Options extends PIXI.Container {
  cards: string[];
  room: GameRoom;
  audioSwitch: boolean;
  constructor(room:GameRoom) {
    super();
    this.room = room;
    this.audioSwitch = true;
    this.renderIcons();
    renderContainer(this, this.room, OPTIONS.X,OPTIONS.Y)
  }
  renderIcons(): void {
    const setting: PIXI.Sprite = PIXI.Sprite.from(
      PIXI.Loader.shared.resources["icon"].textures["setting.png"]
    );
    setting.anchor.set(0.5, 0)
    setting.x = OPTIONS.OFFSET_X
    setting.y = OPTIONS.OFFSET_Y;

    const reverse: PIXI.Sprite = PIXI.Sprite.from(
      PIXI.Loader.shared.resources["icon"].textures["reverse.png"]
    );
    reverse.anchor.set(0.5, 0)
    reverse.x = OPTIONS.OFFSET_X + OPTIONS.GAP *2;
    reverse.y = OPTIONS.OFFSET_Y;
    const audio: PIXI.Sprite = PIXI.Sprite.from(
      PIXI.Loader.shared.resources["icon"].textures["audio.png"]
    );
    audio.anchor.set(0.5, 0)
    audio.x = OPTIONS.OFFSET_X + OPTIONS.GAP * 3;
    audio.y = OPTIONS.OFFSET_Y;

    const info: PIXI.Sprite = PIXI.Sprite.from(
      PIXI.Loader.shared.resources["icon"].textures["info.png"]
    );
    info.anchor.set(0.5, 0)
    info.x = OPTIONS.OFFSET_X + OPTIONS.GAP * 1;
    info.y = OPTIONS.OFFSET_Y;

    this.addChild(info);
    this.addChild(reverse);
    this.addChild(audio);
    // this.addChild(leader);
    // this.addChild(setting);

    makeInteractive(info, () => {
      window.open("/")
    });
    makeInteractive(reverse, () => {
      this.room.app.eventHandler.emit("room:leave")
    });
    makeInteractive(audio, () => {
      if(this.audioSwitch){
        sound.stop("music");
      }else{
        sound.play("music");
      }
      this.audioSwitch = !this.audioSwitch;
    });
    makeInteractive(setting, () => {
      console.log("setting");
    });
  }
}
