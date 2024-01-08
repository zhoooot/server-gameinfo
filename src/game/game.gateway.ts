import { Inject, Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { ClientService } from 'src/client/client.service';
import { GameService } from './game.service';
<<<<<<< HEAD
// import * as message from 'src/dto/dto.export';
=======
>>>>>>> e436c00 (Safe place)

@WebSocketGateway()
export class GameGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    @Inject(ClientService) private readonly clientService: ClientService,
    @Inject(GameService) private readonly gameService: GameService,
  ) {}

  private Logger = new Logger('GameGateway');

  handleDisconnect(client: Socket) {
    Logger.log(`Client disconnected: ${client.id}`);
    this.clientService.deleteClient(client.id);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handleConnection(client: Socket, ...args: any[]) {
    Logger.log(`Client connected: ${client.id}`);
    this.clientService.saveClient(client.id, client);
    this.clientService.leaveRoom(
      client.id,
      this.clientService.getRoom(client.id),
    );
    Logger.log(`You are in room: ${this.clientService.getRoom(client.id)}`);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  afterInit(server: Socket) {
    Logger.log('Initialized!');
  }

  @SubscribeMessage('host')
  async handleHostGame(client: Socket, payload: any): Promise<void> {
    console.log('A host is trying to host a game');
    const { room, username } = payload;
    const pid = await this.gameService.getIdByGameCode(room);
    this.gameService.onHostGame(client.id, pid, room, username);
  }

  @SubscribeMessage('join')
  async handleJoinGame(client: Socket, payload: any): Promise<void> {
    const { room, username } = payload;
    const pid = await this.gameService.getIdByGameCode(room);
    this.gameService.onJoinGame(client.id, pid, username);
  }

  @SubscribeMessage('get-ready')
  async handleGetReady(client: Socket, payload: any): Promise<void> {
    const {room} = payload;
    const pid = await this.gameService.getIdByGameCode(room);
    this.gameService.onGetReady(client.id, pid, room);
  }

  @SubscribeMessage('start')
  async handleStartGame(client: Socket, payload: any): Promise<void> {
    const { room } = payload;
    const pid = await this.gameService.getIdByGameCode(room);
    this.gameService.onStartAnswer(client.id, pid, room);
  }

<<<<<<< HEAD
  @SubscribeMessage('question-end')
  async handleQuestionEnd(client: Socket, payload: any): Promise<void> {
    const { room } = payload;
=======
  @SubscribeMessage('result')
  async handleShowResult(client: Socket, payload: any): Promise<void> {
    const {room} = payload;
>>>>>>> e436c00 (Safe place)
    const pid = await this.gameService.getIdByGameCode(room);
    this.gameService.onResult(client.id, pid);
  }

  @SubscribeMessage('skip')
  async handleQuestionSkip(client: Socket, payload: any): Promise<void> {
    const { room } = payload;
    const pid = await this.gameService.getIdByGameCode(room);
    this.gameService.onGameSkip(client.id, pid);
  }

  @SubscribeMessage('ranking')
  async handleRanking(client: Socket, payload: any): Promise<void> {
    const { room } = payload;
    const pid = await this.gameService.getIdByGameCode(room);
    this.gameService.onRanking(client.id, pid);
  }

<<<<<<< HEAD
  @SubscribeMessage('show-question')
  async handleShowQuestion(client: Socket, payload: any): Promise<void> {
    const { room } = payload;
=======
  @SubscribeMessage('question-end')
  async handleQuestionEnd(client: Socket, payload: any): Promise<void> {
    const {room} = payload;
>>>>>>> e436c00 (Safe place)
    const pid = await this.gameService.getIdByGameCode(room);
    this.gameService.onQuestionEnd(client.id, pid, room);
  }

  @SubscribeMessage('final-ranking')
  async handleFinalRanking(client: Socket, payload: any): Promise<void> {
    const { room } = payload;
    const pid = await this.gameService.getIdByGameCode(room);
    this.gameService.onFinalRanking(client.id, pid);
  }

  @SubscribeMessage('reveal')
  async handleRankingReveal(client: Socket, payload: any): Promise<void> {
    const {room} = payload;
    const pid = await this.gameService.getIdByGameCode(room);
    this.gameService.onRankingReveal(client.id, pid, room);
  }

  @SubscribeMessage('leave')
  async handleLeaveGame(client: Socket, payload: any): Promise<void> {
    const { room } = payload;
    const pid = await this.gameService.getIdByGameCode(room);
    this.gameService.onLeaveGame(client.id, pid);
  }
}
