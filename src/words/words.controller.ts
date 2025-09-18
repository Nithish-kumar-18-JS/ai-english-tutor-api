import { Controller, Get } from '@nestjs/common';
import { WordsService } from './words.service';

@Controller('words')
export class WordsController {
     constructor(private wordSerivce: WordsService) {}

     @Get('getwords')
     async getRandomVocabuloryWords () {
        const result = await this.wordSerivce.getRandomVocabuloryWords()
        return result
     }
}
