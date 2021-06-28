import { Errors } from "../utils";
import { RoomID, IRoom, ILobbyRoom, PlayerID } from "./room.schema";

export class InMemoryRoomRepository {
  private readonly rooms: Map<RoomID, IRoom> = new Map();

  /**
   * List all Room info for lobby
   */
  listLobby(): Promise<ILobbyRoom[]> {
    const entities: ILobbyRoom[] = Array.from(this.rooms.values()).map((room) => {
      return StripeRoom(room);
    });
    return Promise.resolve(entities);
  }

  findById(id: RoomID): Promise<IRoom> {
    if (this.rooms.has(id)) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return Promise.resolve(this.rooms.get(id)!);
    } else {
      return Promise.reject(Errors.ENTITY_NOT_FOUND);
    }
  }

  save(entity: IRoom): Promise<void> {
    this.rooms.set(entity.id, entity);
    return Promise.resolve();
  }

  deleteById(id: RoomID): Promise<void> {
    const deleted = this.rooms.delete(id);
    if (deleted) {
      return Promise.resolve();
    } else {
      return Promise.reject(Errors.ENTITY_NOT_FOUND);
    }
  }

  async removePlayerById(roomid: RoomID, playerid: PlayerID): Promise<IRoom> {
    const room: IRoom = await this.findById(roomid);
    room.players = room.players.map((p) =>(p && p.id === playerid)?null:p);
    await this.save(room);
    return Promise.resolve(room);
  }
  async removePlayerBySocketId(roomid: RoomID, socketid: string): Promise<IRoom> {
    const room: IRoom = await this.findById(roomid);
    room.players = room.players.filter((p) => p && p.socketid !== socketid);
    await this.save(room);
    return Promise.resolve(room);
  }
}
export function StripeRoom(room: IRoom): ILobbyRoom {
  return { id: room.id, name: room.name, playernumber: room.players.filter((p) => p).length };
}
