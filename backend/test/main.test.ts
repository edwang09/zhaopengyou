import { Judge } from "../helpers/judge";
import { IRoom, playerCamp } from "../room/room.schema";

test("basic", () => {
  expect(0).toBe(0);
});
const roomTemplate:IRoom = {
  id:"template",
  name:"template",
  startLevel: 2,
  players:[
    {id : "0", name:"0", avatarIndex:0,socketid:"socket0", cards:["s14"],points:[], camp:playerCamp.UNKNOWN},
    {id : "1", name:"1", avatarIndex:1,socketid:"socket1", cards:[],points:[], camp:playerCamp.UNKNOWN},
    {id : "2", name:"2", avatarIndex:2,socketid:"socket2", cards:[],points:[], camp:playerCamp.UNKNOWN},
    {id : "3", name:"3", avatarIndex:3,socketid:"socket3", cards:[],points:[], camp:playerCamp.UNKNOWN},
    {id : "4", name:"4", avatarIndex:4,socketid:"socket4", cards:[],points:[], camp:playerCamp.UNKNOWN},
    {id : "5", name:"5", avatarIndex:5,socketid:"socket5", cards:[],points:[], camp:playerCamp.UNKNOWN},
  ],
  initiatorIndex:0,
  trump:{
    number: "02",
    suit: "h",
    count: 1,
  },
  tickets:[
    {card: "s14", sequence: 1, seen:0},
    {card: "d14", sequence: 1, seen:0},
  ]

}

describe('Next Socket ID Test', () => {
  let socketid:string
  let room:IRoom
  // //test getting next player correctly
  // expect(getNextPlayerSocket(roomTemplate)[0]).toBe("socket1");
  // //test getting winner correctly 1
  // roomTemplate.players = [
  //   {id : "0", name:"0", avatarIndex:0,socketid:"socket0", cards:["s14"]},
  //   {id : "1", name:"1", avatarIndex:1,socketid:"socket1", cards:["s14"]},
  //   {id : "2", name:"2", avatarIndex:2,socketid:"socket2", cards:["s13"]},
  //   {id : "3", name:"3", avatarIndex:3,socketid:"socket3", cards:["s12"]},
  //   {id : "4", name:"4", avatarIndex:4,socketid:"socket4", cards:["s10"]},
  //   {id : "5", name:"5", avatarIndex:5,socketid:"socket5", cards:["s03"]},
  // ];
  
  // [socketid, room] = getNextPlayerSocket(roomTemplate)
  // expect(socketid).toBe("socket0");
  // expect(room.initiatorIndex).toBe(0);
  
  // //test getting winner correctly 2
  // roomTemplate.players = [
  //   {id : "0", name:"0", avatarIndex:0,socketid:"socket0", cards:["s05"]},
  //   {id : "1", name:"1", avatarIndex:1,socketid:"socket1", cards:["s14"]},
  //   {id : "2", name:"2", avatarIndex:2,socketid:"socket2", cards:["s13"]},
  //   {id : "3", name:"3", avatarIndex:3,socketid:"socket3", cards:["s12"]},
  //   {id : "4", name:"4", avatarIndex:4,socketid:"socket4", cards:["s10"]},
  //   {id : "5", name:"5", avatarIndex:5,socketid:"socket5", cards:["s03"]},
  // ];
  // [socketid, room] = getNextPlayerSocket(roomTemplate)
  // expect(socketid).toBe("socket1");
  // expect(room.initiatorIndex).toBe(1);
  
  // //test getting winner correctly 3
  // roomTemplate.players = [
  //   {id : "0", name:"0", avatarIndex:0,socketid:"socket0", cards:["s05", "s05"]},
  //   {id : "1", name:"1", avatarIndex:1,socketid:"socket1", cards:["s14", "s05"]},
  //   {id : "2", name:"2", avatarIndex:2,socketid:"socket2", cards:["s13", "s05"]},
  //   {id : "3", name:"3", avatarIndex:3,socketid:"socket3", cards:["s12", "s05"]},
  //   {id : "4", name:"4", avatarIndex:4,socketid:"socket4", cards:["s10", "s05"]},
  //   {id : "5", name:"5", avatarIndex:5,socketid:"socket5", cards:["s03", "s05"]},
  // ];
  // roomTemplate.initiatorIndex = 0;
  // [socketid, room] = getNextPlayerSocket(roomTemplate)
  // expect(socketid).toBe("socket0");
  // expect(room.initiatorIndex).toBe(0);

  // //test getting winner correctly 3
  // roomTemplate.players = [
  //   {id : "0", name:"0", avatarIndex:0,socketid:"socket0", cards:["s05", "s05"]},
  //   {id : "1", name:"1", avatarIndex:1,socketid:"socket1", cards:["s14", "s05"]},
  //   {id : "2", name:"2", avatarIndex:2,socketid:"socket2", cards:["s13", "s05"]},
  //   {id : "3", name:"3", avatarIndex:3,socketid:"socket3", cards:["s12", "s12"]},
  //   {id : "4", name:"4", avatarIndex:4,socketid:"socket4", cards:["s10", "s05"]},
  //   {id : "5", name:"5", avatarIndex:5,socketid:"socket5", cards:["s03", "s05"]},
  // ];
  // roomTemplate.initiatorIndex = 0;
  // [socketid, room] = getNextPlayerSocket(roomTemplate)
  // expect(socketid).toBe("socket3");
  // expect(room.initiatorIndex).toBe(3);

  // //test getting winner correctly 5
  // roomTemplate.players = [
  //   {id : "0", name:"0", avatarIndex:0,socketid:"socket0", cards:["s05", "s05"]},
  //   {id : "1", name:"1", avatarIndex:1,socketid:"socket1", cards:["s14", "s05"]},
  //   {id : "2", name:"2", avatarIndex:2,socketid:"socket2", cards:["s13", "s05"]},
  //   {id : "3", name:"3", avatarIndex:3,socketid:"socket3", cards:["h04", "h04"]},
  //   {id : "4", name:"4", avatarIndex:4,socketid:"socket4", cards:["s10", "s05"]},
  //   {id : "5", name:"5", avatarIndex:5,socketid:"socket5", cards:["s02", "s02"]},
  // ];
  // roomTemplate.initiatorIndex = 0;
  // [socketid, room] = getNextPlayerSocket(roomTemplate)
  // expect(socketid).toBe("socket5");
  // expect(room.initiatorIndex).toBe(5);

  //test getting winner correctly when Dumping
  // roomTemplate.players = [
  //   {id : "0", name:"0", avatarIndex:0,socketid:"socket0", cards:["s05", "s05","s06", "s06", "s14"]},
  //   {id : "1", name:"1", avatarIndex:1,socketid:"socket1", cards:["s14", "s06","s06","s06","s05"]},
  //   {id : "2", name:"2", avatarIndex:2,socketid:"socket2", cards:["s13","s06","s06","s06", "s05"]},
  //   {id : "3", name:"3", avatarIndex:3,socketid:"socket3", cards:["h04", "h04", "h05", "h05", "h03"]},
  //   {id : "4", name:"4", avatarIndex:4,socketid:"socket4", cards:["s10", "s05", "d05", "d05", "d05"]},
  //   {id : "5", name:"5", avatarIndex:5,socketid:"socket5", cards:["s02", "s02", "h02", "j0", "h10"]},
  // ];
  // roomTemplate.initiatorIndex = 0;
  // [socketid, room] = getNextPlayerSocket(roomTemplate)
  // expect(socketid).toBe("socket3");
  // expect(room.initiatorIndex).toBe(3);

  //test 
  const judge = new Judge(roomTemplate.trump, roomTemplate.tickets)
  let cards = []
  //cards = [ [ 'c14' ], [ 'c06' ], [ 'c04' ], [ 'c13' ], [ 'c06' ], [ 'c04' ] ]
  // expect(judge.getWinnerIndex(cards, 3)).toEqual([0,['c13']])
  cards = [ [ 'c11', 'c11' ], [ 'c07', 'c07' ], [ 'c12', 'c12' ], [ 'c03', 'c03' ], [ 'c09', 'c09' ], [ 'c05', 'c03' ] ]
  expect(judge.getWinnerIndex(cards, 2)).toEqual([2,['c05']])
});