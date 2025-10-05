import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { endOfDay, startOfDay } from 'date-fns';
import { PrismaService } from 'src/prisma.service';
import { UsersService } from 'src/user/user.service';

@Injectable()
export class QuizService {
  constructor(
    private userService: UsersService,
    private prisma: PrismaService,
  ) {}

  async getTodayQuiz(uid: string) {
    try {
      const user = await this.userService.findByFirebaseUid(uid);
      const userId = user?.id;
      if (!userId) throw new Error('User not found');

      // 🔎 Check if user already has a quiz for today
      const today = new Date();
      today.setHours(0, 0, 0, 0);

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

      let words = todaySessionWords.length && todaySessionWords.map(item => item.word.word) || []
      
      console.log(words)

      const existingQuiz = await this.prisma.userGeneratedQuiz.findFirst({
        where: {
          userId,
          createdAt: { gte: today },
        },
      });

      if (existingQuiz) {
        return existingQuiz.quiz;
      }

      // 🚀 Generate new quiz with Gemini
      const response = await axios.post(
        'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent',
        {
          contents: [
            {
              parts: [
                {
                  text: `You are an English vocabulary quiz generator. I will give you 6 words. Create 20 spoken-style quiz questions that sound natural, as if asked in a conversation. Each question should test the meaning, usage, or synonym/antonym of the word.

                  Guidelines:
                  - Use natural, spoken-style sentences (e.g., “If I say someone looks serene, what do I mean?” instead of “Define serene”).
                  - Each question must have 4 options, only 1 correct.
                  - Mix question styles: meaning, synonyms, antonyms, usage in a sentence.
                  - Do not give explanations.
                  - Return output strictly in JSON format:

                  {
                    "quiz": [
                      {
                        "word": "WORD",
                        "question": "SPOKEN_QUESTION_TEXT",
                        "options": ["OPTION_1", "OPTION_2", "OPTION_3", "OPTION_4"],
                        "answer": "CORRECT_OPTION"
                      }
                    ]
                  }

                  Here are the 6 words: ${words.join(', ')}`
                },
              ],
            },
          ],
          generationConfig: {
            responseMimeType: 'application/json',
          },
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': "AIzaSyDf4nCYUXHQz_XFS_i8oiDp_B6ECrxBaNU",
          },
        },
      );

      if (response.data?.candidates?.length) {
        const text = response.data.candidates[0].content.parts[0].text.trim();
        const cleanText = text.replace(/```json|```/g, '').trim();
        const formattedQuizJson = JSON.parse(cleanText);

        // 💾 Save in DB
        await this.prisma.userGeneratedQuiz.create({
          data: {
            userId,
            quiz: formattedQuizJson,
          },
        });

        return formattedQuizJson;
      }

      throw new Error('No quiz generated');
    } catch (error) {
      console.error('Quiz generation error:', error.message);
      throw error;
    }
  }
}
