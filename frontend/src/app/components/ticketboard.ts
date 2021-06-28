import * as PIXI from "pixi.js";
import { IPlayerData } from "../interfaces/playerData";
import { adjustToCenterOfContainer, addText, numberToOrder } from "../helpers/helper";
import { defaultStyle, playerName, TSlevel, white } from "../textstyle";
import { HUD_DIMENSION } from "../constants/dimension";
import { Ticket } from "../interfaces/ISocket";
import { GameRoom } from "../gameroom";
import { resolveModuleNameFromCache } from "typescript";
import { Card } from "./card";
import { handTypes } from "../enums/enums";

export class TicketBoard extends PIXI.Container {
  room: GameRoom;
  background: PIXI.Sprite;
  tickets: { card: Card; text: PIXI.Text }[];
  constructor(room: GameRoom, tickets: Ticket[] = []) {
    super();
    this.room = room;
    this.background = this.displayBackground();
    this.displayTicket(this.background, tickets);
    room.addChild(this);
  }
  displayBackground(): PIXI.Sprite {
    const modalTexture = PIXI.Loader.shared.resources["modal-wide"].texture;
    const modal = PIXI.Sprite.from(modalTexture);
    adjustToCenterOfContainer(modal, 150, 90);
    modal.height = 160;
    modal.width = 260;
    this.addChild(modal);
    return modal;
  }
  displayTicket(background: PIXI.Sprite, tickets: Ticket[]): void {
    this.tickets = tickets.map((t, id) => {
      const card = new Card(t.suit + t.number, "small", false);
      const text = new PIXI.Text(numberToOrder(t.sequence), defaultStyle);
      adjustToCenterOfContainer(card, 100 + id * 100, 80);
      adjustToCenterOfContainer(text, 100 + id * 100, 140);
      this.addChild(card);
      this.addChild(text);
      return { card, text };
    });
  }
  updateTickets(tickets?: Ticket[]): void {
    this.tickets.map(t=> { 
      this.removeChild(t.card);
      this.removeChild(t.text);
    })
    this.tickets = [];
    tickets && this.displayTicket(this.background, tickets);
  }
}
