import { actionStates } from "../events";
import { IRoom, playerCamp } from "../room/room.schema";
import {Judge} from "./judge"
export function newDeck(): string[] {
  const suits = ["h", "s", "c", "d"];
  const ranks = ["02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14"];
  const deck = ranks.reduce(
    (acc, curr) => {
      const current = suits.map((s) => s + curr);
      return [...acc, ...current];
    },
    ["j0", "j1"]
  );
  return shuffle([...deck, ...deck, ...deck, ...deck]);
}
export function shuffle(array: string[]): string[] {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }

  return array;
}

export function resolvePlay(roomData: IRoom, playerid:string, cards: string[]):[number, IRoom]{
  if (roomData.initiatorIndex === undefined) throw new Error("Initiator Index not defined");
  const judge = new Judge(roomData.trump, roomData.tickets)
  const currentIndex = roomData.players.findIndex(p=>p&&p.id === playerid)
  if (currentIndex<0) throw new Error("Invalid PlayerID");
  // when a complete round
  if (roomData.players[currentIndex].cards.length > 0){
    //remove cards for each player
    roomData.players = roomData.players.map((p, idx)=>{return {...p, cards:[]}
    })
  }
  roomData.players[currentIndex].cards = cards
  const [nextIndex, points] = judge.getNextPlayerIndex(roomData.players.map(p=>p?p.cards:[]), roomData.initiatorIndex)
  
  console.log("got next", nextIndex, points)
  // when a complete round
  if (roomData.players.filter(p=> p && p.cards.length > 0).length === 6){
    roomData.initiatorIndex = nextIndex 
    console.log(roomData.players)
    roomData.players[nextIndex].points = [...roomData.players[nextIndex].points, ...points]
  }

  //update action States for each player
  roomData.players = roomData.players.map((p, idx)=>{
    if (idx === nextIndex)return {...p, actionState:actionStates.PLAY}
    return {...p, actionState:actionStates.CLEAR}
  })
  //resolve tickets
  const [onBoard, tickets] = judge.resolveTicket(cards)
  if(onBoard){
    roomData.tickets = tickets;
    if (roomData.players[currentIndex].camp === playerCamp.UNKNOWN) roomData.players[currentIndex].camp = playerCamp.HOUSE
    if (judge.noTicketRemains()){
      roomData.players = roomData.players.map(p=>{
        if(p  && p.camp === playerCamp.UNKNOWN){
          return {...p, camp: playerCamp.PLAYER}
        }
        return p
      })
    }
  }

  return [nextIndex, roomData]
}


