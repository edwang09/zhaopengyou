import * as PIXI from "pixi.js";
import { CARD } from "../constants/dimension";
import { makeInteractive } from "../helpers/helper";


  export class Card extends PIXI.Sprite{
    selected: boolean;
    constructor(card: string, size="normal", interactive = true) {
        const cardsheet: PIXI.Spritesheet =PIXI.Loader.shared.resources["card"].spritesheet;
        const cardtexture = cardsheet.textures[`${card}.png`]
        super(cardtexture)
        this.scale.set(CARD.NORMAL_SCALE)
        if(size === "small"){
          this.scale.set(CARD.SMALL_SCALE)
        }
        this.anchor.set(0.5);
        if(interactive){

          this.interactive = true;
          makeInteractive(this, ()=>{
              this.selected = !this.selected;
              if(this.selected){
                this.y = this.y-CARD.POP_DISTANCE;
              }else{
                this.y = this.y+30;
              }
          });
        }
    }





  }