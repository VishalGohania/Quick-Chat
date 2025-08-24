import {io, Socket} from "socket.io-client";
import Env from "./env";

let socket: Socket;
export const getSocket = (): Socket => {
  if(!socket) {
    socket = io(Env.BACKEND_URL, {
      autoConnect: false,
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 500,
      reconnectionDelayMax: 3000,
      transports: ["websocket", "polling"],
    });
  }
  return socket;
}