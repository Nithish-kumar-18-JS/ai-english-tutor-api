import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import axios from 'axios'
@Injectable()
export class WordsService {
    constructor(private prisma: PrismaService) { }

    async fetchWordsInfo(data: any) {
        let vocabulary: any = [];
        for(let i=0;i<data.length;i++){
            let wordData = data[i]
            const { word, part_of_speech, level, example_Sentence } = wordData
            const response = await axios.get(
                `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
            );
            let responseData: any = response.data[0];
    
            let phonetics_text = "";
            let phonetics_audio = "";
            let definitions = "";
    
            // Find UK phonetics
            for (let j = 0; j < responseData.phonetics.length; j++) {
                if (
                    responseData.phonetics[j].audio &&
                    responseData.phonetics[j].audio != ""
                ) {
                    phonetics_text = responseData.phonetics[j].text;
                    phonetics_audio = responseData.phonetics[j].audio;
                    break;
                }
            }
    
            // Find matching definition
            for (let j = 0; j < responseData.meanings.length; j++) {
                if (responseData.meanings[j].partOfSpeech === part_of_speech?.toLowerCase()) {
                    definitions = responseData.meanings[j].definitions[0].definition;
                    break;
                }
            }
    
            vocabulary.push({
                word: responseData.word,
                level,
                partsOfSpeech: part_of_speech,
                phonetics_text,
                phonetics_audio,
                definitions,
                example_Sentence,
            });
        }
        return vocabulary
    }

    async getRandomVocabuloryWords() {
    try {
        const levels = ['Beginner', 'Intermediate', 'Advanced'];
        const formattedData: any = {};

        for (const level of levels) {
            const data: any = await this.prisma.$queryRaw`
                SELECT * FROM "VocabuloryWords"
                WHERE level = ${level}
                ORDER BY RANDOM()
                LIMIT 2;
            `;

            formattedData[level] = await this.fetchWordsInfo(data);
        }

        return formattedData;
    } catch (error) {
        console.log(
            "Service : WordsService / Method : getRandomVocabuloryWords / Error : ",
            error,
        );
        throw error;
    }
}

}
