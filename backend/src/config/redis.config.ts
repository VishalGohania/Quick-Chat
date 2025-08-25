import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export const publisher = redis;
export const subscriber = redis;

export async function waitRedisReady() {
  try {
    await redis.ping();
    console.log("Upstash Redis is ready");
  } catch (err: any) {
    console.error("Upstash Redis ping failed:", err.message);
    throw err;
  }
}