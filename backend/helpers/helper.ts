import { actionStates } from "../events";
import { InMemoryHandRepository } from "../room/hand.repository";
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

export function resolvePlay(roomData: IRoom, playerid:string, cards: string[], hands: string[][]):[IRoom, string[]]{
  if (roomData.initiatorIndex === undefined) throw new Error("Initiator Index not defined");
  const judge = new Judge(roomData.trump, roomData.tickets)
  const currentIndex = roomData.players.findIndex(p=>p&&p.id === playerid)
  if (currentIndex<0) throw new Error("Invalid PlayerID");
  const initiatorCard = roomData.players[roomData.initiatorIndex].cards
  let canDump = true
  let fallback = []
  let returns = []
  const firstPlays = roomData.players.every(p=>p&&p.cards&&p.cards.length>0) || roomData.players.every(p=>p&&(!p.cards||p.cards.length===0)) 
  // when first play of a new round
  if (firstPlays){
    [canDump, fallback, returns] = judge.canDump(cards, hands)
    if(!canDump){
      cards = Object.assign([], fallback)
    }
    //remove cards for each player, push to last play
    roomData.players = roomData.players.map((p, idx)=>{
      const lastplay = Object.assign([], p.cards)
      return {...p, cards:[], lastplay}
    })
  }
  
  roomData.players[currentIndex].cards = cards
  const [nextIndex, points] = judge.getNextPlayerIndex(roomData.players.map(p=>p?p.cards:[]), roomData.initiatorIndex)
  
  console.log("got next", nextIndex, points)
  // when a complete round
  if (roomData.players.every(p=>p&&p.cards&&p.cards.length>0) ){
    roomData.initiatorIndex = nextIndex 
    roomData.cardLeft = roomData.cardLeft - cards.length
    console.log("cardleft", roomData.cardLeft)
    roomData.players[nextIndex].points = [...roomData.players[nextIndex].points, ...points]
  }

  //update action States for each player
  roomData.players = roomData.players.map((p, idx)=>{
    if (idx === nextIndex)return {...p, actionState:actionStates.PLAY}
    return {...p, actionState:actionStates.CLEAR}
  })

  //resolve tickets
  const [onBoard, tickets] = judge.resolveTicket(cards)
  roomData.tickets = tickets;
  if(onBoard){
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

  // when a complete game, advance levels
  if(roomData.cardLeft === 0){
    // bury points to player
    if(roomData.players[nextIndex].camp === playerCamp.PLAYER){
      roomData.kitty.point = roomData.kitty.cards.reduce((acc,cur)=> acc+ judge.getPoint(cur),0)
      roomData.kitty.multiplier = judge.getKittyMultiplier(initiatorCard)
      console.log(roomData.kitty)
    }
    // get all player points
    const totalPoints = roomData.players.filter(p=>(p && p.camp === playerCamp.PLAYER)).reduce((acc,cur)=>{
      return [...acc, ...cur.points]
    },[])
    let winnerIndex = []
    let winningParty = ""
    const [totalPoint, advancement]  = judge.getAdvancement(totalPoints, roomData.kitty)
    if (advancement > 0){
      // player wins
      winningParty = "BLUE"
      roomData.players = roomData.players.map((p,id)=>{
        if(p  && p.camp === playerCamp.PLAYER){
          winnerIndex.push(id)
          return {...p, level: judge.advanceLevel(p.level, advancement)}
        }
        return p
      })
      for (let index = 0; index < roomData.players.length; index++) {
        const realIndex = (roomData.dealerIndex+1+index)%6
        if (roomData.players[realIndex].camp === playerCamp.PLAYER) {
          roomData.dealerIndex = realIndex
          roomData.trump = {
            count:0,
            number: roomData.players[realIndex].level
          }
          break;
        }
      }
    }else{
      winningParty = "RED"
      roomData.players = roomData.players.map((p, id)=>{
        if(p  && p.camp !== playerCamp.PLAYER){
          winnerIndex.push(id)
          return {...p, level: judge.advanceLevel(p.level, Math.abs(advancement))}
        }
        return p
      })
      // dealer wins
      for (let index = 0; index < roomData.players.length; index++) {
        const realIndex = (roomData.dealerIndex+1+index)%6
        if (roomData.players[realIndex].camp !== playerCamp.PLAYER) {
          roomData.dealerIndex = realIndex
          roomData.trump = {
            count:0,
            number: roomData.players[realIndex].level
          }
          break;
        }
      }
    }
    //update action States and prepare for each player
    roomData.players = roomData.players.map((p, idx)=>{
      return {...p, prepared:false, cards: [], camp:playerCamp.UNKNOWN}
    })
    // update checkout
    roomData.checkout = {
      winnerIndex,
      winningParty,
      advancement: Math.abs(advancement),
      totalPoint
    }
    roomData.tickets = []
    
  }
  return [ roomData, returns]
}


