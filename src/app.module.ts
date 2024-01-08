import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RedisModule } from './redis/redis.module';
import { GamedataModule } from './gamedata/gamedata.module';
import { RabbitmqModule } from './rabbitmq/rabbitmq.module';
import { ClientModule } from './client/client.module';
import { GameModule } from './game/game.module';
import { GamesettingsModule } from './gamesettings/gamesettings.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Party } from './entity/party';
import { Question } from './entity/question';
import { Option } from './entity/option';
import dataSourceConfig from './typeorm.config';

@Module({
  imports: [
    RedisModule,
    GamedataModule,
    RabbitmqModule,
    ClientModule,
    GameModule,
    GamesettingsModule,
    TypeOrmModule.forRoot({
      ...dataSourceConfig,
      entities: [Party, Question, Option],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
