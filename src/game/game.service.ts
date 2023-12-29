import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Inject, Injectable, ValidationPipe } from '@nestjs/common';
import { ClientService } from 'src/client/client.service';
import { GamedataService } from 'src/gamedata/gamedata.service';
import { GamesettingsService } from 'src/gamesettings/gamesettings.service';

@Injectable()
export class GameService {

    constructor(
        @Inject(ClientService) private readonly clientService: ClientService,
        @Inject(GamedataService) private readonly gamedataService: GamedataService,
        @Inject(GamesettingsService) private readonly gamesettingsService: GamesettingsService,
        private readonly amqpConnection: AmqpConnection,
    ) {}

    createGameCode() {
        let gameCode = '';
        const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        for (let i = 0; i < 6; i++) {
            gameCode += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return gameCode;
    }

    async ifGameCodeExists(gamecode: string): Promise<boolean> {
        return await this.gamedataService.isGameCodeExists(gamecode);
    }

    async saveGameData(gamecode: string, gamedata: any) {
        const party = await this.gamedataService.saveParty(gamecode, gamedata.title, gamedata.questions);
        return party;
    }

    onHostGame(clientId: string, gameCode: string, username: string) {
        this.clientService.gotoRoom(clientId, gameCode);
        this.clientService.setClientUsername(clientId, username);
        this.clientService.broadcastToRoom(gameCode, 'host', {username});
    }

    onJoinGame(clientId: string, gameCode: string, username: string) {
        if (this.gamesettingsService.isLocked(gameCode)) {
            this.clientService.sendMessage(clientId, 'locked', {username});
            return;
        }
        if (this.gamesettingsService.isBanned(gameCode, username)) {
            this.clientService.sendMessage(clientId, 'banned', {username});
            return;
        }
        this.clientService.gotoRoom(clientId, gameCode);
        this.clientService.setClientUsername(clientId, username);
        this.clientService.broadcastToRoom(gameCode, 'join', {username});
        this.amqpConnection.publish('player-join', 'subscribe-route', {username: username, gamecode: gameCode})
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
        this.clientService.broadcastToRoom(gameCode, 'end', {
            type: 'end',
            gamecode: gameCode,
        });
    }

    onGameSkip(clientId: string, gameCode: string) {
        this.clientService.broadcastToRoom(gameCode, 'skipped', {
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
        this.clientService.broadcastToRoom(gameCode, 'show-question', {
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
        this.clientService.broadcastToRoom(gameCode, 'final-ranking', {
            type: 'finalRanking',
            gamecode: gameCode,
        });
    }
}
