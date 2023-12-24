import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn } from "typeorm";
import { Option } from "./option";
import { Party } from "./party";

@Entity()
export class Question {
    @PrimaryColumn()
    public question_id: number;

    @PrimaryColumn()
    public party_id: string;

    @Column()
    public question: string;

    @Column()
    public correct_answer: string;

    @Column()
    public url: string;

    @OneToMany(() => Option, option => (option.question_id, option.party_id))
    public options: Option[];

    @ManyToOne(() => Party, party => party.questions)
    public party: Party;

    Question(question_id: number, party_id: string, question: string, correct_answer: string, url: string) {
        this.question_id = question_id;
        this.party_id = party_id;
        this.question = question;
        this.correct_answer = correct_answer;
        this.url = url;
    }

    public getId(): number {
        return this.question_id;
    }

    public getPartyId(): string {
        return this.party_id;
    }

    public getQuestion(): string {
        return this.question;
    }

    public getCorrectAnswer(): string {
        return this.correct_answer;
    }

    public getUrl(): string {
        return this.url;
    }
}