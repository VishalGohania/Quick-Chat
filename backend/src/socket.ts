import { ExtendedError, Server, Socket } from "socket.io";
import prisma from "./config/db.config.js";
import { publisher, subscriber, waitRedisReady } from "./config/redis.config.js";

interface CustomSocket extends Socket {
  room?: string;
}

export async function setupSocket(io: Server) {
  await waitRedisReady().catch(console.error);

  io.use((socket: CustomSocket, next: (err?: ExtendedError) => void) => {
    const room =
      (socket.handshake.auth as any)?.room ||
      (socket.handshake.headers as any)?.room ||
      (socket.handshake.query as any)?.room;

    if (!room || typeof room !== "string" || !room.trim()) {
      return next(new Error("Invalid room"));
    }
    socket.room = room.trim();
    next();
  });

  io.on("connection", (socket: CustomSocket) => {
    const room = socket.room!;
    socket.join(room);
    console.log("Socket connected:", socket.id, "room:", room);

    let polling = true;

    // Poll Redis list for this room to forward messages from other instances
    const poll = async () => {
      while (polling) {
        try {
          const items = await subscriber.lrange(`chat:${room}`, 0, -1);
          if (items.length) {
            await subscriber.del(`chat:${room}`);
            for (const raw of items) {
              try {
                const payload = JSON.parse(raw);
                io.to(room).emit("message", payload);
              } catch {
                // ignore invalid JSON
              }
            }
          }
        } catch (e: any) {
          console.error("Redis polling error:", e.message);
        }
        await new Promise((r) => setTimeout(r, 800)); // ~1s poll
      }
    };
    poll();

    socket.on("message", async (data) => {
      try {
        const chatData = {
          group_id: data.group_id,
          message: data.message,
          name: data.name,
        };

        // Save to DB
        const savedChat = await prisma.chats.create({ data: chatData });

        // Emit locally
        socket.emit("message", savedChat);
        socket.to(room!).emit("message", savedChat);

        // Push into Redis list so other instances can pick it up
        await publisher.lpush(`chat:${room}`, JSON.stringify(savedChat));
      } catch (error: any) {
        console.error("Error saving chat:", error);
        socket.emit("error", {
          message: "Failed to save message",
          error: error?.message ?? "unknown",
        });
      }
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
      polling = false;
      socket.leave(room);
    });
  });
}
