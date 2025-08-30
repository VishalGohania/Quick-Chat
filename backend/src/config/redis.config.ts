import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export const publisher = redis;
export const subscriber = redis;

export async function waitRedisReady() {
  try {
    const pingPromise = redis.ping();
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Redis ping timeout')), 5000)
    );
    await Promise.race([pingPromise, timeoutPromise])
    console.log("Upstash Redis is ready");
  } catch (err: any) {
    console.error("Upstash Redis ping failed:", err.message);
    if(process.env.NODE_ENV === "development")
      throw new Error("Upstash Redis is not ready");
  }
}