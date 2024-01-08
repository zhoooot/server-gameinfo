import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Inject, Injectable } from '@nestjs/common';
import { ClientService } from 'src/client/client.service';
import { GamedataService } from 'src/gamedata/gamedata.service';
import { GamesettingsService } from 'src/gamesettings/gamesettings.service';

@Injectable()
export class GameService {
  constructor(
    @Inject(ClientService) private readonly clientService: ClientService,
    @Inject(GamedataService) private readonly gamedataService: GamedataService,
    @Inject(GamesettingsService)
    private readonly gamesettingsService: GamesettingsService,
    private readonly amqpConnection: AmqpConnection,
  ) {}

  async createGameCode() {
    const gamecode = this.gamedataService.createGameCode();
    const randomPrimes = [
      2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 43, 47, 53, 59, 61, 67, 71,
      73, 79, 83, 89, 97,
    ];
    await this.gamesettingsService.setQuestionRandomFactor(
      gamecode,
      randomPrimes[Math.floor(Math.random() * randomPrimes.length)],
    );
    return;
  }

  ifGameCodeExists(gameCode: string) {
    return this.gamedataService.isGameCodeExists(gameCode);
  }

  async getIdByGameCode(gameCode: string): Promise<string> {
    const p = await this.gamedataService.findPartyByGameCode(gameCode);
    return p.id;
  }

  async onHostGame(
    clientId: string,
    partyid: string,
    gamecode: string,
    username: string,
  ) {
    this.clientService.gotoRoom(clientId, partyid);
    this.clientService.setClientUsername(clientId, username);
    this.clientService.broadcastToRoom(partyid, 'host', {
      username: username,
    });
    this.clientService.sendMessage(clientId, 'host', {
      question: await this.gamedataService.getQuestionAndAnswers(
        partyid,
        await this.gamesettingsService.getQuestionIndex(gamecode),
      ),
    });
  }

  onJoinGame(clientId: string, partyid: string, username: string) {
    // if (this.gamesettingsService.isLocked(gameCode)) {
    //     this.clientService.sendMessage(clientId, 'locked', {username});
    //     return;
    // }
    // if (this.gamesettingsService.isBanned(gameCode, username)) {
    //     this.clientService.sendMessage(clientId, 'banned', {username});
    //     return;
    // }
    this.clientService.gotoRoom(clientId, partyid);
    this.clientService.setClientUsername(clientId, username);
    this.clientService.broadcastToRoom(partyid, 'join', { username });
    //this.amqpConnection.publish('player-join', 'subscribe-route', {username: username, gamecode: gameCode})
  }

  onLeaveGame(clientId: string, partyid: string) {
    this.clientService.leaveRoom(clientId, partyid);
  }

  onGameStart(clientId: string, partyid: string) {
    this.clientService.broadcastToRoom(partyid, 'start', {
      type: 'start',
    });
  }

  onGameEnd(clientId: string, partyid: string) {
    this.clientService.broadcastToRoom(partyid, 'end', {
      type: 'end',
      partyid: partyid,
    });
  }

  async onGameSkip(clientId: string, gameCode: string) {
    await this.gamesettingsService.increQuestionIteration(gameCode);
    this.clientService.broadcastToRoom(gameCode, 'skipped', {
      type: 'skip',
      gamecode: gameCode,
    });
  }

  onRanking(clientId: string, partyid: string) {
    this.clientService.broadcastToRoom(partyid, 'ranking', {
      type: 'ranking',
      partyid: partyid,
    });
  }

  async onShowQuestion(clientId: string, partyid: string, game_code: string) {
    this.clientService.broadcastToRoom(partyid, 'show-question', {
      partyid: partyid,
      question: await this.gamedataService.getQuestionAndAnswers(
        partyid,
        await this.gamesettingsService.getQuestionIndex(game_code),
      ),
    });
  }

  onResult(clientId: string, partyid: string) {
    this.clientService.broadcastToRoom(partyid, 'result', {
      type: 'result',
      gamecode: partyid,
    });
  }

  onFinalRanking(clientId: string, partyid: string) {
    this.clientService.broadcastToRoom(partyid, 'final-ranking', {
      type: 'finalRanking',
      gamecode: partyid,
    });
  }
}
