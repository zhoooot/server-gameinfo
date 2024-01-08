import { Controller, Get, Inject, Param } from '@nestjs/common';
import { GameService } from './game.service';

@Controller('/api/game')
export class GameController {
  constructor(@Inject(GameService) private readonly gameService) {}

  @Get()
  async getGameCode() {
    const gamecode = this.gameService.createGameCode();
    await this.gameService.saveGameData(gamecode);
    return gamecode;
  }

  @Get('/check/:gamecode')
  async ifGameCodeExists(@Param('gamecode') gamecode: string) {
    console.log('A game code is being checked');
    return await this.gameService.ifGameCodeExists(gamecode);
  }
}
