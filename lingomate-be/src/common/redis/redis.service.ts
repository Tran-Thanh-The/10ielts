import { Injectable, Inject } from "@nestjs/common";
import { Redis } from "ioredis";

@Injectable()
export class RedisService {
  constructor(@Inject("REDIS_CLIENT") private readonly redisClient: Redis) {}

  /**
   * Redis string
   */
  async set(key: string, value: string, nx?: "EX", ttl?: number) {
    if (nx && ttl) {
      await this.redisClient.set(key, value, "EX", ttl);
    } else {
      await this.redisClient.set(key, value);
    }
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

  /**
   * Redis set
   */
  async sadd(key: string, value: string) {
    await this.redisClient.sadd(key, value);
  }

  async srem(key: string, value: string) {
    await this.redisClient.srem(key, value);
  }

  async smembers(key: string) {
    return this.redisClient.smembers(key);
  }

  /**
   * Redis hash
   */
  async hset(key: string, field: string, value: string, ttl?: number) {
    await this.redisClient.hset(key, field, value);
    if (ttl) {
      // Note: ttl applies to the entire hash, not a specific field
      await this.redisClient.expire(key, ttl);
    }
  }

  async hget(key: string, field: string): Promise<string | null> {
    return this.redisClient.hget(key, field);
  }

  async hdel(key: string, field: string) {
    await this.redisClient.hdel(key, field);
  }

  async hgetall(key: string): Promise<{ [key: string]: string }> {
    return this.redisClient.hgetall(key);
  }

  async hmget(key: string, fields: string[]): Promise<(string | null)[]> {
    return this.redisClient.hmget(key, ...fields);
  }

  async hlen(key: string): Promise<number> {
    return this.redisClient.hlen(key);
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
