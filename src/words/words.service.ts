import { Injectable } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import axios from 'axios'
import { UsersService } from 'src/user/user.service';
import { startOfDay, endOfDay } from 'date-fns'
@Injectable()
export class WordsService {
    constructor(private prisma: PrismaService, private userService: UsersService) { }

    async getRandomVocabuloryWords(uid: string, query?: string) {
    try {
        const levels = ['Beginner', 'Intermediate', 'Advanced'];
        const formattedData: any = {};

        const user = await this.userService.findByFirebaseUid(uid);
        const userId = user?.id;
        if (!userId) throw new Error('User not found');

        // Fetch today's session words
        const todaySessionWords = await this.prisma.todaySessionVocabWords.findMany({
            where: {
                userId,
                createdAt: {
                    gte: startOfDay(new Date()),
                    lte: endOfDay(new Date()),
                },
            },
            include: { word: true },
        });

        // Return today's session if exists
        if (todaySessionWords.length > 0) {
            for (const level of levels) {
                formattedData[level] = todaySessionWords
                    .filter(item => item.word.level === level)
                    .map(item => item.word);
            }
            return formattedData;
        }

        // Generate new words
        const savedWords = await this.prisma.userWords.findMany({
            where: { userId },
            select: { wordId: true },
        });
        const savedWordIds = savedWords.map(w => w.wordId);

        for (const level of levels) {
            let data: any;

            if (savedWordIds.length > 0) {
                data = await this.prisma.$queryRaw`
                  SELECT * FROM "VocabularyWords"
                  WHERE level = ${level}
                  AND id NOT IN (${Prisma.join(savedWordIds)})
                  ORDER BY RANDOM()
                  LIMIT 2;
                `;
            } else {
                data = await this.prisma.$queryRaw`
                  SELECT * FROM "VocabularyWords"
                  WHERE level = ${level}
                  ORDER BY RANDOM()
                  LIMIT 2;
                `;
            }

            formattedData[level] = data;

            // Save to today's session
            const createData = data.map(item => ({
                userId: user.id,
                wordId: item.id,
                createdAt: new Date(),
                updatedAt: new Date(),
            }));

            await this.prisma.todaySessionVocabWords.createMany({
                data: createData,
                skipDuplicates: true,
            });
        }

        return formattedData;
    } catch (error) {
        console.log(
            "Service : WordsService / Method : getRandomVocabuloryWords / Error : ",
            error
        );
        throw error;
    }
}




    async saveUserWords(uid: any, body: any) {
        try {
            const user = await this.userService.findByFirebaseUid(uid);
            const { id, status } = body
            let data: any = {
                user: {
                    connect: {
                        id: user?.id
                    }
                },
                word: {
                    connect: {
                        id: id
                    }
                },
                status: status,
            }

            let checkWord = await this.prisma.userWords.findFirst({
                where: {
                    wordId: id,
                    userId: user?.id
                }
            })
            if (!checkWord) {
                return this.prisma.userWords.create({ data })
            }
            else {
                // Since status is now a single value, just update it directly
                return this.prisma.userWords.update({
                    where: { id: checkWord.id },
                    data: {
                        status: status,
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
