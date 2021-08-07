import * as PIXI from "pixi.js";
import { defaultStyle, white } from "../textstyle";
import { TextInput } from "../components/textinput";
import { Button } from "../components/button";
import { buttonColor, handTypes } from "../enums/enums";
import { IUserData } from "../interfaces/userdata";
import { makeInteractive, adjustToCenterOfContainer, numberToName, getPoints } from "../helpers/helper";
import { v4 as uuidv4 } from 'uuid';
import { IPlayerData } from "../interfaces/playerData";
import { GameRoom } from "../gameroom";
import { Player, Ticket } from "../interfaces/ISocket";
import { cardToName, numberToOrder } from "../helpers/helper";
import { SelectableSprite } from "./selectableSprite";
import { SelectableText } from "./selectableText";
import { Hand } from "./hand";
import { Play } from "./play";

export class PointBoard extends  PIXI.Container{
  input: TextInput;
  avatarIndex: number;
  callback;
room: GameRoom;
tickets:{number:string, suit:string, sequence:number}[] = [{number:"14", suit:"h", sequence:1},{number:"14", suit:"h", sequence:1}]
  app: PIXI.Application;
  labelHandler: any = [[],[]];
  suitSelectorHandler: SelectableSprite[][] =[[],[]];
  textSelectorHandler: SelectableText[][] = [[],[]];
  sequenceSelectorHandler: SelectableText[][] = [[],[]];
    kittyCard: Play;
    card: Play;
    played: Play;
    title: PIXI.Text;
    subtitle: any;
  subtitle2: PIXI.Text;
  lastplay: Play;
  constructor(app:PIXI.Application, room: GameRoom) {
      super();
      this.app = app
      this.room = room;
      this.avatarIndex = 0;
      this.height = this.app.view.height;
      this.width = this.app.view.width;
      this.x = this.app.view.width / 2;
      this.y = this.app.view.height / 2;
      this.zIndex = 1000;
      this.visible = false;
      this.interactive = true;
      room.addChild(this);
      this.init();
  }

  init(): void {
    
    this.displayBackground();
    this.displayButton();
  }

  hide(): void {
    this.removeChild(this.card)
    this.removeChild(this.lastplay)
    this.removeChild(this.subtitle)
    this.removeChild(this.subtitle2)
    this.removeChild(this.title)
    this.visible = false;
  }
  show(player:Player): void {
    this.card = new Play(this, -200, -80, player.points, handTypes.SHOW_DOWN);
    this.addChild(this.card)
    this.lastplay = new Play(this, -200, 100, player.lastplay, handTypes.SHOW_DOWN);
    this.addChild(this.lastplay)
    this.subtitle = new PIXI.Text("Total : " + getPoints(player.points))
    this.subtitle.y = -20;
    this.subtitle.x = -200;
    this.addChild(this.subtitle);
    this.subtitle2 = new PIXI.Text("Last Play : ")
    this.subtitle2.y = 20;
    this.subtitle2.x = -200;
    this.addChild(this.subtitle2);
    this.title = new PIXI.Text("Points by : " + player.name)
    this.title.y = -170;
    this.title.x = -200;
    this.addChild(this.title);
    this.visible = true;
  }
  displayBackground(): void {
    const modalTexture = PIXI.Loader.shared.resources["modal-wide"].texture;
    const modal = PIXI.Sprite.from(modalTexture);
    adjustToCenterOfContainer(modal, 0, 0);
    console.log(modal.x);
    console.log(modal.y);
    modal.height = modalTexture.height-140;
    modal.width = modalTexture.width-180;
    this.addChild(modal);
  }
  displayButton(): void {
    const button: Button = new Button(buttonColor.GREEN,"Got it", ()=>{
        this.removeChild(this.card)
        this.removeChild(this.subtitle)
        this.removeChild(this.title)
        this.hide()
    });
    adjustToCenterOfContainer(button, 0, 160);
    this.addChild(button);
  }
}
