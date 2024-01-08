import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Party } from 'src/entity/party';
import { Question } from 'src/entity/question';
import { Option } from 'src/entity/option';
import { Repository } from 'typeorm';
import { randomBytes } from 'crypto';
import { AmqpConnection, RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { GamesettingsService } from 'src/gamesettings/gamesettings.service';

@Injectable()
export class GamedataService {
  constructor(
    @InjectRepository(Party) private partyRepository: Repository<Party>,
    @InjectRepository(Question)
    private questionRepository: Repository<Question>,
    @InjectRepository(Option) private answerRepository: Repository<Option>,
    private readonly amqpConnection: AmqpConnection,
    private readonly gameSettingsService: GamesettingsService,
  ) {}

  @RabbitSubscribe({
    exchange: 'game',
    routingKey: 'game.create',
    queueOptions: {
      durable: true,
      autoDelete: true,
    },
  })
  public async getGameData(data: Record<string, any>) {
    console.log(data);
    const party = new Party();
    party.id = randomBytes(16).toString('hex');
    party.game_code = this.createGameCode();
    party.title = data['title'];
    party.invalid_at = new Date().setDate(new Date().getDate() + 1).toString();
    const questions = [];
    for (let i = 0; i < data['questions'].length; i++) {
      const question = new Question();
      question.question_id = i + 1;
      question.party_id = party.id;
      question.content = data['questions'][i]['content'];
      question.correct_answer = data['questions'][i]['correct_answer'];
      question.url = data['questions'][i]['url'];
      question.party = party;
      question.allow_power = data['questions'][i]['allow_power'];
      question.time = data['questions'][i]['time_limit'];
      question.options = [];
      for (let j = 0; j < data['questions'][i]['options'].length; j++) {
        const option = new Option();
        option.question_id = i + 1;
        option.party_id = party.id;
        option.option_id = j + 1;
        option.content = data['questions'][i]['options'][j]['content'];
        option.question = question;
        question.options.push(option);
      }
      questions.push(question);
    }
    party.questions = questions;
    const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 43, 47, 53];
    await this.gameSettingsService.setQuestionRandomFactor(
      party.game_code,
      primes[Math.floor(Math.random() * primes.length)],
    );
    await this.gameSettingsService.setQuestionCount(
      party.game_code,
      questions.length,
    );
    await this.gameSettingsService.setQuestionIteration(party.game_code, 0);
    await this.partyRepository.save(party);
    await this.amqpConnection.publish('game-created', 'subscribe-route', {
      partyid: party.id,
      gamecode: party.game_code,
    });
  }

  public createGameCode(): string {
    let gameCode = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    for (let i = 0; i < 6; i++) {
      gameCode += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return gameCode;
  }

  public findPartyByGameCode(gamecode: string): Promise<Party> {
    return this.partyRepository.findOne({ where: { game_code: gamecode } });
  }

  async isGameCodeExists(gamecode: string): Promise<boolean> {
    console.log(
      await this.partyRepository.findOne({ where: { game_code: gamecode } }),
    );
    return (
      (await this.partyRepository.findOne({
        where: { game_code: gamecode },
      })) != undefined
    );
  }

  async getParty(party_id: string): Promise<Party> {
    return await this.partyRepository.findOne({ where: { id: party_id } });
  }

  async getQuestions(party_id: string): Promise<Question[]> {
    return await this.questionRepository.find({
      where: { party_id: party_id },
    });
  }

  async getQuestion(party_id: string, question_id: number): Promise<Question> {
    return await this.questionRepository.findOne({
      where: {
        party_id: party_id,
        question_id: question_id,
      },
    });
  }

  async getAnswers(party_id: string, question_id: number): Promise<Option[]> {
    return await this.answerRepository.find({
      where: {
        party_id: party_id,
        question_id: question_id,
      },
    });
  }

  async getQuestionAndAnswers(
    party_id: string,
    question_id: number,
  ): Promise<any> {
    const question = await this.getQuestion(party_id, question_id + 1);
    const answers = await this.getAnswers(party_id, question_id + 1);
    return {
      content: question.content,
      time: question.time,
      allow_power: question.allow_power,
      url: question.url,
      answers: answers,
      correct_answer:
        question.correct_answer == 'A'
          ? 1
          : question.correct_answer == 'B'
            ? 2
            : question.correct_answer == 'C'
              ? 3
              : 4,
    };
  }
}
