import { Module } from '@nestjs/common';
import { GamedataService } from './gamedata.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Party } from 'src/entity/party';
import { Question } from 'src/entity/question';
import { Option } from 'src/entity/option';

@Module({
  imports: [TypeOrmModule.forFeature([Party, Question, Option])],
  providers: [GamedataService]
})
export class GamedataModule {}
