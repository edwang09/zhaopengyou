import { IRoom,ILobbyRoom, RoomID, Player, PlayerID, Trump, Ticket } from "./room/room.schema";
import { ValidationErrorItem } from "joi";

interface Error {
  error: string;
  errorDetails?: ValidationErrorItem[];
}

interface Success<T> {
  data: T;
}
export enum actionStates {
  PREPARE,
  KITTY,
  PLAY,
  CALL,
  CLEAR
}
export type Response<T> = Error | Success<T>;

export interface ServerEvents {
  "lobby:created": (room: ILobbyRoom) => void;
  "lobby:list": (rooms: ILobbyRoom[]) => void;
  "lobby:deleted": (id: RoomID) => void;
  "lobby:updated": (room: ILobbyRoom) => void;
  "room:player:updated": (room: IRoom) => void;
  "room:card:updated": (room: IRoom) => void;
  "room:trump:updated": (room: IRoom) => void;
  "room:ticket:updated": (room: IRoom) => void;
  "room:event": (actionState: actionStates) => void;
  "player:deal": (cards: string[]) => void;
  "player:kitty": (cards: string[]) => void;
  "player:play": () => void;
}
export interface ClientEvents {
  "lobby:join": (roomid: RoomID,player: Player, callback: (res?: Response<{room: IRoom, hand?: string[]}>) => void) => void;
  "lobby:leave": (roomid: RoomID,playerid: PlayerID) => void;
  "lobby:create": (
    newRoom: {name:string, startLevel:string}, 
    player:Player,
    callback: (res: Response<IRoom>) => void
  ) => void;
  "room:prepare": (roomid: RoomID,playerid: PlayerID,prepare:boolean) =>void
  "room:call": (roomid: RoomID,playerid: PlayerID, trump:Trump) =>void
  "room:kitty": (roomid: RoomID,playerid: PlayerID, cards: string[]) =>void
  "room:ticket": (roomid: RoomID,playerid: PlayerID, tickets: Ticket[]) =>void
  "room:play": (roomid: RoomID,playerid: PlayerID, cards: string[]) =>void
}