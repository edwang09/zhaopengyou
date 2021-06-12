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
}
export interface Room {
  id?: RoomID;
  name: string;
  players: Player[];
}

export interface ServerEvents {
    "lobby:created": (room: Room) => void;
    "lobby:list": (rooms: Room[]) => void;
    "lobby:deleted": (id: RoomID) => void;
    "lobby:updated": (room: Room) => void;
    "room:updated": (room: Room) => void;
  }
  
  export interface ClientEvents {
    "lobby:list": () => void;
  
    "lobby:create": (
      payload: Omit<Room, "id">,
      callback: (res: Response<Room>) => void
    ) => void;
  
    // "lobby:read": (id: RoomID, callback: (res: Response<Room>) => void) => void;
  
    // "lobby:update": (
    //   payload: Room,
    //   callback: (res?: Response<void>) => void
    // ) => void;
  
    // "lobby:delete": (id: RoomID, callback: (res?: Response<void>) => void) => void;
    "lobby:join": (roomid: RoomID,player: Player, callback: (res?: Response<Room>) => void) => void;
    "lobby:leave": (roomid: RoomID,playerid: PlayerID, callback: (res?: Response<void>) => void) => void;
  }