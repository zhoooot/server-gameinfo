import { Controller, Get, Param } from '@nestjs/common';
import { GamedataService } from './gamedata.service';

@Controller('gamedata')
export class GamedataController {

    constructor(private readonly gamedataService: GamedataService) {}

    @Get("/:partyid/:questionid")
    async getGameData(@Param('partyid') party_id: string, @Param('questionid') question_id: number) {
        const question = await this.gamedataService.getQuestion(party_id, question_id);
        const answers = await this.gamedataService.getAnswers(party_id, question_id);
        return {
            question: question.content,
            time: question.time,
            allow_power: question.allow_power,
            url: question.url,
            answers: answers,
        }
    }
}
