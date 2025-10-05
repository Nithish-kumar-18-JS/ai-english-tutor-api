import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { FirebaseAuthGuard } from 'src/firebase/firebase-auth.guard';

@Controller('quiz')
export class QuizController {
    constructor(private quizService: QuizService) {}

    @Get('GetTodayQuiz')
    @UseGuards(FirebaseAuthGuard)
    async getTodayQuiz (@Req() req) {
        const {uid} = req.user
        const result = await this.quizService.getTodayQuiz(uid)
        return result
    }
}
