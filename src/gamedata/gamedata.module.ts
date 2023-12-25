import { Module } from '@nestjs/common';
import { GamedataService } from './gamedata.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Party } from 'src/entity/party';
import { Question } from 'src/entity/question';
import { Option } from 'src/entity/option';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { RabbitmqModule } from 'src/rabbitmq/rabbitmq.module';

@Module({
  imports: [TypeOrmModule.forFeature([Party, Question, Option]), RabbitmqModule],
  providers: [GamedataService],
  exports: [GamedataService],
})
export class GamedataModule {}
