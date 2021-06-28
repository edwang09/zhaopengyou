import * as PIXI from "pixi.js";
import { CARD } from "../constants/dimension";
import { makeInteractive } from "../helpers/helper";

export class Card extends PIXI.Sprite {
  selected: boolean;
  card: string;
  originY:number;
  constructor(card: string, size = "normal", interactive = true) {
    const cardsheet: PIXI.Spritesheet = PIXI.Loader.shared.resources["card"].spritesheet;
    const cardtexture = cardsheet.textures[`${card}.png`];
    super(cardtexture);
    this.card = card;
    this.interactive = true
    switch (size) {
      case "normal":
        this.scale.set(CARD.NORMAL_SCALE);

        break;
        case "normal2":
          this.scale.set(CARD.NORMAL2_SCALE);
  
          break;
      case "small":
        this.scale.set(CARD.SMALL_SCALE);

        break;
      case "tiny":
        this.scale.set(CARD.TINY_SCALE);

        break;
    }
    this.anchor.set(0.5);
    
  }
}
