import * as PIXI from "pixi.js";
import { defaultStyle, white } from "../textstyle";
import { TextInput } from "../components/textinput";
import { Button } from "../components/button";
import { buttonColor, handTypes } from "../enums/enums";
import { IUserData } from "../interfaces/userdata";
import { makeInteractive, adjustToCenterOfContainer, numberToName } from "../helpers/helper";
import { v4 as uuidv4 } from 'uuid';
import { IPlayerData } from "../interfaces/playerData";
import { GameRoom } from "../gameroom";
import { Checkout, Kitty, Ticket } from "../interfaces/ISocket";
import { cardToName, numberToOrder } from "../helpers/helper";
import { SelectableSprite } from "./selectableSprite";
import { SelectableText } from "./selectableText";
import { Hand } from "./hand";
import { Play } from "./play";

export class KittyBoard extends  PIXI.Container{
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
  play: Play;
  title: any;
  winners: PIXI.Text[];
  advancement: PIXI.Text;
  kittyPoint: any;
  subtitle: PIXI.Text;
  totalPoint: PIXI.Text;
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
    this.removeChild(this.title)
    this.removeChild(this.advancement)
    this.removeChild(this.subtitle)
    this.removeChild(this.kittyCard)
    this.removeChild(this.kittyPoint)
    this.winners.forEach(w=>{
      this.removeChild(w)
    })
    this.visible = false;
  }
  show(kitty: Kitty, checkout: Checkout): void {
    this.displayKitty(kitty)
    this.displayContents(checkout)
    this.visible = true;
  }
  displayBackground(): void {
    const modalTexture = PIXI.Loader.shared.resources["modal-wide"].texture;
    const modal = PIXI.Sprite.from(modalTexture);
    adjustToCenterOfContainer(modal, 0, 0);
    modal.height = modalTexture.height-140;
    modal.width = modalTexture.width-180;
    this.addChild(modal);
  }
  displayContents(checkout: Checkout):void{
    this.title = new PIXI.Text(`Winner is ${checkout.winningParty} team`)
    this.title.y = -180;
    this.title.x = -200;
    this.addChild(this.title);
    this.advancement = new PIXI.Text(`Advancement ${checkout.advancement}`)
    this.advancement.y = -15;
    this.advancement.x = 0;
    this.addChild(this.advancement);
    this.totalPoint = new PIXI.Text(`Total point:  ${checkout.totalPoint}`)
    this.totalPoint.y = -15;
    this.totalPoint.x = -200;
    this.addChild(this.totalPoint);
    this.subtitle = new PIXI.Text(`Winners :`)
    this.subtitle.y = 15;
    this.subtitle.x = -200;
    this.addChild(this.subtitle);
    this.displayWinners(checkout.winnerIndex.map((id)=> this.room.roomData.players[id].name))

  }
  displayKitty(kitty:Kitty): void {
    this.kittyCard = new Play(this,-200,-95,kitty.cards, handTypes.SHOW_DOWN)
    this.addChild(this.kittyCard)
    this.kittyPoint = new PIXI.Text(`Points from kitty ${kitty.point * kitty.multiplier}`)
    this.kittyPoint.y = -40;
    this.kittyPoint.x = -200;
    this.addChild(this.kittyPoint);
  }

  displayWinners(names: string[]): void {
    this.winners = names.map((n, id)=>{
      const name = new PIXI.Text(n)
      name.y =  45+27*id;
      name.x = -180;
      this.addChild(name);
      return name
    })
  }
  
  // displayLosers(): void {
  // }
  displayButton(): void {
    const button: Button = new Button(buttonColor.GREEN,"Prepare", ()=>{
      console.log("next round")
      this.hide()
      this.room.app.eventHandler.emit("room:prepare", true);
    });
    adjustToCenterOfContainer(button, 0, 160);
    this.addChild(button);
  }
}
