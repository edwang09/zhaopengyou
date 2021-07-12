import * as PIXI from "pixi.js";
import { cards } from "../constants/cards";
import { IRoom, PlayerID, Trump } from "../interfaces/ISocket";
import * as _ from "lodash"
import { Judge } from "./judge";

export const canPlay = (hand: string[], picked: number[], roomData: IRoom, isInitiator:boolean): any => {
  const judge = new Judge(roomData.trump, roomData.tickets)
  const pickedCard = picked.map((p) => hand[p]);
  const decomposedCard = judge.decompose(pickedCard);
  if (isInitiator) {
    console.log("playing card as intiator",{
      canPlay: judge.canPlayAsInitiator(pickedCard),
      isDump: decomposedCard.length > 1,
      decompose: decomposedCard,
    })
    return {
      canPlay: judge.canPlayAsInitiator(pickedCard),
      isDump: decomposedCard.length > 1,
      decompose: decomposedCard,
    };
  } else {
    // playing card as follower
    const initiatorCards = roomData.players[roomData.initiatorIndex].cards;
    console.log("playing card as follower",{
      canPlay: judge.canPlayAsFollower(pickedCard,hand, initiatorCards),
      isDump: false,
      decompose: decomposedCard,
    })
    return {
      canPlay: judge.canPlayAsFollower(pickedCard,hand, initiatorCards),
      isDump: false,
      decompose: decomposedCard,
    };
  }
};

