import { actionStates } from "../events";
import { newDeck, resolvePlay } from "../helpers/helper";
import { IRoom, playerCamp } from "../room/room.schema";

describe("helper function test", () => {
  test("new deck test", () => {
    const newdeck = newDeck();
    expect(newdeck).toHaveLength(216);
  });
  test("resolve play test", () => {
    const newdeck = newDeck();
    expect(newdeck).toHaveLength(216);
  });
});
const roomTemplate = {
  id: "template",
  name: "template",
  startLevel: "02",
  initiatorIndex: 0,
  trump: {
    number: "02",
    suit: "h",
    count: 1,
  },
  tickets: [
    { card: "s14", sequence: 1, seen: 0 },
    { card: "d14", sequence: 1, seen: 0 },
  ],
};
const playerTemplate = (id: string) => {
  return {
    id: id,
    name: id,
    avatarIndex: 0,
    socketid: `socket${id}`,
    cards: [],
    points: [],
    camp: playerCamp.UNKNOWN,
    actionState: actionStates.CLEAR,
  };
};
describe("mid round resolve play test", () => {
  const roomInput: IRoom = {
    ...roomTemplate,
    players: [
      { ...playerTemplate("0"), cards: ["s14"] },
      { ...playerTemplate("1"), actionState: actionStates.PLAY },
      { ...playerTemplate("2") },
      { ...playerTemplate("3") },
      { ...playerTemplate("4") },
      { ...playerTemplate("5") },
    ],
  };
  const roomOutput: IRoom = {
    ...roomTemplate,
    players: [
      { ...playerTemplate("0"), cards: ["s14"] },
      { ...playerTemplate("1"), cards: ["s13"] },
      { ...playerTemplate("2"), actionState: actionStates.PLAY },
      { ...playerTemplate("3") },
      { ...playerTemplate("4") },
      { ...playerTemplate("5") },
    ],
  };
  test("mid round test", () => {
    expect(resolvePlay(roomInput, "1", ["s13"])).toEqual([2, roomOutput]);
  });
});

describe("end round resolve play test", () => {
  const roomInput: IRoom = {
    ...roomTemplate,
    players: [
      { ...playerTemplate("0"), cards: ["s14"] },
      { ...playerTemplate("1"), cards: ["s13"] },
      { ...playerTemplate("2"), cards: ["s10"] },
      { ...playerTemplate("3"), cards: ["s03"] },
      { ...playerTemplate("4"), cards: ["s06"] },
      { ...playerTemplate("5"), actionState: actionStates.PLAY },
    ],
  };
  const roomOutput: IRoom = {
    ...roomTemplate,
    players: [
      { ...playerTemplate("0"), cards: ["s14"], points: ["s13", "s10", "s05"], actionState: actionStates.PLAY },
      { ...playerTemplate("1"), cards: ["s13"] },
      { ...playerTemplate("2"), cards: ["s10"] },
      { ...playerTemplate("3"), cards: ["s03"] },
      { ...playerTemplate("4"), cards: ["s06"] },
      { ...playerTemplate("5"), cards: ["s05"] },
    ],
  };
  test("end round 1 card same winner", () => {
    expect(resolvePlay(roomInput, "5", ["s05"])).toEqual([0, roomOutput]);
  });
});

describe("end round resolve play test", () => {
  const roomInput: IRoom = {
    ...roomTemplate,
    players: [
      { ...playerTemplate("0"), cards: ["s14","s13","s13","s13"] },
      { ...playerTemplate("1"), cards: ["s12","s12","s11","s11"] },
      { ...playerTemplate("2"), cards: ["s10","d10","d08","c09"] },
      { ...playerTemplate("3"), cards: ["s03","d10","d08","c09"] },
      { ...playerTemplate("4"), cards: ["s06","d10","d08","c09"] },
      { ...playerTemplate("5"), actionState: actionStates.PLAY },
    ],
  };
  const roomOutput: IRoom = {
    ...roomTemplate,
    players: [
      { ...playerTemplate("0"), cards: ["s14","s13","s13","s13"] },
      { ...playerTemplate("1"), cards: ["s12","s12","s11","s11"] },
      { ...playerTemplate("2"), cards: ["s10","d10","d08","c09"] },
      { ...playerTemplate("3"), cards: ["s03","d10","d08","c09"] },
      { ...playerTemplate("4"), cards: ["s06","d10","d08","c09"] },
      { ...playerTemplate("5"), cards: ["h05","h04","h04","h04"], points: ["s13","s13","s13","s10", "d10", "d10", "d10","h05"], actionState: actionStates.PLAY  },
    ],
    initiatorIndex:5
  };
  test("end round 1 card same winner", () => {
    expect(resolvePlay(roomInput, "5", ["h05","h04","h04","h04"])).toEqual([5, roomOutput]);
  });
});