  
import { Server as HttpServer } from "http";
import { Server, ServerOptions } from "socket.io";
import { ClientEvents, ServerEvents } from "./events";
import { RoomRepository } from "./room/room.repository";
import { registerRoomHandlers} from "./room/room.handler";
export interface Components {
  roomRepository: RoomRepository;
}

export function createApplication(
  httpServer: HttpServer,
  components: Components,
  serverOptions: Partial<ServerOptions> = {}
): Server<ClientEvents, ServerEvents> {
  const io = new Server<ClientEvents, ServerEvents>(httpServer, serverOptions);



  io.on("connection", (socket) => {
    console.log(socket.id)
    socket.join("lobby");
    registerRoomHandlers(io, socket, components);
  });

  return io;
}