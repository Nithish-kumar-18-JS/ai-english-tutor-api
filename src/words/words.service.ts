import { Injectable } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import axios from 'axios'
import { UsersService } from 'src/user/user.service';
@Injectable()
export class WordsService {
    constructor(private prisma: PrismaService, private userService: UsersService) { }

    async fetchWordsInfo(data: any) {
        let vocabulary: any = [];
        for (let i = 0; i < data.length; i++) {
            let wordData = data[i]
            const { word, part_of_speech, level, example_Sentence, id } = wordData
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
                id,
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

    async getRandomVocabuloryWords(uid: string , query?:string) {
        try {
            const levels = ['Beginner', 'Intermediate', 'Advanced'];
            const formattedData: any = {};

            // find user
            const user = await this.userService.findByFirebaseUid(uid);
            const userId = user?.id;

            // fetch saved words
            if(query) {
                let where:any = {
                    userId:user?.id
                }

                if(query === "words_count") {
                    let words_count = await this.prisma.userWords.count({
                        where
                    })
                    return {
                        message : "Words counts fetched Successfully",
                        data : words_count
                    }
                }

                if(query === "saved") {
                    where.status = { has: "SAVED" }; // ✅ array contains
                }

                if(query === "learned"){
                   where.status = { has: "LEARNED" }; // ✅ array contains
                }
                
                let wordsCount = await this.prisma.userWords.count({
                    where
                })

                return {
                    message : `Words counts fetched Successfully for query ${query}`,
                    data : wordsCount
                }

                
            }


            // get saved words for this user
            const savedWords = await this.prisma.userWords.findMany({
                where: { userId },
                select: { wordId: true },
            });

            // flatten ids into an array
            const savedWordIds = savedWords.map(w => w.wordId);

            for (const level of levels) {
                let data: any;

                if (savedWordIds.length > 0) {
                    data = await this.prisma.$queryRaw`
                    SELECT * FROM "VocabuloryWords"
                    WHERE level = ${level}
                    AND id NOT IN (${Prisma.join(savedWordIds)})
                    ORDER BY RANDOM()
                    LIMIT 2;
                `;
                } else {
                    data = await this.prisma.$queryRaw`
                    SELECT * FROM "VocabuloryWords"
                    WHERE level = ${level}
                    ORDER BY RANDOM()
                    LIMIT 2;
                `;
                }

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


    async saveUserWords(uid: any, body: any) {
        try {
            const user = await this.userService.findByFirebaseUid(uid);
            const { wordId, status } = body
            let data: any = {
                user: {
                    connect: {
                        id: user?.id
                    }
                },
                word: {
                    connect: {
                        id: wordId
                    }
                },
                status: Array.isArray(status) ? status : [status], // ensure array,
            }

            let checkWord = await this.prisma.userWords.findFirst({
                where: {
                    wordId: wordId,
                    userId: user?.id
                }
            })
            if (!checkWord) {
                return this.prisma.userWords.create({ data })
            }
            else {
                let updatedStatus = [...checkWord.status];

                if (!updatedStatus.includes(status)) {
                        updatedStatus.push(status);
                    } 
                else {
                    // if empty string → remove last sent status
                    updatedStatus = updatedStatus.filter(s => s !== status);
                }
                return this.prisma.userWords.update({
                    where: { id: checkWord.id },
                    data: {
                        status: updatedStatus,
                        updatedAt: new Date(),
                    },
                })
            }
        } catch (error) {
            console.log(
                "Service : WordsService / Method : saveUserWords / Error : ",
                error,
            );
            throw error;
        }
    }

}
