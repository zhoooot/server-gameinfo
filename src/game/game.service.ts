import { Inject, Injectable } from '@nestjs/common';
import { ClientService } from 'src/client/client.service';
import { GamedataService } from 'src/gamedata/gamedata.service';
import { GamesettingsService } from 'src/gamesettings/gamesettings.service';

@Injectable()
export class GameService {

    constructor(
        @Inject(ClientService) private readonly clientService: ClientService,
        @Inject(GamedataService) private readonly gamedataService: GamedataService,
        @Inject(GamesettingsService) private readonly gamesettingsService: GamesettingsService,
    ) {}

    createGameCode() {
        let gameCode = '';
        const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        for (let i = 0; i < 6; i++) {
            gameCode += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return gameCode;
    }

    async saveGameData(gamecode: string, gamedata: any) {
        const party = await this.gamedataService.saveParty(gamecode, gamedata.title, gamedata.questions);
        return party;
    }

    onJoinGame(clientId: string, gameCode: string, username: string) {
        this.clientService.gotoRoom(clientId, gameCode);
        this.clientService.setClientUsername(clientId, username);
        this.clientService.broadcastToRoom(gameCode, 'joinGame', {username});
    }

    onLeaveGame(clientId: string, gameCode: string) {
        this.clientService.leaveRoom(clientId, gameCode);
    }

    onGameStart(clientId: string, gameCode: string) {
        this.clientService.broadcastToRoom(gameCode, 'start', {
            // type: 'start',
            // gamecode: gameCode,
            // questions: this.gamedataService.getQuestions(gameCode),
        });
    }

    onGameEnd(clientId: string, gameCode: string) {
        this.clientService.broadcastToRoom(gameCode, 'Game over!', {
            type: 'end',
            gamecode: gameCode,
        });
    }

    onGameSkip(clientId: string, gameCode: string) {
        this.clientService.broadcastToRoom(gameCode, 'This question is skipped!', {
            type: 'skip',
            gamecode: gameCode,
        });
    }

    onRanking(clientId: string, gameCode: string) {
        this.clientService.broadcastToRoom(gameCode, 'ranking', {
            type: 'ranking',
            gamecode: gameCode,
        });
    }

    async onShowQuestion(clientId: string, gameCode: string) {
        this.clientService.broadcastToRoom(gameCode, 'showQuestion', {
            type: 'showQuestion',
            gamecode: gameCode,
            question: this.gamedataService.getQuestion(gameCode, await this.gamesettingsService.getQuestionIndex(gameCode)),
        });
    }

    onResult(clientId: string, gameCode: string) {
        this.clientService.broadcastToRoom(gameCode, 'result', {
            type: 'result',
            gamecode: gameCode,
        });
    }

    onFinalRanking(clientId: string, gameCode: string) {
        this.clientService.broadcastToRoom(gameCode, 'finalRanking', {
            type: 'finalRanking',
            gamecode: gameCode,
        });
    }
}
