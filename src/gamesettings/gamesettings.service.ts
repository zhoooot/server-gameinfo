import { Inject, Injectable } from '@nestjs/common';
import { RedisRepository } from 'src/redis/redis.repo';

@Injectable()
export class GamesettingsService {
  constructor(
    @Inject(RedisRepository) private readonly redisRepo: RedisRepository,
  ) {}

  async isLocked(gameid: string): Promise<boolean> {
    return (await this.redisRepo.get(gameid, 'l')) === 'true';
  }

  async lockGame(gameid: string): Promise<void> {
    await this.redisRepo.set(gameid, 'l', 'true');
  }

  async unlockGame(gameid: string): Promise<void> {
    await this.redisRepo.delete(gameid, 'l');
  }

  async retrieveQuestion(gameid: string): Promise<string> {
    const cur = await this.redisRepo.get(gameid, 'q');
    return cur;
  }

  async banUser(gameid: string, username: string): Promise<void> {
    await this.redisRepo.set(gameid, `b:${username}`, 'true');
  }

  async isBanned(gameid: string, username: string): Promise<boolean> {
    return (await this.redisRepo.get(gameid, `b:${username}`)) === 'true';
  }

  async setQuestion(gameid: string, question: string): Promise<void> {
    await this.redisRepo.set(gameid, 'q', question);
  }

  async getQuestionIteration(gameid: string): Promise<number> {
    const cur = await this.redisRepo.get(gameid, 'i');
    return parseInt(cur);
  }

  async setQuestionIteration(gameid: string, iteration: number): Promise<void> {
    await this.redisRepo.set(gameid, 'i', iteration.toString());
  }

  async increQuestionIteration(gameid: string): Promise<void> {
    await this.redisRepo.increment(gameid, 'i');
  }

  async getQuestionRandomFactor(gameid: string): Promise<number> {
    const cur = await this.redisRepo.get(gameid, 'r');
    return parseInt(cur);
  }

  async setQuestionRandomFactor(gameid: string, factor: number): Promise<void> {
    await this.redisRepo.set(gameid, 'r', factor.toString());
  }

  async getQuestionCount(gameid: string): Promise<number> {
    const cur = await this.redisRepo.get(gameid, 'c');
    return parseInt(cur);
  }

  async setQuestionCount(gameid: string, count: number): Promise<void> {
    await this.redisRepo.set(gameid, 'c', count.toString());
  }

  async getQuestionIndex(gameid: string): Promise<number> {
    const it = await this.getQuestionIteration(gameid);
    const factor = await this.getQuestionRandomFactor(gameid);
    const count = await this.getQuestionCount(gameid);
    console.log('The index generated is ', (it * factor) % count);
    return (it * factor) % count;
  }

  async ifGameEnds(gameid: string): Promise<boolean> {
    const it = await this.getQuestionIteration(gameid);
    const count = await this.getQuestionCount(gameid);
    return it >= count;
  }
}
