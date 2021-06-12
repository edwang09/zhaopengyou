import { Errors } from "../utils";
import { RoomID, Room } from "./room.schema";
abstract class CrudRepository<T, ID> {
  abstract findAll(): Promise<T[]>;
  abstract findById(id: ID): Promise<T>;
  abstract save(entity: T): Promise<void>;
  abstract deleteById(id: ID): Promise<void>;
}




export abstract class RoomRepository extends CrudRepository<Room, RoomID> {}

export class InMemoryRoomRepository extends RoomRepository {
  private readonly rooms: Map<RoomID, Room> = new Map();

  findAll(): Promise<Room[]> {
    const entities = Array.from(this.rooms.values());
    return Promise.resolve(entities);
  }

  findById(id: RoomID): Promise<Room> {
    if (this.rooms.has(id)) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return Promise.resolve(this.rooms.get(id)!);
    } else {
      return Promise.reject(Errors.ENTITY_NOT_FOUND);
    }
  }

  save(entity: Room): Promise<void> {
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
}
