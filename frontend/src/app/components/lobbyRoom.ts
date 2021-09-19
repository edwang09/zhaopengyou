import * as PIXI from "pixi.js";
import { GameApp } from "../app";
import { buttonColor } from "../enums/enums";
import { renderContainer, renderSprite } from "../helpers/helper";
import { ILobbyRoom } from "../interfaces/ISocket";
import { Button } from "./button";
import { subtitle, white } from "../textstyle";
import { Lobby } from "../lobby";
export class LobbyRoom extends PIXI.Container {
  app: GameApp;
  lobby: Lobby;

  constructor(app: GameApp, lobby: Lobby, room: ILobbyRoom, id: number) {
    super();
    this.app = app;
    this.lobby = lobby;
    renderContainer(this, this.lobby, 0, 140 * id - 180);
    this.displayRoom(room)
  }
  displayRoom(room: ILobbyRoom){
    const roomField = PIXI.Sprite.from(PIXI.Loader.shared.resources["field"].texture);
    const textName = new PIXI.Text(room.name, white);
    const textPlayer = new PIXI.Text(`${room.playernumber} players`, subtitle);
    const roomButton = new Button(buttonColor.GREEN, "JOIN", () => {
      this.app.eventHandler.emit("lobby:join", room.id);
    });
    renderSprite(roomField, this, -100, 0);
    renderSprite(textName, this, -250, 0);
    renderSprite(textPlayer, this, 0, 0);
    renderSprite(roomButton, this, 270, 0);
  }
}
