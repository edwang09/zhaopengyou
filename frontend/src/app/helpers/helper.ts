import * as PIXI from "pixi.js";
import { PlayerID, Trump } from "../interfaces/ISocket";

export const addText = (sprite: PIXI.Sprite, textMessage: string, style: PIXI.TextStyle, x = 0, y = 0): PIXI.Text => {
  const text = new PIXI.Text(textMessage, style);
  text.anchor.set(0.5);
  text.x = x;
  text.y = y;
  sprite.addChild(text);
  return text;
};

export const adjustToCenterOfContainer = (sprite: PIXI.Sprite, horizontalDrift = 0, verticalDrift = 0): void => {
  sprite.x = horizontalDrift;
  sprite.y = verticalDrift;
  sprite.anchor.set(0.5);
};
export const renderSprite = (item: PIXI.Sprite, container: PIXI.Container, horizontalDrift = 0, verticalDrift = 0): void => {
  item.x = horizontalDrift;
  item.y = verticalDrift;
  (item as PIXI.Sprite).anchor.set(0.5);
  container.addChild(item);
};
export const renderContainer = (item: PIXI.Container, container: PIXI.Container, horizontalDrift = 0, verticalDrift = 0): void => {
  item.x = horizontalDrift;
  item.y = verticalDrift;
  container.addChild(item);
};
export const setPosition = (item: PIXI.Sprite | PIXI.Container, container: PIXI.Container, horizontalDrift = 0, verticalDrift = 0): void => {
  if ("anchor" in item) {
    item.x = container.width / 2 + horizontalDrift;
    item.y = container.height / 2 + verticalDrift;
    // (item as PIXI.Sprite).anchor.set(0.5);
  } else {
    item.x = container.width / 2 + horizontalDrift - item.width;
    item.y = container.height / 2 + verticalDrift - item.height;
  }
};
export const makeInteractive = (sprite: PIXI.Sprite, fn: () => void): void => {
  sprite.interactive = true;
  sprite.buttonMode = true;
  sprite
    .on("pointerdown", () => {
      onButtonDown(sprite);
    })
    .on("pointerup", () => {
      onButtonUp(sprite);
    })
    .on("pointerupoutside", () => {
      onButtonUp(sprite);
    })
    .on("pointerover", () => {
      onButtonOver(sprite);
    })
    .on("pointerout", () => {
      onButtonOut(sprite);
    })
    .on("click", () => {
      fn();
    });
};
const onButtonDown = (sprite: PIXI.Sprite): void => {
  sprite.tint = 0x666666;
};

const onButtonUp = (sprite: PIXI.Sprite): void => {
  sprite.tint = 0xffffff;
};

const onButtonOver = (sprite: PIXI.Sprite): void => {
  sprite.scale.set(sprite.scale.x * 1.1);
};

const onButtonOut = (sprite: PIXI.Sprite): void => {
  sprite.scale.set(sprite.scale.x / 1.1);
};

export const makeContainerInteractive = (container: PIXI.Container, fn: () => void): void => {
  container.interactive = true;
  container.buttonMode = true;
  container
    .on("pointerover", () => {
      container.children.forEach((dobj) => {
        if ("tint" in dobj) {
          (dobj as PIXI.Sprite).tint = 0x666666;
        }
      });
    })
    .on("pointerout", () => {
      container.children.forEach((dobj) => {
        if ("tint" in dobj) {
          (dobj as PIXI.Sprite).tint = 0xffffff;
        }
      });
    })
    .on("click", () => {
      fn();
    });
};

export const sortHand = (cards: string[], trump: Trump): string[] => {
  const jokerSort = cards.filter((c) => c.slice(0, 1) === "j").sort();
  const trumpDSort = cards.filter((c) => c.slice(0, 1) !== "j" && c.slice(0, 1) === trump.suit && c.slice(1) === trump.number);
  const trumpSort = cards.filter((c) => c.slice(0, 1) !== "j" && c.slice(0, 1) !== trump.suit && c.slice(1) === trump.number).sort();
  const trumpSuitSort = cards
    .filter((c) => c.slice(0, 1) !== "j" && c.slice(0, 1) === trump.suit && c.slice(1) !== trump.number)
    .sort()
    .reverse();
  const restSort = cards
    .filter((c) => c.slice(0, 1) !== "j" && c.slice(0, 1) !== trump.suit && c.slice(1) !== trump.number)
    .sort()
    .reverse();
  return [...jokerSort, ...trumpDSort, ...trumpSort, ...trumpSuitSort, ...restSort];
};

export const getCallableTrumps = (trump: Trump, cards: string[], userid: PlayerID): Trump[] => {
  const validCardDirectory = cards
    .filter((c) => {
      if (trump.callerId && userid === trump.callerId) {
        return c === trump.suit + trump.number;
      } else {
        return (c.slice(1) === trump.number && (!trump.suit || c.slice(0, 1) !== trump.suit)) || c.slice(0, 1) === "j";
      }
    })
    .reduce((acc, cur) => {
      if (acc[cur]) return { ...acc, [cur]: acc[cur] + 1 };
      return { ...acc, [cur]: 1 };
    }, {});
  let result: Trump[] = [];
  Object.keys(validCardDirectory).map((k) => {
    if ((k.slice(0, 1) !== "j" && (!trump.count || validCardDirectory[k] > trump.count)) || (k.slice(0, 1) === "j" && validCardDirectory[k] > 2)) {
      for (let index = k.slice(0, 1) === "j" ? 3 : trump.count + 1; index <= validCardDirectory[k]; index++) {
        result.push({
          number: trump.number,
          suit: k.slice(0, 1),
          count: index,
          callerId: userid,
          lastCall: new Array(index).fill(k),
        });
      }
    }
  });
  return result;
};

export const getPopCardIndex = (hand: string[], picked: number[], card: string, index: number, trump: Trump): number[] => {
  if (picked.indexOf(index) > -1) {
    return picked.filter((p) => p !== index);
  }

  return [...picked, index];
};
export const validateAction = (hand: string[], picked: number[], trump: Trump): any => {
  let kitty = false;
  if (picked.length === 6) kitty = true;
  return {
    kitty,
    play: true,
  };
};

export const numberToOrder = (n?: number): string => {
  if (n === undefined) return "??th";
  return ["First", "Second", "Third", "Forth"][n];
};

export const cardToName = (suit?: string, number?: string): string => {
  const suits = {
    s: "Spade",
    d: "Diamond",
    h: "Heart",
    c: "Club",
    j0: "Red Joker",
    j1: "Black Joker",
  };
  const numbers = {
    "02": "Two of",
    "03": "Three of",
    "04": "Four of",
    "05": "Five of",
    "06": "Six of",
    "07": "Seven of",
    "08": "Eight of",
    "09": "Nine of",
    "10": "Ten of",
    "11": "Jack of",
    "12": "Queen of",
    "13": "King of",
    "14": "Ace of",
  };
  const suitText = suit ? suits[suit] : "??";
  const numberText = number ? numbers[number] : "??";
  return numberText + " " + suitText;
};
export const numberToName = (number: string): string => {
  const numbers = {
    "02": "2",
    "03": "3",
    "04": "4",
    "05": "5",
    "06": "6",
    "07": "7",
    "08": "8",
    "09": "9",
    "10": "10",
    "11": "J",
    "12": "Q",
    "13": "K",
    "14": "A",
  };
  return numbers[number];
};
