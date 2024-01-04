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
  async handleHostGame(client: Socket, payload: any): Promise<void> {
    console.log("A host is trying to host a game")
    const {room, username} = payload;
    const pid = await this.gameService.getIdByGameCode(room);
    this.gameService.onHostGame(client.id, pid, room, username);
  }

  @SubscribeMessage('join')
  async handleJoinGame(client: Socket, payload: any): Promise<void> {
    const {room, username} = payload;
    const pid = await this.gameService.getIdByGameCode(room);
    this.gameService.onJoinGame(client.id, pid, username);
  }

  @SubscribeMessage('start')
  async handleStartGame(client: Socket, payload: any): Promise<void> {
    const {room} = payload;
    const pid = await this.gameService.getIdByGameCode(room);
    this.gameService.onGameStart(client.id, pid);
  }

  @SubscribeMessage('question-end')
  async handleQuestionEnd(client: Socket, payload: any): Promise<void> {
    const {room} = payload;
    const pid = await this.gameService.getIdByGameCode(room);
    this.gameService.onResult(client.id, pid);
  }

  @SubscribeMessage('question-skip')
  async handleQuestionSkip(client: Socket, payload: any): Promise<void> {
    const {room} = payload;
    const pid = await this.gameService.getIdByGameCode(room);
    await this.gameService.onGameSkip(client.id, pid);
  }

  @SubscribeMessage('ranking')
  async handleRanking(client: Socket, payload: any): Promise<void> {
    const {room} = payload;
    const pid = await this.gameService.getIdByGameCode(room);
    this.gameService.onRanking(client.id, pid);
  }

  @SubscribeMessage('show-question')
  async handleShowQuestion(client: Socket, payload: any): Promise<void> {
    const {room} = payload;
    const pid = await this.gameService.getIdByGameCode(room);
    this.gameService.onShowQuestion(client.id, pid, room);
  }

  @SubscribeMessage('final-ranking')
  async handleFinalRanking(client: Socket, payload: any): Promise<void> {
    const {room} = payload;
    const pid = await this.gameService.getIdByGameCode(room);
    this.gameService.onFinalRanking(client.id, pid);
  }

  @SubscribeMessage('leave')
  async handleLeaveGame(client: Socket, payload: any): Promise<void> {
    const {room} = payload;
    const pid = await this.gameService.getIdByGameCode(room);
    this.gameService.onLeaveGame(client.id, pid);
  }
}
