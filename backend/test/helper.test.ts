import { actionStates } from "../events";
import { newDeck, resolvePlay } from "../helpers/helper";
import { Judge } from "../helpers/judge";
import { IRoom, playerCamp } from "../room/room.schema";

// describe("helper function test", () => {
//   test("new deck test", () => {
//     const newdeck = newDeck();
//     expect(newdeck).toHaveLength(216);
//   });
//   test("resolve play test", () => {
//     const newdeck = newDeck();
//     expect(newdeck).toHaveLength(216);
//   });
// });
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
  cardLeft: 35,
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
// describe("mid round resolve play test", () => {
//   const roomInput: IRoom = {
//     ...roomTemplate,
//     players: [
//       { ...playerTemplate("0"), cards: ["s14"] },
//       { ...playerTemplate("1"), actionState: actionStates.PLAY },
//       { ...playerTemplate("2") },
//       { ...playerTemplate("3") },
//       { ...playerTemplate("4") },
//       { ...playerTemplate("5") },
//     ],
//   };
//   const roomOutput: IRoom = {
//     ...roomTemplate,
//     players: [
//       { ...playerTemplate("0"), cards: ["s14"] },
//       { ...playerTemplate("1"), cards: ["s13"] },
//       { ...playerTemplate("2"), actionState: actionStates.PLAY },
//       { ...playerTemplate("3") },
//       { ...playerTemplate("4") },
//       { ...playerTemplate("5") },
//     ],
//   };
//   test("mid round test", async () => {
//     expect(resolvePlay(roomInput, "1", ["s13"], [])).toEqual([2, roomOutput, []]);
//   });
// });

// describe("end round resolve play test", () => {
//   const roomInput: IRoom = {
//     ...roomTemplate,
//     players: [
//       { ...playerTemplate("0"), cards: ["s14"] },
//       { ...playerTemplate("1"), cards: ["s13"] },
//       { ...playerTemplate("2"), cards: ["s10"] },
//       { ...playerTemplate("3"), cards: ["s03"] },
//       { ...playerTemplate("4"), cards: ["s06"] },
//       { ...playerTemplate("5"), actionState: actionStates.PLAY },
//     ],
//   };
//   const roomOutput: IRoom = {
//     ...roomTemplate,
//     players: [
//       { ...playerTemplate("0"), cards: ["s14"], points: ["s13", "s10", "s05"], actionState: actionStates.PLAY },
//       { ...playerTemplate("1"), cards: ["s13"] },
//       { ...playerTemplate("2"), cards: ["s10"] },
//       { ...playerTemplate("3"), cards: ["s03"] },
//       { ...playerTemplate("4"), cards: ["s06"] },
//       { ...playerTemplate("5"), cards: ["s05"] },
//     ],
//   };
//   test("end round 1 card same winner", () => {
//     expect(resolvePlay(roomInput, "5", ["s05"], [])).toEqual([0, roomOutput, []]);
//   });
// });

// describe("end round resolve play test", () => {
//   const roomInput: IRoom = {
//     ...roomTemplate,
//     players: [
//       { ...playerTemplate("0"), cards: ["s14","s13","s13","s13"] },
//       { ...playerTemplate("1"), cards: ["s12","s12","s11","s11"] },
//       { ...playerTemplate("2"), cards: ["s10","d10","d08","c09"] },
//       { ...playerTemplate("3"), cards: ["s03","d10","d08","c09"] },
//       { ...playerTemplate("4"), cards: ["s06","d10","d08","c09"] },
//       { ...playerTemplate("5"), actionState: actionStates.PLAY },
//     ],
//   };
//   const roomOutput: IRoom = {
//     ...roomTemplate,
//     players: [
//       { ...playerTemplate("0"), cards: ["s14","s13","s13","s13"] },
//       { ...playerTemplate("1"), cards: ["s12","s12","s11","s11"] },
//       { ...playerTemplate("2"), cards: ["s10","d10","d08","c09"] },
//       { ...playerTemplate("3"), cards: ["s03","d10","d08","c09"] },
//       { ...playerTemplate("4"), cards: ["s06","d10","d08","c09"] },
//       { ...playerTemplate("5"), cards: ["h05","h04","h04","h04"], points: ["s13","s13","s13","s10", "d10", "d10", "d10","h05"], actionState: actionStates.PLAY  },
//     ],
//     initiatorIndex:5
//   };
//   test("end round 1 card same winner", () => {
//     expect(resolvePlay(roomInput, "5", ["h05","h04","h04","h04"], [])).toEqual([5, roomOutput, []]);
//   });
// });


describe("end round resolve play test", () => {
  const roomInput: IRoom = {
    ...roomTemplate,
    players: [
      { ...playerTemplate("0"), cards: ["s13","s13","s12","s12"] },
      { ...playerTemplate("1"), cards: ["s14","s14","s07","s07"] },
      { ...playerTemplate("2"), cards: ["s10","d10","d08","c09"] },
      { ...playerTemplate("3"), cards: ["s03","d10","d08","c09"] },
      { ...playerTemplate("4"), cards: ["s06","d10","d08","c09"] },
      { ...playerTemplate("5"), actionState: actionStates.PLAY },
    ],
    initiatorIndex:0
  };
  const roomOutput: IRoom = {
    ...roomTemplate,
    players: [
      { ...playerTemplate("0"), cards: ["s13","s13","s12","s12"] , points: ["s13","s13","s10", "d10", "d10", "d10","s05"], actionState: actionStates.PLAY },
      { ...playerTemplate("1"), cards: ["s14","s14","s07","s07"] },
      { ...playerTemplate("2"), cards: ["s10","d10","d08","c09"] },
      { ...playerTemplate("3"), cards: ["s03","d10","d08","c09"] },
      { ...playerTemplate("4"), cards: ["s06","d10","d08","c09"] },
      { ...playerTemplate("5"), cards: ["s05","s04","s04","s03"] },
    ],
    initiatorIndex:0
  };
  // test("end round 1 card same winner", () => {
  //   expect(resolvePlay(roomInput, "5", ["s05","s04","s04","s03"], [])).toEqual([0, roomOutput, []]);
  // });
  test("decompose", () => {
    const judge = new Judge(roomTemplate.trump, roomTemplate.tickets)
    const input = ["s14","s06","s06","s06","s05","s05","s04","s04"]
    expect(judge.decompose(input)).toEqual([{ width: 3, height: 1, card: 's06' },{ width: 2, height: 2, card: 's04' },{ width: 1, height: 1, card: 's14' }]);
    expect(input).toEqual(["s14","s06","s06","s06","s05","s05","s04","s04"]);

  });
  test("decompose", () => {
    const judge = new Judge(roomTemplate.trump, roomTemplate.tickets)
    const input = ["s02","s02","h14","h14"]
    expect(judge.decompose(input)).toEqual([{ width: 2, height: 2, card: 'h14' }]);
    expect(input).toEqual(["s02","s02","h14","h14"]);

  });
  test("decompose", () => {
    const judge = new Judge(roomTemplate.trump, roomTemplate.tickets)
    const input = ["h02","h02","s02","s02"]
    expect(judge.decompose(input)).toEqual([{ width: 2, height: 2, card: 'f02' }]);
    expect(input).toEqual(["h02","h02","s02","s02"]);

  });
});

// describe("can dump", () => {
//   const dumpCards: string[] = ["s13","s13","s07","s07","s08","s08"];
//   const playerHands: string[][] = [
//     ["s13","s13","s07","s07","s08","s08"],
//     ["s14","s13","s13","s13"],
//     ["s14","s13","s13","s13"],
//     ["s14","s13","s13","s13"],
//     ["s14","s13","s13","s13"],
// ]
//   test("can dump 1", () => {
//     const judge = new Judge(roomTemplate.trump, roomTemplate.tickets)
//     const [canDump, fallback] = judge.canDump(dumpCards, playerHands)
//     expect(canDump).toEqual(true);
//     expect(fallback).toEqual([]);
//   });
// });
// describe("can dump", () => {
//   const dumpCards: string[] = ["s13","s13","s07","s07","s08","s08"];
//   const playerHands: string[][] = [
//     ["s13","s13","s07","s07","s08","s08"],
//     ["s14","s14","s13","s13"],
//     ["s14","s13","s13","s13"],
//     ["s14","s13","s13","s13"],
//     ["s14","s13","s13","s13"],
// ]
//   test("can dump 2", () => {
//     const judge = new Judge(roomTemplate.trump, roomTemplate.tickets)
//     const [canDump, fallback] = judge.canDump(dumpCards, playerHands)
//     expect(canDump).toEqual(false);
//     expect(fallback).toEqual(["s07","s07","s08","s08"]);
//   });
// });
// describe("can dump", () => {
//   const dumpCards: string[] = ["s13","s13","s07","s07","s08","s08", "s12"];
//   const playerHands: string[][] = [
//     ["s13","s13","s07","s07","s08","s08"],
//     ["s14","s14","s13","s13"],
//     ["s14","s13","s13","s13"],
//     ["s14","s13","s13","s13"],
//     ["s14","s13","s13","s13"],
// ]
//   test("can dump 3", () => {
//     const judge = new Judge(roomTemplate.trump, roomTemplate.tickets)
//     const [canDump, fallback] = judge.canDump(dumpCards, playerHands)
//     expect(canDump).toEqual(false);
//     expect(fallback).toEqual(["s12"]);
//   });
// });