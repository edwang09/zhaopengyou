import * as PIXI from "pixi.js";
import { IPlayerData } from "../interfaces/playerData";
import {
    adjustToCenterOfContainer,
    addText,
  } from "../helpers/helper";
import { TSlevel, white } from "../textstyle";
import { HUD_DIMENSION } from "../constants/dimension";


  export class Hud extends PIXI.Container{
    cards:string[];
    constructor(player:IPlayerData) {
        super();
        this.height = HUD_DIMENSION.HEIGHT;
        this.width = HUD_DIMENSION.WIDTH;
        this.visible = true;
        this.displayAvatar(player.avatarIndex)
        this.displayLevel(player.level || 2)
        this.displayName(player.name || "player")
        this.displayCamp(player.camp || "unknown")
    }
    displayAvatar(avatarIndex:number):void{
        const avatar: PIXI.Sprite =
        PIXI.Sprite.from(PIXI.Loader.shared.resources["avatar"].spritesheet.textures[`a${avatarIndex}.png`]);
        this.addChild(avatar);
        adjustToCenterOfContainer(avatar, HUD_DIMENSION.WIDTH/2, 100);
    }
    displayLevel(level:number):void{
        const levelArray = ["2","3","4","5","6","7","8","9","10","J","Q","K","A"]
        const levelString = levelArray[level-2];
        const levelText:PIXI.Sprite = PIXI.Sprite.from(PIXI.Loader.shared.resources["star"].texture)
        // levelText.scale.set(1.2)
        addText(levelText, levelString, TSlevel)
        this.addChild(levelText);
        adjustToCenterOfContainer(levelText, 30, 35);

    }
    displayName(player:string):void{
        const playerText = new PIXI.Text(player, white);
        this.addChild(playerText);
        adjustToCenterOfContainer(playerText, 70, 35);
        
    }
    displayCamp(camp:string):void{
        //TODO: change color for different camp
        let color = "green";
        switch (camp) {
            default:
                color = "green"
                break;
        }
        const campText:PIXI.Sprite = PIXI.Sprite.from(PIXI.Loader.shared.resources["button"].spritesheet.textures[`button-${color}-0.png`])
        campText.scale.set(0.5)
        addText(campText, camp, white)
        this.addChild(campText);
        adjustToCenterOfContainer(campText, HUD_DIMENSION.WIDTH/2, 165);
    }

  }