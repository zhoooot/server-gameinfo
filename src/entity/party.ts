import { Column, Entity, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Question } from "./question";

@Entity()
export class Party {
    @PrimaryColumn()
    public id: string;

    @Column()
    public game_code: string;

    @Column()
    public invalid_at: string;

    @Column()
    public title: string;

    @OneToMany(() => Question, question => question.party_id)
    public questions: Question[];

    public Party(party_id: string, game_code: string, invalid_at: string, title: string) {
        this.id = party_id;
        this.game_code = game_code;
        this.invalid_at = invalid_at;
        this.title = title;
    }

    public getId(): string {
        return this.id;
    }

    public getGameCode(): string {
        return this.game_code;
    }

    public getInvalidAt(): string {
        return this.invalid_at;
    }

    public getTitle(): string {
        return this.title;
    }

    public getQuestions(): Question[] {
        return this.questions;
    }

}