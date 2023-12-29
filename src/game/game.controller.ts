import { Controller, Get, Inject, Param } from '@nestjs/common';
import { GameService } from './game.service';

@Controller('/api/game')
export class GameController {
    constructor(@Inject(GameService) private readonly gameService) {}

    @Get()
    async getGameCode() {
        const gamecode = this.gameService.createGameCode();
        await this.gameService.saveGameData(gamecode);
        return gamecode
    }

    @Get('/:gamecode')
    async ifGameCodeExists(@Param('gamecode') gamecode: string) {
        return await this.gameService.ifGameCodeExists(gamecode);
    }
}
