import { Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { ClientEvents, ServerEvents } from "../events";
import { RoomID } from "../room/room.schema";
const Client = require("socket.io-client");
const io = require("../index")
describe("room handler tests", () => {
  let serverSocket: Socket<ClientEvents, ServerEvents, DefaultEventsMap>, clientSocket;
  let roomid: RoomID
  beforeAll(() => {
    clientSocket = new Client('http://localhost:3000')
  });

  afterAll(() => {
    io.close();
    if(clientSocket) clientSocket.close();
  });

  test("should join lobby on connection", (done) => {
    io.on("connection", (socket:Socket<ClientEvents, ServerEvents, DefaultEventsMap>) => {
      serverSocket = socket;
      expect(socket.rooms).toContain("lobby");
      done();
    });
  });

  test("should create and join lobby", (done) => {
    serverSocket.on("lobby:join", () => {
      expect(serverSocket.rooms).toContain(roomid);
    });
    serverSocket.on("lobby:leave", () => {
      done();
    });
    clientSocket.emit("lobby:create", {
      name:"test room", 
      startLevel:"02"}, 
      {id:"playerid1", name:"create player", avatarIndex:0}, (res)=>{
        expect(res.data.id).toBeTruthy();
        roomid = res.data.id
        clientSocket.emit("lobby:join", 
          roomid, 
          {id:"playerid2", name:"join player", avatarIndex:0}, (res)=>{
            expect(res.data.room).toBeTruthy();
        })
        clientSocket.emit("lobby:leave", 
          roomid, 
          "playerid2")
    })
  });

});