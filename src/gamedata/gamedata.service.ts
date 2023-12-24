import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Party } from 'src/entity/party';
import { Question } from 'src/entity/question';
import { Option } from 'src/entity/option';
import { Repository } from 'typeorm';
import { randomBytes } from 'crypto';

@Injectable()
export class GamedataService {
  constructor(
    @InjectRepository(Party) private partyRepository: Repository<Party>,
    @InjectRepository(Question)
    private questionRepository: Repository<Question>,
    @InjectRepository(Option) private answerRepository: Repository<Option>,
  ) {}

  async getParty(party_id: string): Promise<Party> {
    return await this.partyRepository.findOne({ where: { id: party_id } });
  }

  async getQuestions(party_id: string): Promise<Question[]> {
    return await this.questionRepository.find({
      where: { party_id: party_id },
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

  async saveParty(
    game_code: string,
    title: string,
    questions: Question[],
  ): Promise<Party> {
    const party = new Party();
    party.id = randomBytes(16).toString('hex')
    party.game_code = game_code;
    party.title = title;
    const tommorow = new Date().setDate(new Date().getDate() + 1);
    party.invalid_at = tommorow.toString();
    party.questions = questions;
    for (let i = 0; i < questions.length; i++) {
        const question = new Question();
        question.question_id = i;
        question.party_id = party.id;
        question.content = questions[i].content;
        question.correct_answer = questions[i].correct_answer;
        question.url = questions[i].url;
        question.party = party;
        question.options = questions[i].options;
        await this.questionRepository.save(question);
        for (let j = 0; j < questions[i].options.length; j++) {
            const option = new Option();
            option.question_id = i
            option.party_id = party.id;
            option.option_id = j;
            option.content = questions[i].options[j].content;
            option.question = questions[i];
            await this.answerRepository.save(option);
        }
    }
    return await this.partyRepository.save(party);
  }
}
