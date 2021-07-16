import { GameApp } from "../app/app"
import { playerCamp } from "../app/enums/enums"
import { IRoom } from "../app/interfaces/ISocket"

describe("app test",()=>{
    const roomTemplate:IRoom = {
        id:"template",
        name:"template",
        startLevel: "02",
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
    test("new app",(done)=>{
        const app = new GameApp(document.body, 1024, 720)
        setTimeout(()=>{app.registerUser()},1000);
        setTimeout(()=>{app.arrangeRoom(roomTemplate)},2000);
        
        done();
    })
})