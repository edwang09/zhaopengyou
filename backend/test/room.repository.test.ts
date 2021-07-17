import { doesNotMatch } from "assert";
import { InMemoryRoomRepository, StripeRoom } from "../room/room.repository";
import { IRoom, playerCamp } from "../room/room.schema";

describe("room repository tests", () => {
  let testRoomRepository: InMemoryRoomRepository;
  const testRoom: IRoom = {
    id: "test",
    name: "test room",
    startLevel: "02",
    players: [
      { id: "test", name: "player", avatarIndex: 0, socketid: "testsocketid", cards: [], points: [], camp: playerCamp.UNKNOWN },
      { id: "test2", name: "player2", avatarIndex: 0, socketid: "testsocketid2", cards: [], points: [], camp: playerCamp.UNKNOWN },
    ],
  };
  beforeAll(() => {
    testRoomRepository = new InMemoryRoomRepository();
  });

  test("should save room", (done) => {
    testRoomRepository.save(testRoom).then(() => {
      done();
    });
  });

  test("should find room", (done) => {
    testRoomRepository.findById("test").then((room) => {
      expect(testRoom).toEqual(room);
      done();
    });
  });
  test("should list rooms", (done) => {
    testRoomRepository.listLobby().then((rooms) => {
      expect(rooms.length).toBe(1);
      done();
    });
  });
  test("should remove player", (done) => {
    testRoomRepository.removePlayerById("test", "test").then((room) => {
      done();
    });
  });
  test("should remove player by socketid", (done) => {
    testRoomRepository.removePlayerBySocketId("test", "testsocketid2").then((room) => {
      done();
    });
  });

  test("should delete room", (done) => {
    testRoomRepository.deleteById("test").then((room) => {
      done();
    });
  });
  test("should strip room", () => {
    expect(StripeRoom(testRoom)).toEqual({ id: testRoom.id, name: testRoom.name, playernumber: testRoom.players.length });
  });
});
