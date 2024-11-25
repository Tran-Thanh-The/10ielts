import { Injectable, Inject } from "@nestjs/common";
import { Redis } from "ioredis";

@Injectable()
export class RedisService {
  constructor(@Inject("REDIS_CLIENT") private readonly redisClient: Redis) {}

  async set(key: string, value: string, nx?: "EX", ttl?: number) {
    if (nx && ttl) {
      await this.redisClient.set(key, value, "EX", ttl);
    } else {
      await this.redisClient.set(key, value);
    }
  }

  async sadd(key: string, value: string) {
    await this.redisClient.sadd(key, value);
  }

  async srem(key: string, value: string) {
    await this.redisClient.srem(key, value);
  }

  async smembers(key: string) {
    return this.redisClient.smembers(key);
  }

  async get(key: string): Promise<string | null> {
    return this.redisClient.get(key);
  }

  async del(key: string) {
    await this.redisClient.del(key);
  }

  async publish(channel: string, message: string) {
    await this.redisClient.publish(channel, message);
  }

  async subscribe(channel: string) {
    return new Promise(async (resolve) => {
      await this.redisClient.subscribe(channel, (err, count) => {
        if (err) {
          console.error("Error subscribing to channel:", err);
        } else {
          console.log(`Subscribed to ${count} channel(s).`);
        }
      });

      this.redisClient.on("message", (channel, message) => {
        console.log(`Received message from ${channel}: ${message}`);
        resolve(message); // Resolve the promise with the message
      });
    });
  }
}
