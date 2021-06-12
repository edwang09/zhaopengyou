import { Room, RoomID, Player, PlayerID } from "./room/room.schema";
import { ValidationErrorItem } from "joi";

interface Error {
  error: string;
  errorDetails?: ValidationErrorItem[];
}

interface Success<T> {
  data: T;
}

export type Response<T> = Error | Success<T>;

export interface ServerEvents {
  "lobby:created": (room: Room) => void;
  "lobby:list": (rooms: Room[]) => void;
  "lobby:deleted": (id: RoomID) => void;
  "lobby:updated": (room: Room) => void;
  "room:updated": (room: Room) => void;
}
export interface ClientEvents {
  "lobby:join": (roomid: RoomID,player: Player, callback: (res?: Response<Room>) => void) => void;
  "lobby:leave": (roomid: RoomID,playerid: PlayerID) => void;
  "lobby:create": (
    payload: Omit<Room, "id">,
    callback: (res: Response<Room>) => void
  ) => void;
}