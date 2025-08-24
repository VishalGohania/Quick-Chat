import { Redis } from "ioredis";

const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";

export const publisher = new Redis(REDIS_URL);
export const subscriber = new Redis(REDIS_URL);

// export async function connectRedis() {
//   if(!publisher.isOpen) await publisher.connect();
//   if(!subscriber.isOpen) await subscriber.connect();
// }

publisher.on("error", (e) => console.error("Redis publisher error:", e.message));
subscriber.on("error", (e) => console.error("Redis subscriber error:", e.message));

export async function waitRedisReady() {
  await publisher.ping();
  await subscriber.ping();
  console.log("Redis publisher + subscriber ready");
}