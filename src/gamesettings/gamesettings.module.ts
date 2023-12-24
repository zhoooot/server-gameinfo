import { Module } from '@nestjs/common';
import { GamesettingsService } from './gamesettings.service';
import { RedisModule } from 'src/redis/redis.module';

@Module({
  imports: [RedisModule],
  providers: [GamesettingsService]
})
export class GamesettingsModule {}
