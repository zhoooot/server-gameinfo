import { Controller, Get, Inject } from '@nestjs/common';
import { GameService } from './game.service';

@Controller('game')
export class GameController {
    constructor(@Inject(GameService) private readonly gameService) {}

    @Get()
    async getGameCode() {
        const gamecode = this.gameService.createGameCode();
        await this.gameService.saveGameData(gamecode);
        return gamecode
    }
}
