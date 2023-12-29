import { Inject, Injectable, ValidationPipe } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Party } from 'src/entity/party';
import { Question } from 'src/entity/question';
import { Option } from 'src/entity/option';
import { Repository } from 'typeorm';
import { randomBytes } from 'crypto';
import { AmqpConnection, RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';

@Injectable()
export class GamedataService {
  constructor(
    @InjectRepository(Party) private partyRepository: Repository<Party>,
    @InjectRepository(Question)
    private questionRepository: Repository<Question>,
    @InjectRepository(Option) private answerRepository: Repository<Option>,
  ) {}

  @RabbitSubscribe({
    exchange: 'exchange2',
    routingKey: 'subscribe-route',
    queueOptions: {
      durable: true,
      autoDelete: true,
    }
  })
  public async getGameData(data: {}) {
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
        question.content = data['questions'][i]['content']
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
    await this.partyRepository.save(party);
  }

  public createGameCode(): string {
    let gameCode = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    for (let i = 0; i < 6; i++) {
        gameCode += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return gameCode;
  }

  async isGameCodeExists(gamecode: string): Promise<boolean> {
    return await this.partyRepository.findOne({where: {game_code: gamecode}}) != undefined;
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

  // async saveParty(
  //   party_id: string,
  //   game_code: string,
  //   title: string,
  //   questions: Question[],
  // ): Promise<Party> {
  //   const party = new Party();
  //   party.id = party_id;
  //   party.game_code = game_code;
  //   party.title = title;
  //   const tommorow = new Date().setDate(new Date().getDate() + 1);
  //   party.invalid_at = tommorow.toString();
  //   party.questions = questions;
  //   for (let i = 0; i < questions.length; i++) {
  //       const question = new Question();
  //       question.question_id = i;
  //       question.party_id = party.id;
  //       question.content = questions[i].content;
  //       question.correct_answer = questions[i].correct_answer;
  //       question.url = questions[i].url;
  //       question.party = party;
  //       question.options = questions[i].options;
  //       await this.questionRepository.save(question);
  //       for (let j = 0; j < questions[i].options.length; j++) {
  //           const option = new Option();
  //           option.question_id = i
  //           option.party_id = party.id;
  //           option.option_id = j;
  //           option.content = questions[i].options[j].content;
  //           option.question = questions[i];
  //           await this.answerRepository.save(option);
  //       }
  //   }
  //   return await this.partyRepository.save(party);
  // }

  async saveParty(party: Party): Promise<Party> {
    return await this.partyRepository.save(party);
  }
}
