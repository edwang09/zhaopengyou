import * as PIXI from "pixi.js";
import { buttonColor } from "../enums/enums";
import {white} from "../textstyle"
import { makeInteractive, addText } from "../helpers/helper";

export class Button extends PIXI.AnimatedSprite {
  constructor(colorEnum: buttonColor, textMessage:string, cb:() => void) {
    const buttonsheet: PIXI.Spritesheet =
    PIXI.Loader.shared.resources["button"].spritesheet;
    let color = "green";
    switch (colorEnum) {
      case buttonColor.GREEN:
        color = "green";
        break;
      case buttonColor.RED:
        color = "red";
        break;
      case buttonColor.BLUE:
        color = "blue";
        break;
      default:
        break;
    }
    const animatedButton = [
      buttonsheet.textures[`button-${color}-0.png`],
      buttonsheet.textures[`button-${color}-2.png`],
      buttonsheet.textures[`button-${color}-3.png`],
      buttonsheet.textures[`button-${color}-1.png`]
    ];
    super(animatedButton);
    this.anchor.set(0.5)
    addText(this, textMessage, white);

    makeInteractive(this,()=>{
        this.gotoAndStop(2);
        cb();
    })
  }

}
