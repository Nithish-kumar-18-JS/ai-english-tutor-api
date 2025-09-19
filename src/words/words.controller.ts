import { Body, Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { WordsService } from './words.service';
import { FirebaseAuthGuard } from 'src/firebase/firebase-auth.guard';

@Controller('words')
export class WordsController {
     constructor(private wordSerivce: WordsService) {}

     @Get('getwords')
     @UseGuards(FirebaseAuthGuard)
     async getRandomVocabuloryWords (@Req() req,@Query() query) {
        const { uid } = req.user;
        const fetchQuery = query.query
        const result = await this.wordSerivce.getRandomVocabuloryWords(uid,fetchQuery)
        return result
     }

     @Post('save_word')
     @UseGuards(FirebaseAuthGuard)
     async saveUserWords (@Req() req , @Body() body){
      const { uid } = req.user;
      let requestBody = body;
      const result = await this.wordSerivce.saveUserWords(uid,requestBody)
      return result
     }
}
