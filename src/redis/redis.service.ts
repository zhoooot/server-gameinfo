import { Inject, Injectable } from '@nestjs/common';
import { RedisRepository } from './redis.repo';

@Injectable()
export class RedisService {
  constructor(
    @Inject(RedisRepository) private readonly redisRepository: RedisRepository,
  ) {}
}
