import { Inject, Injectable } from '@nestjs/common';
import { ClientService } from 'src/client/client.service';

@Injectable()
export class GameService {

    constructor(
        @Inject(ClientService) private readonly clientService: ClientService
        
    ) {}

    createGameCode() {
        let gameCode = '';
        const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        for (let i = 0; i < 6; i++) {
            gameCode += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return gameCode;
    }

    async saveGameData() {
        // TODO
        throw new Error('Method not implemented.');
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
        this.clientService.broadcastToRoom(gameCode, 'gameStart', {});
    }

    onGameEnd(clientId: string, gameCode: string) {
        this.clientService.broadcastToRoom(gameCode, 'gameEnd', {});
    }

    onGameSkip(clientId: string, gameCode: string) {
        this.clientService.broadcastToRoom(gameCode, 'gameSkip', {});
    }

    onRanking(clientId: string, gameCode: string) {
        this.clientService.broadcastToRoom(gameCode, 'ranking', {});
    }

    onShowQuestion(clientId: string, gameCode: string) {
        this.clientService.broadcastToRoom(gameCode, 'showQuestion', {});
    }

    onResult(clientId: string, gameCode: string) {
        this.clientService.broadcastToRoom(gameCode, 'result', {});
    }

    onFinalRanking(clientId: string, gameCode: string) {
        this.clientService.broadcastToRoom(gameCode, 'finalRanking', {});
    }
}
