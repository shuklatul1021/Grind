import { Redis } from "ioredis";
import { compilerQueueConfig } from "./config.js";

export function createRedisConnection() {
  return new Redis(compilerQueueConfig.redisUrl, {
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
  });
}
