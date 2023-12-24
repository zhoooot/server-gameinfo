import { Inject, Injectable } from '@nestjs/common';
import { RedisRepository } from 'src/redis/redis.repo';

@Injectable()
export class GamesettingsService {
    constructor(@Inject(RedisRepository) private readonly redisRepo: RedisRepository) {}

    async isLocked(gameid: string): Promise<boolean> {
        return await this.redisRepo.get(gameid, 'l') === 'true';
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
        return await this.redisRepo.get(gameid, `b:${username}`) === 'true';
    }

    async setQuestion(gameid: string, question: string): Promise<void> {
        await this.redisRepo.set(gameid, 'q', question);
    }
}
