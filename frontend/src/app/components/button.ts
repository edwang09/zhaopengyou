import * as PIXI from "pixi.js";
import { buttonColor } from "../enums/enums";
import {white} from "../textstyle"
import { makeInteractive, addText } from "../helpers/helper";

export class Button extends PIXI.AnimatedSprite {
  textHandler: PIXI.Text;
  constructor(colorEnum: buttonColor, textMessage:string, cb:() => void) {
    const animatedButton = createSpriteSheet(colorEnum)
    super(animatedButton);
    this.anchor.set(0.5)
    this.textHandler = addText(this, textMessage, white);

    makeInteractive(this,()=>{
        cb();
    })
  }
  public setColor(colorEnum: buttonColor){
    const animatedButton = createSpriteSheet(colorEnum);
    (this as PIXI.AnimatedSprite).textures = animatedButton
  }

  public setText(textMessage:string){
    this.textHandler.text = textMessage;
  }
  public toggleDisable(on:boolean){
    this.interactive = on;
    this.gotoAndStop(on?1:0)
  }

}
function createSpriteSheet(colorEnum: buttonColor): PIXI.Texture[]{
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
  return [
    buttonsheet.textures[`button-${color}-0.png`],
    buttonsheet.textures[`button-${color}-2.png`],
    buttonsheet.textures[`button-${color}-3.png`],
    buttonsheet.textures[`button-${color}-1.png`]
  ];
}