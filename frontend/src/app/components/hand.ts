import * as PIXI from "pixi.js";
import { CARD, HAND, PLAYER_AREA_DIMENSION } from "../constants/dimension";
// import {
//     makeInteractive,
//     adjustToCenterOfContainer,
//     addText,
//   } from "../helpers/helper";
import { Card } from "./card";

export class Hand extends PIXI.Container {
  cards: string[];
  constructor(
    cards: string[],
    size = "normal",
    interactive = true,
    gravity = 0
  ) {
    super();
    this.renderCards(cards, size, interactive, gravity);
  }
  renderCards(
    cards: string[],
    size = "normal",
    interactive = true,
    gravity = 0
  ): void {
    cards.map((c, id) => {
      const card: Card = this.renderCard(c, size, interactive);
      let gap;
      switch (size) {
        case "small":
          gap = CARD.SMALL_GAP;
          break;
        default:
            gap = CARD.NORMAL_GAP;
          break;
      }
      if (gravity === 0) {
        card.x = gap+ id * gap;
      } else {
        card.x = HAND.SMALL_RIGHT_END - cards.length * gap + id * gap + gap;
      }
      card.y = PLAYER_AREA_DIMENSION.HEIGHT /2;
    });
  }

  renderCard(cardString: string, size = "normal", interactive = true): Card {
    const card = new Card(cardString, size, interactive);
    this.addChild(card);
    return card;
  }
}
