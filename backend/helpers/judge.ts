import { globalAgent } from "http";
import { IRoom, Kitty, Player, Ticket, Trump } from "../room/room.schema";
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

  getKittyMultiplier(playCard: string[]):number {
    const decompose = this.decompose(playCard)[0]
    const factor = decompose.height+decompose.width-1
    return 2 ** factor;
  }
  advanceLevel(level: string, advancement: number): string {
    console.log("advancement", level, advancement, cards[cards.indexOf(level)+advancement])
    return cards[cards.indexOf(level)+advancement]
  }
  getAdvancement(points: string[], kitty: Kitty) :[number, number]{
    const totalPoint = kitty.multiplier * kitty.point + points.reduce((acc,cur)=>{
      return acc+this.getPoint(cur)
    },0)
    
    if (totalPoint === 0) {
      return [totalPoint, -4]
    } else if(totalPoint < 40) {
      return [totalPoint, -3];
    } else if(totalPoint < 80) {
      return [totalPoint, -2];
    } else if(totalPoint < 160) {
      return [totalPoint, -1];
    }else {
      return [totalPoint, Math.ceil((totalPoint-160)/80)]
    }
  }
  getPoint(card: string): number {
    switch (card.slice(1)) {
      case "05":
        return 5;
      case "10":
        return 10;
      case "13":
        return 10;
      default:
        return 0;
    }
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
    console.log("Can beat",decomposeDefence,decomposeAttack,  decomposeAttack.length === 1 && this.compare(decomposeAttack[0].card, decomposeDefence[0].card) )
    if (decomposeAttack.length === 0) return [false, 0];
    // defend is not dump, must win by card
    if (decomposeDefence.length === 1){
            return [
        decomposeAttack.length === 1 && this.compare(decomposeAttack[0].card, decomposeDefence[0].card),
        this.getOrder(decomposeAttack[0].card),
      ];
    }
    // defend is dump
    while (decomposeAttack.length > 0) {
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
  canDump(cards: string[], hands: string[][]): [boolean, string[], string[]] {
    hands = hands.map(ph=>{
      return ph.filter(c=>this.getSuit(c) ===this.getSuit(cards[0]))
    })
    const decomposedDump = this.decompose(cards).reverse();
    // not a dump
    if(decomposedDump.length <= 1) return [true, cards, []];
    let beat:{height:number, width:number, card:string}[] = []
    const canDump = hands.every((h) => {
      return decomposedDump.every((g) => {
        const hasBeat = this.hasBeatOverGroup(g, h)
        if (hasBeat){
          console.log("has beat",g)
          beat.push(g)
        }
        return !this.hasBeatOverGroup(g, h);
      });
    });
    // console.log("candump", cards, hands, canDump, beat)
    if (canDump) return [true, cards, []];
    const fallback = this.composeFromGroup(beat.sort((a,b)=>{
      if (a.height === b.height){
        if (a.width === b.width){
          return (a.card > b.card)?1:-1
        }else{
          return a.width - b.width;
        }
      }else{
        return a.height - b.height;
      }
    })[0])
    const returns = Object.assign([],cards)
    fallback.forEach((c) => {
      const index = returns.indexOf(c);
      returns.splice(index,1);
    });
    // console.log("candump", [false, fallback, cards])
    return [false, fallback, returns];
  }
  
  // check if the cards has a beat over a group
  hasBeatOverGroup(group: { card: string; width: number; height: number }, cards: string[]) {
    const summarizedCards = this.summarizeCard(cards);
    const orderOfOverCard = Object.keys(summarizedCards)
      .filter((c) => this.compare(c, group.card) && summarizedCards[c] >= group.width)
      .map((c) => this.getOrder(c));
    const hasBeat = this.hasConsequtiveNumber(orderOfOverCard, group.height);
    // console.log("hasBeat", group, cards, hasBeat)
    return hasBeat
  }

  // check if a list of number has a consecutive numbers of length (height)
  hasConsequtiveNumber(orderOfOverCard: number[], height: number) {
    orderOfOverCard.sort();
    let last = orderOfOverCard[0];
    let currentHeight = 1;
    for (let index = 1; index < orderOfOverCard.length; index++) {
      if (last + 1 === orderOfOverCard[index]) {
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
      cards = [...cards, ...this.repeatStringtoArray(this.getCardFromOrder(this.getOrder(group.card) + index, suit), group.width)];
    }
    return cards;
  }
  repeatStringtoArray(arr: string, n:number):string[]{
    let res = []
    for (let index = 0; index < n; index++) {
      res = [...res, arr]
    }
    return res;
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
      if (acc[summarizedCard[curr]]) return { ...acc, [summarizedCard[curr]]: [...acc[summarizedCard[curr]], this.getOrder(curr)].sort() };
      return { ...acc, [summarizedCard[curr]]: [this.getOrder(curr)] };
    }, {});
    console.log(groupByCount)
    // reduce to Tolaji if any
    return Object.keys(groupByCount)
      .sort()
      .reverse()
      .reduce((total, count) => {
        const width = parseInt(count);
        if (width === 1) {
          total = [
            ...total,
            ...groupByCount[count].map((s) => {
              return { card: this.getCardFromOrder(s, suit), width: 1, height: 1 };
            }),
          ];
        } else {
          const sequenceList = groupByCount[count].sort((a,b)=>a-b);
          let height = 1;
          let card = this.getCardFromOrder(sequenceList[0], suit);
          console.log(sequenceList)
          for (let index = 1; index < sequenceList.length; index++) {
            console.log(sequenceList[index] - sequenceList[index - 1])
            if (sequenceList[index] - sequenceList[index - 1] === 1) {
              height++;
            } else if (sequenceList[index] - sequenceList[index - 1] === 0) {
              total = [...total, { width, height: 1, card:this.getCardFromOrder(sequenceList[index], suit) }];
            } else {
              total = [...total, { width, height, card }];
              height = 1;
              card = this.getCardFromOrder(sequenceList[index], suit);
            }
          }
          total = [...total, { width, height, card }];
        }
        console.log(total)
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
      .map((h) => {
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


  getNextPlayerIndex(cards: (string[])[], initiatorIndex: number):[nextIndex: number, points:string[]]{
    
    console.log("get next", cards, initiatorIndex)
    for (let index = initiatorIndex; index < initiatorIndex + 6; index++) {
      const playerIndex = index % 6;
      if (cards[playerIndex] !== undefined && cards[playerIndex].length === 0){ 
          return [playerIndex, []]
      }
    }
    return this.getWinnerIndex(cards, initiatorIndex)
  }
  
  // get winner Index from 6 plays
  getWinnerIndex(cards: (string[])[], initiatorIndex:number) :[nextIndex: number, points:string[]]{
    let winnerIndex = initiatorIndex
    let highestCard = 0
    let points = []
    for (let index = initiatorIndex; index < initiatorIndex + 6; index++) {
      const currentIndex = index % 6
      points = [...points, ...cards[currentIndex].filter(c=> this.getPoint(c) > 0)]
      const [canBeatInitiator, highCard] = this.canBeat(cards[currentIndex], cards[initiatorIndex]) 
      if(canBeatInitiator && highCard > highestCard){
        winnerIndex = currentIndex;
        highestCard = highCard;
      }
    }
    return[ winnerIndex, points];
  }
  noTicketRemains(){
    return this.tickets.every(t=> t.seen && t.seen > t.sequence)
  }
  resolveTicket(cards: string[]):[onBoard: boolean, tickets: Ticket[]]{
    if(this.noTicketRemains()) return [false, this.tickets]
    let onBoard = false;
    cards.forEach(c=>{
      this.tickets = this.tickets.map(t=>{
        if (t.card === c) {
          if (t.sequence === t.seen) onBoard = true
          return {...t, seen: t.seen+1}
        }
        return t
      })
    })
    console.log("resolve Tickets", cards, this.tickets, onBoard)
    return [onBoard, this.tickets]
  }
}
