
import { createServer } from "http";
import { createApplication } from "./app";
import { InMemoryRoomRepository } from "./room/room.repository";

const httpServer = createServer();

createApplication(
  httpServer,
  {
    roomRepository: new InMemoryRoomRepository(),
  },
  {
    cors: {
      // origin: ["http://localhost:1234","https://amritb.github.io/socketio-client-tool/"],
      "origin": "*",
      "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
      "preflightContinue": false,
      "optionsSuccessStatus": 204
    },
  }
);

httpServer.listen(3000, ()=>{
  console.log("listening on port 3000")
});