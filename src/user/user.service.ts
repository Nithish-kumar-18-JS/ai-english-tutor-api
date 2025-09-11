import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findByFirebaseUid(firebaseUid: string) {
    return this.prisma.user.findUnique({ where: { firebaseUid } });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async getProfile(uid: string) {
    try {
      console.log("idToken : ", uid);
      const user = await this.findByFirebaseUid(uid);
      if (!user) {
        throw new BadRequestException('Bad Request : User not found');
      }
      return user;
    } catch (error) {
      console.log("Service : UsersService /n Method : getProfile /n Error : ", error);
      throw error;
    }
  }

  async onboarding(uid: string , body: any){
    try {
      const user = await this.findByFirebaseUid(uid);
      if (!user) {
        throw new BadRequestException('Bad Request : User not found');
      }
      const onboarding = await this.prisma.onBoardingQuestions.create({
        data: {
          user: {
            connect: {
              id: user.id,
            },
          },
          english_proficiency_goal: body.english_proficiency_goal,
          why_are_learning_english: body.why_are_learning_english,
          english_level: body.english_level,
          time_spent_english: body.time_spent_english,
          streak_alerts: body.streak_alerts,
          quick_challenge: body.quick_challenge,
        },
      });
      return onboarding;
    } catch (error) {
      console.log("Service : UsersService /n Method : onboarding /n Error : ", error);
      throw error;
    }
  }

  async checkOnboarding(uid: string){
    try {
      const user = await this.findByFirebaseUid(uid);
      if (!user) {
        throw new BadRequestException('Bad Request : User not found');
      }
      const onboarding = await this.prisma.onBoardingQuestions.findFirst({
        where: {
          userId: user.id,
        },
      });
      if (!onboarding) {
        return false;
      }
      return onboarding;
    } catch (error) {
      console.log("Service : UsersService /n Method : checkOnboarding /n Error : ", error);
      throw error;
    }
  } 

}
