import * as PIXI from "pixi.js";
import { makeInteractive, adjustToCenterOfContainer, addText, setPosition, renderSprite, renderContainer } from "./helpers/helper";
import { TextInput } from "./components/textinput";
import { Button } from "./components/button";
import { buttonColor } from "./enums/enums";
import { subtitle, white } from "./textstyle";
import { IRoom, ILobbyRoom } from "./interfaces/ISocket";
import { GameApp } from "./app";
import { ImageButton } from "./components/imageButton";
export class Lobby extends PIXI.Container {
  app: GameApp;
  background: PIXI.Sprite;
  input: TextInput;
  pageNumber: number;
  roomList: ILobbyRoom[];
  callback;
  pageTag: PIXI.Sprite;
  arrowleft: ImageButton;
  arrowright: ImageButton;
  logout: Button;
  constructor(app: GameApp) {
    super();
    this.app = app;
    this.pageNumber = 1;
    this.roomList = [];
    this.visible = false;
    this.interactive = true;
    renderContainer(this, this.app.stage, this.app.view.width / 2, this.app.view.height / 2);
    this.displayBackground();
    this.displayNavigator();
    this.displayCreateButton();
    this.displayLogout()
  }

  displayBackground(): void {
    this.background = PIXI.Sprite.from(PIXI.Loader.shared.resources["modal-wide"].texture);
    renderSprite(this.background, this);
  }
  displayLogout(): void {
    this.logout = new Button(buttonColor.RED, "log out", ()=>{
      window.sessionStorage.removeItem("roomId");
      window.sessionStorage.removeItem("userData");
      this.hide()
      this.app.registerUser()
    })
    renderSprite(this.logout, this, 420, -320);
  }
  displayCreateButton(): void {
    const createButton = new Button(buttonColor.GREEN, "Create", () => {
      this.createRoom();
    });
    renderSprite(createButton, this, 200, 200);
  }
  displayNavigator(): void {
    this.pageTag = PIXI.Sprite.from(PIXI.Loader.shared.resources["tag"].texture);
    addText(this.pageTag, `${this.pageNumber}`, white);
    const arrowsheet: PIXI.Spritesheet = PIXI.Loader.shared.resources["arrow"].spritesheet;
    this.arrowleft = new ImageButton(arrowsheet.textures["left.png"], () => {
      console.log("left");
    });
    this.arrowright = new ImageButton(arrowsheet.textures["right.png"], () => {
      console.log("right");
    });
    renderSprite(this.pageTag, this, -150, 200);
    renderSprite(this.arrowleft, this, -300, 200);
    renderSprite(this.arrowright, this, 0, 200);
  }

  listRooms(roomList: ILobbyRoom[]): void {
    roomList.forEach((rm, id) => {
      this.displayRoom(rm, id);
    });
  }
  displayRoom(room: ILobbyRoom, id: number): void {
    const roomField = PIXI.Sprite.from(PIXI.Loader.shared.resources["field"].texture);
    const textName = new PIXI.Text(room.name, white);
    const textPlayer = new PIXI.Text(`${room.playernumber} players`, subtitle);
    const roomButton = new Button(buttonColor.GREEN, "JOIN", () => {
      this.app.eventHandler.emit("lobby:join", room.id);
    });
    renderSprite(roomField, this, -100, id*140-180)
    renderSprite(textName, this, -250, id*140-180)
    renderSprite(textPlayer, this, 0, id*140-180)
    renderSprite(roomButton, this, 270, 140*id-180)
  }
  show(): void {
    this.visible = true;
  }
  hide(): void {
    this.visible = false;
  }

  appendRoom(room: ILobbyRoom): void {
    this.roomList = [...this.roomList, room];
    this.listRooms(this.roomList);
  }
  listRoom(data: ILobbyRoom[]): void {
    this.roomList = data;
    this.listRooms(this.roomList);
  }
  updateRoom(room: ILobbyRoom): void {
    this.roomList = this.roomList.map((currentRoom) => {
      if (currentRoom.id === room.id) return room;
      return currentRoom;
    });
    this.listRooms(this.roomList);
  }
  createRoom(name?: string): void {
    this.app.eventHandler.emit("lobby:create", name);
  }
}
