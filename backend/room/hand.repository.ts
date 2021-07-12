import { Errors } from "../utils";
import { PlayerID } from "./room.schema";

export class InMemoryHandRepository {
  private readonly hands: Map<PlayerID, string[]> = new Map();

  getById(id: PlayerID): Promise<string[]> {
    if (this.hands.has(id)) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return Promise.resolve(this.hands.get(id)!);
    } else {
      return Promise.reject(Errors.ENTITY_NOT_FOUND);
    }
  }

  add(id: PlayerID, cards: string[]): Promise<void> {
    if (this.hands.has(id)) {
      const current = this.hands.get(id);
      this.hands.set(id, [...(current as string[]), ...cards]);
      return Promise.resolve();
    } else {
      return Promise.reject(Errors.ENTITY_NOT_FOUND);
    }
  }
  remove(id: PlayerID, cards: string[]): Promise<void> {
    const current = this.hands.get(id);
    if (current) {
      cards.forEach((c) => {
        const index = current.indexOf(c);
        current.splice(index,1);
      });
      this.hands.set(id, current);
      return Promise.resolve();
    } else {
      return Promise.reject(Errors.ENTITY_NOT_FOUND);
    }
  }

  init(id: PlayerID): Promise<void> {
      this.hands.set(id, []);
      return Promise.resolve();
  }
}
