import _ = require("lodash");
import { Ticket, Trump } from "../interfaces/ISocket";

const cards = ["02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14"];

export class Judge {
  trump: Trump;
  tickets: Ticket[];
  reference: Record<string, string[]>;
  constructor(trump: Trump, tickets: Ticket[]) {
    this.trump = trump;
    this.tickets = tickets;
    const adder = ["f" + trump.number, trump.suit + trump.number, "j0", "j1"];
    this.reference = {
      h: cards.filter((c) => c !== trump.number).map((c) => "h" + c),
      s: cards.filter((c) => c !== trump.number).map((c) => "s" + c),
      d: cards.filter((c) => c !== trump.number).map((c) => "d" + c),
      c: cards.filter((c) => c !== trump.number).map((c) => "c" + c),
    };
    if (trump.suit) this.reference[trump.suit] = [...cards.filter((c) => c !== trump.number).map((c) => trump.suit + c), ...adder];
  }

  // return the order of the card
  getOrder(card: string): number {
    const order = this.reference[this.getSuit(card)].indexOf(card);
    if (order === -1) {
      return 12 + 13;
    } else if (this.getSuit(card) === this.trump.suit) {
      return order + 13;
    }
    return order;
  }

  // return the order of the card
  compare(card1: string, card2: string): boolean {
    if (card1 === undefined || card2 === undefined) return false;
    return this.getOrder(card1) > this.getOrder(card2);
  }
  // Whether a play can beat another play
  canBeat(attack: string[], defence: string[]): [boolean, number] {
    if (attack.length !== defence.length) return [false, 0];
    const decomposeAttack = this.decompose(attack);
    const decomposeDefence = this.decompose(defence);
    if (decomposeAttack.length === 0) return [false, 0];
    // defend is not dump, must win by card
    if (decomposeDefence.length === 1)
      return [
        decomposeAttack.length === 1 && this.compare(decomposeAttack[0].card, decomposeDefence[0].card),
        this.getOrder(decomposeAttack[0].card),
      ];
    // defend is dump
    if (decomposeAttack.length > 0) {
      const pairDefend = this.getPairDirectoryFromDecompose(decomposeDefence);
      const pairAttach = this.getPairDirectoryFromDecompose(decomposeAttack);
      const tolajiDefend = this.getTolajiDirectoryFromDecompose(decomposeDefence);
      const tolajiAttack = this.getTolajiDirectoryFromDecompose(decomposeAttack);
      return [
        pairDefend[4] <= pairAttach[4] &&
          pairDefend[3] <= pairAttach[3] &&
          pairDefend[2] <= pairAttach[2] &&
          this.matchTolajiDirectoryFromDecompose(tolajiAttack, tolajiDefend),
        // This is probably wrong (using )
        this.getOrder(decomposeAttack[0].card),
      ];
      // TODO: consider when there are multiple kills, which one is bigger
    }
  }
  // check if the cards can dump
  canDump(cards: string[], hands: string[][]): [boolean, string[]] {
    const decomposedDump = this.decompose(cards).reverse();
    const canDump = hands.every((h) => {
      decomposedDump.every((g) => {
        return !this.hasBeatOverGroup(g, h);
      });
    });
    if (canDump) return [true, []];
    return [false, this.composeFromGroup(decomposedDump[0])];
  }
  // check if the cards has a beat over a group
  hasBeatOverGroup(group: { card: string; width: number; height: number }, cards: string[]) {
    const summarizedCards = this.summarizeCard(cards);
    const orderOfOverCard = Object.keys(summarizedCards)
      .filter((c) => this.compare(c, group.card) && summarizedCards[c] >= group.width)
      .map((c) => this.getOrder(c));
    return this.hasConsequtiveNumber(orderOfOverCard, group.height);
  }

  // check if a list of number has a consecutive numbers of length (height)
  hasConsequtiveNumber(orderOfOverCard: number[], height: number) {
    orderOfOverCard.sort((a,b)=>a-b);
    let previous = orderOfOverCard[0];
    let currentHeight = 1;
    for (let index = 1; index < orderOfOverCard.length; index++) {
      if (previous + 1 === orderOfOverCard[index]) {
        currentHeight++;
      } else {
        currentHeight = 1;
      }
      if (currentHeight >= height) {
        return true;
      }
    }
    return false;
  }

  // turn a list of cards into card directory
  summarizeCard(cards: string[]): Record<string, number> {
    return cards.reduce((acc, cur) => {
      if (acc[cur]) return { ...acc, [cur]: acc[cur] + 1 };
      return { ...acc, [cur]: 1 };
    }, {});
  }

  // check of all suits are same (or all trump)
  checkSuitMatch(cards: string[]): boolean {
    if (cards.length === 0) return false;
    const firstSuit = this.getSuit(cards[0]);
    return cards.every((k) => {
      return this.getSuit(k) === firstSuit;
    });
  }
  // categorize suits treating all trump as trump suit
  getSuit(card: string): string {
    return card.slice(0, 1) === this.trump.suit || card.slice(0, 1) === "j" || card.slice(1) === this.trump.number
      ? this.trump.suit
      : card.slice(0, 1);
  }
  // categorize suits treating all trump as trump suit
  getCardFromOrder(order: number, suit: string): string {
    if (suit === this.trump.suit) return this.reference[suit][order - 13];
    return this.reference[suit][order];
  }

  // compose a string array of cards from a group
  composeFromGroup(group: { width: number; height: number; card: string }): string[] {
    let cards = [];
    const suit = this.getSuit(group.card);
    for (let index = 0; index < group.height; index++) {
      cards.push(this.getCardFromOrder(this.getOrder(group.card) + index, suit));
    }
    for (let index = 0; index < group.width; index++) {
      cards = [...cards, ...cards];
    }
    return cards;
  }

  //decompose cards into groups
  decompose(cards: string[]): { width: number; height: number; card: string }[] {
    // if all suits not match return empty string
    const summarizedCard: Record<string, number> = this.summarizeCard(cards);
    if (Object.keys(summarizedCard).length === 0 || !this.checkSuitMatch(cards)) return [];
    if (Object.keys(summarizedCard).length === 1)
      return [{ card: Object.keys(summarizedCard)[0], width: Object.values(summarizedCard)[0], height: 1 }];
    const suit = this.getSuit(cards[0]);
    // group by count
    const groupByCount = Object.keys(summarizedCard).reduce((acc, curr) => {
      if (acc[summarizedCard[curr]])
        return { ...acc, [summarizedCard[curr]]: [...acc[summarizedCard[curr]], this.getOrder(curr)].sort((a, b) => a - b) };
      return { ...acc, [summarizedCard[curr]]: [this.getOrder(curr)] };
    }, {});
    // reduce to Tolaji if any
    return Object.keys(groupByCount)
      .sort()
      .reverse()
      .reduce((total, count) => {
        const width = parseInt(count);
        if (width === 1) {
          total = [
            ...total,
            ...groupByCount[count].map((s: number) => {
              return { card: this.getCardFromOrder(s, suit), width: 1, height: 1 };
            }),
          ];
        } else {
          const sequenceList = groupByCount[count];
          let height = 1;
          let card = this.getCardFromOrder(sequenceList[0], suit);
          for (let index = 1; index < sequenceList.length; index++) {
            if (sequenceList[index] - sequenceList[index - 1] === 1) {
              height++;
            } else if (sequenceList[index] - sequenceList[index - 1] === 0) {
              total = [...total, { width, height: 1, card }];
            } else {
              total = [...total, { width, height, card }];
              height = 1;
              card = this.getCardFromOrder(sequenceList[index], suit);
            }
          }
          total = [...total, { width, height, card }];
        }
        return total;
      }, []);
  }
  getPairDirectoryFromDecompose(decomposedCard: { width: number; height: number; card: string }[]): { 2: number; 3: number; 4: number } {
    return decomposedCard.reduce(
      (acc, curr) => {
        switch (curr.width) {
          case 2:
            return { ...acc, 2: acc[2] + curr.height };
          case 3:
            return { ...acc, 2: acc[2] + curr.height, 3: acc[3] + curr.height };
          case 4:
            return { ...acc, 2: acc[2] + curr.height * 2, 3: acc[3] + curr.height, 4: acc[4] + curr.height };
          default:
            return acc;
        }
      },
      { 2: 0, 3: 0, 4: 0 }
    );
  }
  getTolajiDirectoryFromDecompose(decomposedCard: { width: number; height: number; card: string }[]): Record<number, number> {
    return decomposedCard.reduce((acc, curr) => {
      if (curr.height === 1) return acc;
      if (acc[curr.height]) return { ...acc, [curr.height]: acc[curr.height] + 1 };
      return { ...acc, [curr.height]: 1 };
    }, {});
  }
  matchTolajiDirectoryFromDecompose(tolajiCard: Record<number, number>, tolajiInitiator: Record<number, number>): boolean {
    const newTolajiInitiator = Object.assign({}, tolajiInitiator);
    const newTolajiCard = Object.assign({}, tolajiCard);
    const InitiatorMax = parseInt(Object.keys(newTolajiInitiator).sort().reverse()[0]);
    Object.keys(newTolajiCard)
      .sort()
      .reverse()
      .forEach((h) => {
        const ch = parseInt(h);
        for (let ih = InitiatorMax; ih > 1; ih--) {
          if (newTolajiInitiator[ih] && newTolajiInitiator[ih] > 0) {
            const offset = Math.min(newTolajiInitiator[ih], newTolajiCard[ch]);
            newTolajiInitiator[ih] -= offset;
            newTolajiCard[ch] -= offset;
            if (ih - ch > 1) newTolajiInitiator[ih - ch] += offset;
            else if (ch - ih > 1) newTolajiCard[ch - ih] += offset;
          }
        }
      });
    return Object.values(newTolajiInitiator).every((n) => n === 0);
  }

  // Client Side Helpers
  canPlayAsInitiator(cards: string[]): boolean {
    return this.checkSuitMatch(cards) && (this.getSuit(cards[0]) !== this.trump.suit || this.decompose(cards).length === 1);
  }
  canPlayAsFollower(cards: string[], hands: string[], initiator: string[]): boolean {
    if (initiator.length === 0) throw new Error("empty initiator cards");
    const decomposedCard = this.decompose(cards);
    const decomposedHand = this.decompose(hands.filter((h) => this.getSuit(h) === this.getSuit(initiator[0])));
    const decomposedInitiator = this.decompose(initiator);
    if (initiator.length !== cards.length) {
      console.log("can play as follower: length", false);
      return false;
    }
    if (!this.checkSuitFullfillmentAsFollower(cards, initiator, hands)) {
      console.log("can play as follower: suit", false);
      return false;
    }
    return (
      this.checkPairFullfillmentAsFollower(decomposedCard, decomposedHand, decomposedInitiator) &&
      this.checkTolajiFullfillmentAsFollower(decomposedCard, decomposedHand, decomposedInitiator)
    );
  }
  checkPairFullfillmentAsFollower(
    decomposedCard: { width: number; height: number; card: string }[],
    decomposedHand: { width: number; height: number; card: string }[],
    decomposedInitiator: { width: number; height: number; card: string }[]
  ) {
    const pairInitiator = this.getPairDirectoryFromDecompose(decomposedInitiator);
    const pairAll = this.getPairDirectoryFromDecompose(decomposedHand);
    const pairCard = this.getPairDirectoryFromDecompose(decomposedCard);
    console.log(
      "can play as follower: pair",
      (pairCard[4] === pairAll[4] || pairCard[4] >= pairInitiator[4]) &&
        (pairCard[3] === pairAll[3] || pairCard[3] >= pairInitiator[3]) &&
        (pairCard[2] === pairAll[2] || pairCard[2] >= pairInitiator[2])
    );
    return (
      (pairCard[4] === pairAll[4] || pairCard[4] >= pairInitiator[4]) &&
      (pairCard[3] === pairAll[3] || pairCard[3] >= pairInitiator[3]) &&
      (pairCard[2] === pairAll[2] || pairCard[2] >= pairInitiator[2])
    );
  }
  checkSuitFullfillmentAsFollower(cards: string[], initiator: string[], hands: string[]) {
    if (cards.length === 0 || initiator.length === 0) return false;
    // either the suit is match and fullfilled or there is no hand left to add
    return (this.checkSuitMatch(cards) && this.getSuit(cards[0]) === this.getSuit(initiator[0])) || hands.length <= initiator.length;
  }
  checkTolajiFullfillmentAsFollower(
    decomposedCard: { width: number; height: number; card: string }[],
    decomposedHand: { width: number; height: number; card: string }[],
    decomposedInitiator: { width: number; height: number; card: string }[]
  ) {
    const tolajiInitiator = this.getTolajiDirectoryFromDecompose(decomposedInitiator);
    const tolajiAll = this.getTolajiDirectoryFromDecompose(decomposedHand);
    const tolajiCard = this.getTolajiDirectoryFromDecompose(decomposedCard);
    const offsetTolajiAll = this.offsetTolajiDirectoryFromDecompose(tolajiAll, tolajiInitiator);
    const offsetTolajiCard = this.offsetTolajiDirectoryFromDecompose(tolajiCard, tolajiInitiator);
    console.log("can play as follower: tlj", _.isEqual(offsetTolajiAll, offsetTolajiCard));
    return _.isEqual(offsetTolajiAll, offsetTolajiCard);
  }
  offsetTolajiDirectoryFromDecompose(tolajiCard: Record<number, number>, tolajiInitiator: Record<number, number>) {
    const newTolajiInitiator = Object.assign({}, tolajiInitiator);
    const newTolajiCard = Object.assign({}, tolajiCard);
    const InitiatorMax = parseInt(Object.keys(newTolajiInitiator).sort().reverse()[0]);
    Object.keys(newTolajiCard)
      .sort()
      .reverse()
      .forEach((h) => {
        const ch = parseInt(h);
        for (let ih = InitiatorMax; ih > 1; ih--) {
          if (newTolajiInitiator[ih] && newTolajiInitiator[ih] > 0) {
            const offset = Math.min(newTolajiInitiator[ih], newTolajiCard[ch]);
            newTolajiInitiator[ih] -= offset;
            newTolajiCard[ch] -= offset;
            if (ih - ch > 1) newTolajiInitiator[ih - ch] += offset;
            else if (ch - ih > 1) newTolajiCard[ch - ih] += offset;
          }
        }
      });
    return newTolajiInitiator;
  }
}
