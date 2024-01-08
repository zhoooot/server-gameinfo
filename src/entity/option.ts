import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { Question } from './question';

@Entity()
export class Option {
  @PrimaryColumn()
  public option_id: number;

  @PrimaryColumn()
  public party_id: string;

  @PrimaryColumn()
  public question_id: number;

  @Column()
  public content: string;

  @ManyToOne(() => Question, (question) => question.options)
  public question: Question;

  Option(
    option_id: number,
    party_id: string,
    question_id: number,
    option: string,
  ) {
    this.option_id = option_id;
    this.party_id = party_id;
    this.question_id = question_id;
    this.content = option;
  }

  public getId(): number {
    return this.option_id;
  }

  public getPartyId(): string {
    return this.party_id;
  }

  public getQuestionId(): number {
    return this.question_id;
  }

  public getOption(): string {
    return this.content;
  }
}
