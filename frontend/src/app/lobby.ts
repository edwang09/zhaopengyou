import * as PIXI from "pixi.js";
import {
  makeInteractive,
  adjustToCenterOfContainer,
  addText,
} from "./helpers/helper";
// import TextInput = require("pixi-text-input");
import { Button } from "./components/button";
import { buttonColor } from "./enums/enums";
import { subtitle, white } from "./textstyle";
import EventEmitter = require("eventemitter3");
import { Room } from "./interfaces/ISocket";
export class Lobby {
  app: PIXI.Application;
  container: PIXI.Container;
  modal: PIXI.Sprite;
  // input: TextInput;
  pageNumber: number;
  globalEventHandler: EventEmitter;
  roomList: Room[];
  callback;
  constructor(app: PIXI.Application, globalEventHandler: EventEmitter) {
    this.app = app;
    this.globalEventHandler = globalEventHandler;
    this.pageNumber = 1;
    this.roomList = [];
    this.initializeContainer();
    this.init();
  }

  init(): void {
    this.displayBackground();
    this.displayNavigator();
    this.displayCreateButton();
  }
  displayCreateButton(): void {
    const createButton = new Button(buttonColor.GREEN, "Create", () => {
      this.createRoom();
    });
    adjustToCenterOfContainer(createButton, 200, 200);
    this.modal.addChild(createButton);
  }
  displayNavigator(): void {
    const tag = PIXI.Sprite.from(PIXI.Loader.shared.resources["tag"].texture);
    const arrowsheet: PIXI.Spritesheet =
      PIXI.Loader.shared.resources["arrow"].spritesheet;
    const arrowleft: PIXI.Sprite = new PIXI.Sprite(
      arrowsheet.textures["left.png"]
    );
    const arrowright: PIXI.Sprite = new PIXI.Sprite(
      arrowsheet.textures["right.png"]
    );
    makeInteractive(arrowleft, () => {
      console.log("left");
    });
    makeInteractive(arrowright, () => {
      console.log("right");
    });
    addText(tag, `${this.pageNumber}`, white);
    adjustToCenterOfContainer(tag, -150, 200);
    adjustToCenterOfContainer(arrowleft, -300, 200);
    adjustToCenterOfContainer(arrowright, 0, 200);
    this.modal.addChild(tag);
    this.modal.addChild(arrowleft);
    this.modal.addChild(arrowright);
  }

  listRooms(roomList: Room[]): void {
    roomList.map((rm, id) => {
      this.displayRoom(rm, id);
    });
  }
  displayRoom(room: Room, id: number): void {
    const roomField = PIXI.Sprite.from(
      PIXI.Loader.shared.resources["field"].texture
    );
    roomField.x = -100;
    roomField.y = -180 + id * 140;
    const roomButton = new Button(buttonColor.GREEN, "JOIN", () => {
      console.log("join");
      this.globalEventHandler.emit("lobby:join", room.id);
    });
    roomButton.anchor.set(0.5);
    roomField.anchor.set(0.5);

    const textName = new PIXI.Text(room.name, white);
    textName.anchor.set(0.5);
    textName.x = -150;
    textName.y = 0;
    roomField.addChild(textName);

    const textPlayer = new PIXI.Text(
      `${room.players.length} players`,
      subtitle
    );
    textPlayer.anchor.set(0.5);
    textPlayer.x = 150;
    textPlayer.y = 0;
    roomField.addChild(textPlayer);

    roomButton.x = 270;
    roomButton.y = -180 + id * 140;
    this.modal.addChild(roomField);
    this.modal.addChild(roomButton);
  }
  show(): void {
    this.container.visible = true;
  }
  hide(): void {
    this.container.visible = false;
  }
  displayBackground(): void {
    const modalTexture = PIXI.Loader.shared.resources["modal-wide"].texture;
    this.modal = PIXI.Sprite.from(modalTexture);
    adjustToCenterOfContainer(this.modal, 0, 0);
    this.modal.height = modalTexture.height;
    this.modal.width = modalTexture.width;
    this.container.addChild(this.modal);
  }

  initializeContainer(): void {
    this.container = new PIXI.Container();
    this.container.height = this.app.view.height;
    this.container.width = this.app.view.width;
    this.container.x = this.app.view.width / 2;
    this.container.y = this.app.view.height / 2;
    this.container.visible = false;
    this.container.interactive = true;
    this.app.stage.addChild(this.container);
  }
  appendRoom(room: Room): void {
    this.roomList = [...this.roomList, room];
    this.listRooms(this.roomList);
  }
  listRoom(data: Room[]): void {
    this.roomList = data;
    this.listRooms(this.roomList);
  }
  updateRoom(room: Room): void {
    this.roomList = this.roomList.map((currentRoom) => {
      if (currentRoom.id === room.id) return room;
      return currentRoom;
    });
    this.listRooms(this.roomList);
  }
  createRoom(name?: string): void {
    this.globalEventHandler.emit("lobby:create", name);
  }
}
