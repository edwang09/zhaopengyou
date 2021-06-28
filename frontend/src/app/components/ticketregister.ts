import * as PIXI from "pixi.js";
import { defaultStyle, white } from "../textstyle";
import { TextInput } from "../components/textinput";
import { Button } from "../components/button";
import { buttonColor } from "../enums/enums";
import { IUserData } from "../interfaces/userdata";
import { makeInteractive, adjustToCenterOfContainer, numberToName } from "../helpers/helper";
import { v4 as uuidv4 } from 'uuid';
import { IPlayerData } from "../interfaces/playerData";
import { GameRoom } from "../gameroom";
import { Ticket } from "../interfaces/ISocket";
import { cardToName, numberToOrder } from "../helpers/helper";
import { SelectableSprite } from "./selectableSprite";
import { SelectableText } from "./selectableText";

export class TicketRegister extends  PIXI.Container{
  input: TextInput;
  avatarIndex: number;
  callback;
room: GameRoom;
tickets:Ticket[] = [{},{}]
  app: PIXI.Application;
  labelHandler: any = [[],[]];
  suitSelectorHandler: SelectableSprite[][] =[[],[]];
  textSelectorHandler: SelectableText[][] = [[],[]];
  sequenceSelectorHandler: SelectableText[][] = [[],[]];
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
    this.displayTicketText(0);
    this.displayTicketSelector(0);
    this.displayTicketText(1);
    this.displayTicketSelector(1);
    this.displayButton();
  }
  show(cb:(tickets:Ticket[])=>void): void {
    this.callback = cb
    this.visible = true;
  }
  hide(): void {
    this.visible = false;
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

  displayTicketText(index : number):void{
    this.labelHandler[index] = new PIXI.Text(`Ticket${index+1} : ${numberToOrder(this.tickets[index].sequence)} ${cardToName(this.tickets[index].suit, this.tickets[index].number)}`, defaultStyle);
    adjustToCenterOfContainer(this.labelHandler[index], -280, index*160-190);
    this.labelHandler[index].anchor.set(0)
    this.addChild(this.labelHandler[index]);
  }
  displayTicketSelector(index : number): void {
    const avatarsheet: PIXI.Spritesheet =
    PIXI.Loader.shared.resources["suits"].spritesheet;
    
    this.sequenceSelectorHandler[index] = ["First", "Second", "Third", "Fourth"].map((n,id)=>{
      const sequenceSelector: SelectableText = new SelectableText(n, defaultStyle,n, ()=>{
        this.selectSequence(index, id)
      })
      adjustToCenterOfContainer(sequenceSelector, id*100 -250, index*160-150);
      sequenceSelector.anchor.set(0)
      this.addChild(sequenceSelector);
      return sequenceSelector
    })
    this.suitSelectorHandler[index] = ["s", "d", "c", "h"].map((suit, id)=>{
      const suitSelector: SelectableSprite = new SelectableSprite(avatarsheet.textures[`${suit}.png`],suit, ()=>{
        this.selectSuit(index, suit)
      })
      suitSelector.scale.set(0.5)
      adjustToCenterOfContainer(suitSelector, id*30 -250 , index*160-110);
      suitSelector.anchor.set(0)
      this.addChild(suitSelector);
      return suitSelector
    })
    this.textSelectorHandler[index] = ["02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14"].map((n,id)=>{
      const textSelector: SelectableText = new SelectableText(numberToName(n), defaultStyle,n, ()=>{
        this.selectText(index, n)
      })
      adjustToCenterOfContainer(textSelector, id*30 -250, index*160-70);
      textSelector.anchor.set(0)
      this.addChild(textSelector);
      return textSelector
    })
  }
  selectSuit(index: number, suit:string){
    this.tickets[index].suit = suit
    this.labelHandler[index].text = `Ticket${index+1} : ${numberToOrder(this.tickets[index].sequence)} ${cardToName(this.tickets[index].suit, this.tickets[index].number)}`
    this.suitSelectorHandler[index].map(ssh=>{
      if (ssh.data === suit) ssh.toggle(true)
      else ssh.toggle(false)
    })
  }
  selectText(index: number, number:string){
    this.tickets[index].number = number
    this.labelHandler[index].text = `Ticket${index+1} : ${numberToOrder(this.tickets[index].sequence)} ${cardToName(this.tickets[index].suit, this.tickets[index].number)}`
    this.textSelectorHandler[index].map(ssh=>{
      if (ssh.data === number) ssh.toggle(true)
      else ssh.toggle(false)
    })
  }
  selectSequence(index: number, sequence:number){
    this.tickets[index].sequence = sequence
    this.labelHandler[index].text = `Ticket${index+1} : ${numberToOrder(this.tickets[index].sequence)} ${cardToName(this.tickets[index].suit, this.tickets[index].number)}`
    this.sequenceSelectorHandler[index].map((ssh,id)=>{
      if (id === sequence) ssh.toggle(true)
      else ssh.toggle(false)
    })
  }
  displayButton(): void {

    const button: Button = new Button(buttonColor.GREEN,"Confirm", ()=>{
      this.callback(this.tickets)
    });
    adjustToCenterOfContainer(button, 0, 160);
    this.addChild(button);
  }

}
