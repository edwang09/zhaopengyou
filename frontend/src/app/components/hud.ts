import * as PIXI from "pixi.js";
import { IPlayerData } from "../interfaces/playerData";
import { adjustToCenterOfContainer, addText, renderContainer, makeInteractive } from "../helpers/helper";
import { playerName, TSlevel, white } from "../textstyle";
import { HUD_DIMENSION } from "../constants/dimension";
import { GameRoom } from "../gameroom";
import { Avatar } from "./avatar";
import { Level } from "./level";
import { PlayerName } from "./playerName";
import { PlayerCamp } from "./playerCamp";
import { Player } from "../interfaces/ISocket";

export class Hud extends PIXI.Container {
  cards: string[];
  room: GameRoom;
  avatar: Avatar;
  level: Level;
  playername: PlayerName;
  camp: PlayerCamp;
  container: PIXI.Container;
  player: Player;
  constructor(room: GameRoom, container: PIXI.Container, player: Player, x =  HUD_DIMENSION.USER_X, y = HUD_DIMENSION.USER_Y) {
    super();
    this.container = container;
    this.room = room;
    this.visible = true;
    if (player){
      this.player = player
      this.avatar = new Avatar(this, player.avatarIndex.toString())
      this.level = new Level(this, player.level)
      this.playername = new PlayerName(this, player.name)
      this.camp = new PlayerCamp(this, player.camp)
    }else{
      this.avatar = new Avatar(this, "b")
      this.playername = new PlayerName(this)
    }
    renderContainer(this, this.container, x,y)
    makeInteractive(this.avatar, ()=>{
      this.room.showPoints(this.player.id)
    })
  }
  update(player: Player) {
    if (player) {
      this.player = player
      this.avatar.updateAvatar(player.avatarIndex.toString())
      this.playername.update(player.name)
      if(!this.level) this.level = new Level(this, player.level)
      if(!this.camp) this.camp = new PlayerCamp(this, player.camp)
      this.level.updateLevel(player.level)
      this.camp.updateCamp(player.camp)
      this.level.visible = true
      this.camp.visible = true
    }else{
      this.avatar.updateAvatar("b")
      this.playername.update()
      if(this.level) this.level.visible = false
      if(this.camp) this.camp.visible = false
    }
  }
}
