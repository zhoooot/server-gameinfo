import { Inject, Logger } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { ClientService } from 'src/client/client.service';
import { GameService } from './game.service';
import * as message from 'src/dto/dto.export'

@WebSocketGateway()
export class GameGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

  constructor(
    @Inject(ClientService) private readonly clientService: ClientService,
    @Inject(GameService) private readonly gameService: GameService,
  ) {}

  private Logger = new Logger('GameGateway');
    
  handleDisconnect(client: Socket) {
    Logger.log(`Client disconnected: ${client.id}`);
    this.clientService.deleteClient(client.id);
  }

  handleConnection(client: Socket, ...args: any[]) {
    Logger.log(`Client connected: ${client.id}`);
    this.clientService.saveClient(client.id, client);
  }

  afterInit(server: Socket) {
    Logger.log('Initialized!');
  }

  @SubscribeMessage('message')
  handleMessage(client: Socket, payload: any): string {
    if (payload === 'ping') {
      return 'pong';
    }
    if (payload.type === 'join') {
      const { type, room, username } = payload;
      this.gameService.onJoinGame(client.id, room, username);
    }
    else if (payload.type === 'start') {
      const { type, room } = payload;
      this.gameService.onGameStart(client.id, room);
    }
    else if (payload.type === 'question-end') {
      const { type, room } = payload;
      this.gameService.onResult(client.id, room);
    }
    else if (payload.type === 'question-skip') {
      const { type, room } = payload;
      this.gameService.onGameSkip(client.id, room);
    }
    else if (payload.type === 'ranking') {
      const { type, room } = payload;
      this.gameService.onRanking(client.id, room);
    }
    else if (payload.type === 'show-question') {
      const { type, room } = payload;
      this.gameService.onShowQuestion(client.id, room);
    }
    else if (payload.type === 'final-ranking') {
      const { type, room } = payload;
      this.gameService.onFinalRanking(client.id, room);
    }
    else if (payload.type === 'leave') {
      const { type, room } = payload;
      this.gameService.onLeaveGame(client.id, room);
    }
    else {
      Logger.log(`Client ${client.id} sent an unknown message: ${payload}`);
    }
  }
}
