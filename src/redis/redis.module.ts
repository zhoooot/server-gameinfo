import { Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { redisClientFactory } from './redis.factory';
import { RedisRepository } from './redis.repo';

@Module({
  providers: [RedisService, RedisRepository, redisClientFactory],
  exports: [RedisRepository],
})
export class RedisModule {}
