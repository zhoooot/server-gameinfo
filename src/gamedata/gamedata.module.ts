import { Module } from '@nestjs/common';
import { GamedataService } from './gamedata.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Party } from 'src/entity/party';
import { Question } from 'src/entity/question';
import { Option } from 'src/entity/option';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { RabbitmqModule } from 'src/rabbitmq/rabbitmq.module';
import { GamedataController } from './gamedata.controller';
import { GamesettingsModule } from 'src/gamesettings/gamesettings.module';

@Module({
  imports: [TypeOrmModule.forFeature([Party, Question, Option]), RabbitmqModule, GamesettingsModule],
  providers: [GamedataService],
  exports: [GamedataService],
  controllers: [GamedataController],
})
export class GamedataModule {}
