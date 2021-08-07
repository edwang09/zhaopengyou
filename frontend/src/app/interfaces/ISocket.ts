import { actionStates, playerCamp } from "../enums/enums";

interface Error {
  error: string;
  errorDetails?: unknown[];
}

interface Success<T> {
  data: T;
}

export type Response<T> = Error | Success<T>;

export type RoomID = string;
export type PlayerID = string;

export interface Player {
  id: PlayerID;
  name: string;
  avatarIndex: number;
  socketid?: string;
  level?: string,
  camp?: playerCamp
  prepared?: boolean;
  cards: string[];
  lastplay?: string[];
  points: string[];
  actionState?:number
}
export interface Ticket {
  card: string
  // sequence start from 1, seen initialized with 0
  sequence : number
  seen : number
}
export interface Trump {
  number: string
  suit?: string
  count: number
  callerId?: string
  lastCall?: string[]
}
export interface ILobbyRoom {
  id: RoomID;
  name: string;
  playernumber: number;
}

export interface Kitty {
  cards: string[],
  multiplier: number,
  point?: number
}
export interface Checkout {
  winningParty: string,
  winnerIndex: number[],
  advancement: number,
  totalPoint: number
}

export interface IRoom {
  id?: RoomID;
  name: string;
  players: (Player | null)[];
  startLevel: string
  dealerIndex?:number
  initiatorIndex?:number
  trump:Trump
  kitty?:Kitty
  tickets?:Ticket[]
  cardLeft?:number
  checkout?:Checkout
}

export interface ServerEvents {
  "lobby:created": (room: ILobbyRoom) => void;
  "lobby:list": (rooms: ILobbyRoom[]) => void;
  "lobby:deleted": (id: RoomID) => void;
  "lobby:updated": (room: ILobbyRoom) => void;
  "room:player:updated": (room: IRoom) => void;
  "room:card:updated": (room: IRoom) => void;
  "player:deal": (cards: string[]) => void;
  "room:trump:updated": (room: IRoom) => void;
  "room:ticket:updated": (room: IRoom) => void;
  "room:event": (actionState: actionStates) => void;
  "player:kitty": (cards: string[]) => void;
  "player:play": () => void;
  "room:dumpfailed": (cards:string[], returns:string[]) => void;
}
  export interface ClientEvents {
    "lobby:list": () => void;
  
    "lobby:create": (
      newRoom: {name:string, startLevel:string}, 
      player:Player,
      callback: (res: Response<IRoom>) => void
    ) => void;
    "lobby:join": (roomid: RoomID,player: Player, callback: (res?: Response<{room: IRoom, hand?: string[]}>) => void) => void;
    "lobby:leave": (roomid: RoomID,playerid: PlayerID) => void;
    "room:prepare": (roomid: RoomID,playerid: PlayerID,prepare:boolean) =>void
    "room:call": (roomid: RoomID,playerid: PlayerID, trump:Trump) =>void
    "room:kitty": (roomid: RoomID,playerid: PlayerID, cards: string[]) =>void
    "room:ticket": (roomid: RoomID,playerid: PlayerID, tickets: any) =>void
    "room:play": (roomid: RoomID,playerid: PlayerID, cards: string[], callback: (fallback? : string[])=> void) =>void
  }