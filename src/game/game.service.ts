import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
<<<<<<< HEAD
import { Inject, Injectable } from '@nestjs/common';
=======
import { Inject, Injectable, Logger, ValidationPipe } from '@nestjs/common';
>>>>>>> e436c00 (Safe place)
import { ClientService } from 'src/client/client.service';
import { GamedataService } from 'src/gamedata/gamedata.service';
import { GamesettingsService } from 'src/gamesettings/gamesettings.service';
import axios from 'axios';
import { ClientList } from 'src/client/client.list';

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
<<<<<<< HEAD
    const gamecode = this.gamedataService.createGameCode();
=======
    let gamecode = this.gamedataService.createGameCode();
>>>>>>> e436c00 (Safe place)
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
<<<<<<< HEAD

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
=======

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
    this.clientService.gotoRoom(clientId, partyid);
    this.clientService.setClientUsername(clientId, username);
    this.clientService.broadcastToRoom(partyid, 'join', { username });
  }

  onLeaveGame(clientId: string, partyid: string) {
    this.clientService.leaveRoom(clientId, partyid);
  }

  async onGetReady(
    clientId: string,
    partyid: string,
    gamecode: string,
  ): Promise<void> {
    this.clientService.broadcastToRoom(partyid, 'ready', {
      partyid: partyid,
      question: await this.gamedataService.getQuestionAndAnswers(
        partyid,
        await this.gamesettingsService.getQuestionIndex(gamecode),
      ),
    });
    await this.gamesettingsService.increQuestionIteration(gamecode);
  }

  onGameEnd(clientId: string, partyid: string) {
    this.clientService.broadcastToRoom(partyid, 'end', {
      type: 'end',
      partyid: partyid,
    });
  }

  onGameSkip(clientId: string, partyid: string) {
    this.clientService.broadcastToRoom(partyid, 'skipped', {
      partyid: partyid,
    });
  }

  onRanking(clientId: string, partyid: string) {
    this.clientService.broadcastToRoom(partyid, 'ranking', {
      type: 'ranking',
      partyid: partyid,
    });
  }

  async onQuestionEnd(clientId: string, partyid: string, gamecode: string) {
    const gameEnd = await this.gamesettingsService.ifGameEnds(gamecode);
    if (!gameEnd) {
      this.onRanking(clientId, partyid);
    } else {
      this.onFinalRanking(clientId, partyid);
    }
  }

  async onResult(clientId: string, partyid: string) {
    const scoreboard = await axios.get('http://localhost:3000/game/result', {
      params: {
        gamecode: partyid,
      },
    });
    const clients = this.clientService.getClientListInRoom(partyid);
    const clientList = clients.toArray();
    for (let i = 0; i < scoreboard.data.length; i++) {
      for (let j = 0; j < clientList.length; j++) {
        if (scoreboard.data[i].username === clientList[j].value.username) {
          this.clientService.sendMessage(clientList[j].key, 'result', {
            correct: scoreboard.data[i].correct,
            point: scoreboard.data[i].point,
          });
        }
      }
    }
  }

  onFinalRanking(clientId: string, partyid: string) {
    this.clientService.broadcastToRoom(partyid, 'final-ranking', {
      type: 'finalRanking',
      gamecode: partyid,
    });
  }

  async onRankingReveal(clientId: string, partyid: string, gamecode: string) {
    const final_ranking = await axios.get(
      'http://localhost:3000/game/final-ranking',
      {
        params: {
          gamecode: gamecode,
        },
      },
    );
    const clients = this.clientService.getClientListInRoom(partyid);
    const clientList = clients.toArray();
    for (let i = 0; i < final_ranking.data.length; i++) {
      for (let j = 0; j < clientList.length; j++) {
        if (final_ranking.data[i].username === clientList[j].value.username) {
          this.clientService.sendMessage(clientList[j].key, 'final', {
            type: 'reveal',
            ranking: i + 1,
          });
        }
      }
    }
    this.clientService.broadcastToRoom(partyid, 'final', {
      type: 'reveal',
    });
  }

  onStartAnswer(id: string, pid: string, room: any) {
    this.clientService.broadcastToRoom(pid, 'start', {
      type: 'start',
      partyid: pid,
>>>>>>> e436c00 (Safe place)
    });
  }
}
