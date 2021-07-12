import * as PIXI from "pixi.js";
import { idText } from "typescript";
import { CARD, HAND, PLAYER_AREA_DIMENSION, USER_HAND } from "../constants/dimension";
import { handTypes } from "../enums/enums";
import { GameRoom } from "../gameroom";
import { makeContainerInteractive, makeInteractive, renderContainer, sortHand } from "../helpers/helper";
import { Trump } from "../interfaces/ISocket";
import { Action } from "./actions";
import { Card } from "./card";

export class Hand extends PIXI.Container {
  cards: string[];
  type: handTypes;
  gravity: number;
  gap: number;
  cardSize: string;
  cardInteractive: boolean;
  id: number;
  cardHandler: Card[];
  cardY: number;
  trump: Trump;
  room: GameRoom;
  selecting: boolean = false;
  constructor(room: GameRoom, x = USER_HAND.X, y = USER_HAND.Y, cards = []) {
    super();
    this.cards = cards;
    this.cardSize = "normal";
    this.cardY = CARD.NORMAL_Y;
    this.room = room;
    this.renderCards(cards);
    renderContainer(this, this.room, x, y);
  }
  renderCards(cards: string[]): void {
    const count = cards.length;
    const twoline = count > 21;
    this.cardHandler = cards.map((c, id) => {
      const card = new Card(c, `${this.cardSize}${twoline ? "2" : ""}`);
      this.makeCardInteractive(card,id, () => {
        this.room.selectHand(card.card, id);
      });
      this.addChild(card);
      card.x = this.getCardX(id);
      card.y = twoline ? this.cardY - PLAYER_AREA_DIMENSION.TWOLINE_GAP / 2 + PLAYER_AREA_DIMENSION.TWOLINE_GAP * Math.floor(id / 21) : this.cardY;
      card.originY = card.y;
      return card;
    });
  }
  makeCardInteractive(card: Card,id:number, cb: () => void): void {
    card.interactive = true;
    card.buttonMode = true;
    card
      .on("pointerover", () => {
        if(this.selecting){
          cb();
        }else{
          card.y = card.selected ? card.originY-CARD.POP_DISTANCE+CARD.HOVER_DISTANCE : card.originY - CARD.HOVER_DISTANCE;
        }
      })
      .on("pointerout", () => {
        card.y = card.selected ? card.originY-CARD.POP_DISTANCE : card.originY;
      })
      .on("pointerdown", () => {
        cb();
        this.selecting = true
      })
      .on("pointerup", () => {
        this.selecting = false
      })
      .on("pointerupoutside", () => {
        this.selecting = false
      })
      // .on("click", () => {
      //   cb();
      // });
  }
  getCardX(id: number, linemax = 21) {
    id = id % linemax;
    return (1 + id) * CARD.NORMAL_GAP;
  }

  //TODO: fix this, dont rerender everything
  pushCard(cards: string[]) {
    let newCards = [...this.cards, ...cards];
    if (this.type === handTypes.USER_HAND) newCards = sortHand(newCards, this.trump);
    this.cards = newCards;
    this.removeChildren();
    this.renderCards(this.cards);
  }

  update(cards: string[]) {
    this.cards = cards;
    this.removeChildren();
    this.renderCards(cards);
  }
  updateTrump(trump: Trump) {
    this.trump = trump;
    this.cards = sortHand(this.cards, trump);
    this.removeChildren();
    this.renderCards(this.cards);
  }
  getSelected(): string[] {
    return this.cardHandler.filter((ch) => ch.selected).map((ch) => ch.card);
  }

  popCard(indices: number[]) {
    this.cardHandler.map((c, id) => {
      if (indices.indexOf(id) > -1) {
        c.selected = true;
        c.y = c.originY - CARD.POP_DISTANCE;
      } else {
        c.selected = false;
        c.y = c.originY;
      }
    });
  }
}
