import * as PIXI from "pixi.js";
import { CARD, HAND, PLAYER_AREA_DIMENSION, USER_PLAY } from "../constants/dimension";
import { handTypes } from "../enums/enums";
import { GameRoom } from "../gameroom";
import { makeContainerInteractive, renderContainer, sortHand } from "../helpers/helper";
import { Trump } from "../interfaces/ISocket";
import { Card } from "./card";

export class Play extends PIXI.Container {
  cards: string[];
  type: handTypes;
  gravity: number;
  gap: number;
  cardSize: string;
  id: number;
  cardHandler: Card[];
  cardY: number;
  trump: Trump;
  room: PIXI.Container;
  constructor(room:PIXI.Container,x = USER_PLAY.X, y = USER_PLAY.Y, cards = [], type = handTypes.PLAYER_CARD, gravity = 0, cb?: () => void) {
    super();
    this.cards = cards;
    this.type = type;
    this.room = room;
    switch (type) {
      case handTypes.PLAYER_CARD:
        this.gap = CARD.SMALL_GAP;
        this.cardSize = "small";
        this.cardY = PLAYER_AREA_DIMENSION.HEIGHT / 2;
        break;
      case handTypes.USER_CALL:
        this.gap = CARD.SMALL_GAP;
        this.cardSize = "tiny";
        this.cardY = 0;
        makeContainerInteractive(this, () => {
          cb();
        });
        break;
    }
    this.gravity = gravity;
    this.renderCards(cards);
    renderContainer(this, this.room, x, y)
  }
  renderCards(cards: string[]): void {
    console.log("rendering Cards: ", cards);
    const count = cards.length;
    const twoline = count > 20;
    this.cardHandler = cards.map((c, id) => {
      const card = new Card(c, `${this.cardSize}${twoline ? "2" : ""}`);
      this.addChild(card);
      card.x = this.getCardX(id);
      card.y = twoline ? this.cardY - PLAYER_AREA_DIMENSION.TWOLINE_GAP / 2 + PLAYER_AREA_DIMENSION.TWOLINE_GAP * Math.floor(id / 20) : this.cardY;
      return card;
    });
  }
  getCardX(id?: number, linemax = 20) {
    if (id === undefined) id = this.id;
    id = id % linemax;
    if (this.gravity === 0) return this.gap + id * this.gap;
    return HAND.SMALL_RIGHT_END - this.cards.length * this.gap + id * this.gap + this.gap;
  }


  update(cards: string[]) {
    //sort it first if it is hand
    if (this.type === handTypes.USER_HAND) cards = sortHand(cards, this.trump);
    this.cards = cards;
    this.removeChildren();
    if (cards && cards.length > 0) this.renderCards(cards);
  }
  updateTrump(trump: Trump) {
    this.trump = trump;
    this.cards = sortHand(this.cards, trump);
    this.removeChildren();
    this.renderCards(this.cards);
  }
}
