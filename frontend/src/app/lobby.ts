import * as PIXI from "pixi.js";
import { makeInteractive, adjustToCenterOfContainer, addText, setPosition, renderSprite, renderContainer } from "./helpers/helper";
import { TextInput } from "./components/textinput";
import { Button } from "./components/button";
import { buttonColor } from "./enums/enums";
import { subtitle, white } from "./textstyle";
import { IRoom, ILobbyRoom } from "./interfaces/ISocket";
import { GameApp } from "./app";
import { ImageButton } from "./components/imageButton";
import { LobbyRoom } from "./components/lobbyRoom";
export class Lobby extends PIXI.Container {

  app: GameApp;
  background: PIXI.Sprite;
  input: TextInput;
  pageNumber: number;
  roomListData: ILobbyRoom[];
  callback;
  pageTag: PIXI.Sprite;
  arrowleft: ImageButton;
  arrowright: ImageButton;
  logout: Button;
  roomList: LobbyRoom[];
  pageTagNumber: PIXI.Text;
  constructor(app: GameApp) {
    super();
    this.app = app;
    this.pageNumber = 0;
    this.roomListData = [];
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
    this.pageTagNumber = addText(this.pageTag, `${this.pageNumber + 1}`, white);
    const arrowsheet: PIXI.Spritesheet = PIXI.Loader.shared.resources["arrow"].spritesheet;
    this.arrowleft = new ImageButton(arrowsheet.textures["left.png"],  () => {
      this.previousPage();
    });
    this.arrowright = new ImageButton(arrowsheet.textures["right.png"], () => {
      this.nextPage();
    });
    this.updateNavigator();
    renderSprite(this.pageTag, this, -150, 200);
    renderSprite(this.arrowleft, this, -300, 200);
    renderSprite(this.arrowright, this, 0, 200);
  }
  updateNavigator(){
    if(this.roomListData.length > 0 && Math.ceil(this.roomListData.length/3) < (this.pageNumber+1)) this.pageNumber = Math.ceil(this.roomListData.length/3)-1;
    this.arrowright.toggleDisable(this.hasNextPage())
    this.arrowleft.toggleDisable(this.hasPreviousPage())
  }
  nextPage(): void{
    this.pageNumber += 1;
    this.listRooms()
    this.pageTagNumber.text = (this.pageNumber + 1).toString()
  }
  hasNextPage():boolean{
    return Math.ceil(this.roomListData.length/3) > (this.pageNumber+1 );
  }
  previousPage(): void{
    this.pageNumber -= 1;
    this.listRooms()
    this.pageTagNumber.text = (this.pageNumber + 1).toString()
  }
  hasPreviousPage():boolean{
    return this.pageNumber > 0;
  }

  listRooms(): void {
    this.roomList.forEach(rl=>{
      this.removeChild(rl);
    })
    console.log(this.roomListData)
    this.roomList = this.roomListData.slice(this.pageNumber * 3, this.pageNumber * 3 + 3).map((rm, id) => {
      return new LobbyRoom(this.app, this, rm, id);
    });
    this.updateNavigator();
  }
  show(): void {
    this.visible = true;
  }
  hide(): void {
    this.visible = false;
  }

  appendRoom(room: ILobbyRoom): void {
    this.roomListData = [...this.roomListData, room];
    this.listRooms();
  }
  displayLobby(data: ILobbyRoom[]): void {
    this.roomListData = data;
    this.listRooms();
  }
  updateRoom(room: ILobbyRoom): void {
    this.roomListData = this.roomListData.map((currentRoom) => {
      if (currentRoom.id === room.id) return room;
      return currentRoom;
    });
    this.listRooms();
  }
  deleteRoom(roomid: string) {
    this.roomListData = this.roomListData.filter((currentRoom) => currentRoom.id !== roomid);
    console.log(this.roomListData)
    this.listRooms();
  }
  createRoom(name?: string): void {
    this.app.eventHandler.emit("lobby:create", name);
  }
}
