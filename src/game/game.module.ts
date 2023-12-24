import { Module } from '@nestjs/common';
import { GameGateway } from './game.gateway';
import { GameService } from './game.service';
import { ClientModule } from 'src/client/client.module';
import { GameController } from './game.controller';
import { GamedataModule } from 'src/gamedata/gamedata.module';

@Module({
  imports: [ClientModule, GamedataModule],
  providers: [GameGateway, GameService],
  controllers: [GameController]
})
export class GameModule {}
