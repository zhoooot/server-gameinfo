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
    this.clientService.leaveRoom(client.id, this.clientService.getRoom(client.id));
    Logger.log(`You are in room: ${this.clientService.getRoom(client.id)}`);
  }

  afterInit(server: Socket) {
    Logger.log('Initialized!');
  }

  @SubscribeMessage('host')
  handleHostGame(client: Socket, payload: any): void {
    const {room, username} = payload;
    this.gameService.onJoinGame(client.id, room, username);
  }

  @SubscribeMessage('join')
  handleJoinGame(client: Socket, payload: any): void {
    const {room, username} = payload;
    this.gameService.onJoinGame(client.id, room, username);
  }

  @SubscribeMessage('start')
  handleStartGame(client: Socket, payload: any): void {
    const {room} = payload;
    this.gameService.onGameStart(client.id, room);
  }

  @SubscribeMessage('question-end')
  handleQuestionEnd(client: Socket, payload: any): void {
    const {room} = payload;
    this.gameService.onResult(client.id, room);
  }

  @SubscribeMessage('question-skip')
  handleQuestionSkip(client: Socket, payload: any): void {
    const {room} = payload;
    this.gameService.onGameSkip(client.id, room);
  }

  @SubscribeMessage('ranking')
  handleRanking(client: Socket, payload: any): void {
    const {room} = payload;
    this.gameService.onRanking(client.id, room);
  }

  @SubscribeMessage('show-question')
  handleShowQuestion(client: Socket, payload: any): void {
    const {room} = payload;
    this.gameService.onShowQuestion(client.id, room);
  }

  @SubscribeMessage('final-ranking')
  handleFinalRanking(client: Socket, payload: any): void {
    const {room} = payload;
    this.gameService.onFinalRanking(client.id, room);
  }

  @SubscribeMessage('leave')
  handleLeaveGame(client: Socket, payload: any): void {
    const {room} = payload;
    this.gameService.onLeaveGame(client.id, room);
  }


}
