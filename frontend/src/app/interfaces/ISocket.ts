import { actionStates } from "../enums/enums";

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
  level?: number,
  camp?: string
  prepared?: boolean;
  cards?: string[];
  actionState?:number
}
export interface Ticket {
  suit?: string
  number?: string
  sequence? : number
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

export interface IRoom {
  id?: RoomID;
  name: string;
  players: (Player | null)[];
  startLevel: number
  dealerIndex?:number
  trump:Trump
  kitty?:string[]
  tickets?:Ticket[]
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
}
  export interface ClientEvents {
    "lobby:list": () => void;
  
    "lobby:create": (
      payload: Omit<IRoom, "id">,
      callback: (res: Response<IRoom>) => void
    ) => void;
    "lobby:join": (roomid: RoomID,player: Player, callback: (res?: Response<{room: IRoom, hand?: string[]}>) => void) => void;
    "lobby:leave": (roomid: RoomID,playerid: PlayerID) => void;
    "room:prepare": (roomid: RoomID,playerid: PlayerID,prepare:boolean) =>void
    "room:call": (roomid: RoomID,playerid: PlayerID, trump:Trump) =>void
    "room:kitty": (roomid: RoomID,playerid: PlayerID, cards: string[]) =>void
    "room:ticket": (roomid: RoomID,playerid: PlayerID, tickets: any) =>void
    "room:play": (roomid: RoomID,playerid: PlayerID, cards: string[]) =>void
  }