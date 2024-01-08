import { Inject, Injectable, OnModuleDestroy } from '@nestjs/common';
import { RedisRepositoryInterface } from './redis.repository.interface';
import { Redis } from 'ioredis';

@Injectable()
export class RedisRepository
  implements OnModuleDestroy, RedisRepositoryInterface
{
  constructor(@Inject('REDIS') private readonly redisClient: Redis) {}

  async exists(prefix: string, key: string): Promise<boolean> {
    return (await this.redisClient.exists(`${prefix}:${key}`)) === 1;
  }
  async increment(prefix: string, key: string): Promise<number> {
    return await this.redisClient.incr(`${prefix}:${key}`);
  }
  async decrement(prefix: string, key: string): Promise<number> {
    return await this.redisClient.decr(`${prefix}:${key}`);
  }

  async get(prefix: string, key: string): Promise<string> {
    return this.redisClient.get(`${prefix}:${key}`);
  }

  async set(prefix: string, key: string, value: string): Promise<void> {
    await this.redisClient.set(`${prefix}:${key}`, value);
  }

  async delete(prefix: string, key: string): Promise<void> {
    await this.redisClient.del(`${prefix}:${key}`);
  }

  async setWithExpiry(
    prefix: string,
    key: string,
    value: string,
    expiry: number,
  ): Promise<void> {
    await this.redisClient.set(`${prefix}:${key}`, value, 'EX', expiry);
  }

  onModuleDestroy() {
    this.redisClient.disconnect();
  }
}
