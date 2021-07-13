import { Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { ClientEvents, ServerEvents } from "../events";
const Client = require("socket.io-client");
const io = require("../index")
describe("room handler tests", () => {
  let serverSocket: Socket<ClientEvents, ServerEvents, DefaultEventsMap>, clientSocket;

  beforeEach(() => {
    clientSocket = new Client('http://localhost:3000')
  });

  afterEach(() => {
    io.close();
    if(clientSocket) clientSocket.close();
  });

  test("should join lobby on connection", (done) => {
    io.on("connection", (socket:Socket<ClientEvents, ServerEvents, DefaultEventsMap>) => {
      expect(socket.rooms).toContain("lobby");
      done();
    });
  });

//   test("should work (with ack)", (done) => {
//     serverSocket.on("hi", (cb) => {
//       cb("hola");
//     });
//     clientSocket.emit("hi", (arg) => {
//       expect(arg).toBe("hola");
//       done();
//     });
//   });
});