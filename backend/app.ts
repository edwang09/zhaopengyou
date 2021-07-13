  
import { Server as HttpServer } from "http";
import { Server, ServerOptions } from "socket.io";
import { ClientEvents, ServerEvents } from "./events";
import { InMemoryRoomRepository } from "./room/room.repository";
import { registerRoomHandlers} from "./room/room.handler";
import { InMemoryHandRepository } from "./room/hand.repository";
export interface Components {
  roomRepository: InMemoryRoomRepository;
  handRepository: InMemoryHandRepository;
}

export function createApplication(
  httpServer: HttpServer,
  components: Components,
  serverOptions: Partial<ServerOptions> = {}
): Server<ClientEvents, ServerEvents> {
  const io = new Server<ClientEvents, ServerEvents>(httpServer, serverOptions);



  io.on("connection", (socket) => {
    socket.join("lobby");
    registerRoomHandlers(io, socket, components);
  });

  return io;
}