import { ExtendedError, Server, Socket } from "socket.io";
import prisma from "./config/db.config.js";
import { channel, subscribe } from "diagnostics_channel";
import { publisher, subscriber } from "./config/redis.config.js";
import { createAdapter } from "@socket.io/redis-adapter";

interface CustomSocket extends Socket {
  room?: string;
}

export function setupSocket(io: Server) {
  subscriber.once("ready", () => {
    subscriber.psubscribe("chat:*", (err, count) => {
      if (err) {
        console.error("psubscribe error:", err);
      } else {
        console.log("psubscribe active on chat:*, subscriptions:", count);
      }
    });
  });

  // subscribe
  
    subscriber.on('pmessage', (_pattern: string, message: string, channel: string) => {
      const [, roomId] = String(channel).split(":");
      if(!roomId) return;

      let payload: any;
      try {
        payload = JSON.parse(String(message));
      } catch {
        return;
      }
      io.to(roomId).emit('message', payload);
    })

  io.use((socket: CustomSocket, next: (err?: ExtendedError) => void) => {
    const room = 
      (socket.handshake.auth as any)?.room ||
      (socket.handshake.headers as any)?.room || 
      (socket.handshake.query as any)?.room;

    if(!room || String(room).trim() === "") {
      return next(new Error("Invalid room"));
    }
    socket.room = String(room);
    next();
  });

  io.on("connection", (socket: CustomSocket) => {
    if(!socket.room) {
      socket.disconnect(true);
      return;
    }

    // join the room
    socket.join(socket.room);
    console.log("The socket connected..", socket.id, "room:", socket.room);


    socket.on("message", async (data) => {
      console.log("Server side message", data);

      try {
        const chatData = {
          group_id: data.group_id,
          message: data.message,
          name: data.name
        };

        const savedChat = await prisma.chats.create({
          data: chatData
        });
        console.log("Chat saved successfully:", savedChat);
        socket.emit("message", data);
        socket.to(socket.room!).emit("message", savedChat);
        await publisher.publish(`chat:${socket.room}`, JSON.stringify(savedChat));

      } catch (error: any) {
        console.error("Error saving chat to database:", error);
        socket.emit("error", {
          message: "Failed to save message",
          error: error?.message ?? "unknown"
        })
      }
    })
    socket.on("disconnect", () => {
      console.log("A user disconnected", socket.id);
    })
  })
}