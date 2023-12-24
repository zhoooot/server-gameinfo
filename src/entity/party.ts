import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { Question } from "./question";

@Entity()
export class Party {
    @PrimaryColumn({ unique: true}})
    id: string;

    @Column()
    game_code: string;

    @Column()
    invalid_at: string;

    @Column()
    title: string;

    @OneToMany(() => Question, question => question.party_id)
    questions: Question[];

    Party(game_code: string, invalid_at: string, title: string) {
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