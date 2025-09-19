import { Module } from '@nestjs/common';
import { WordsController } from './words.controller';
import { WordsService } from './words.service';
import { PrismaService } from 'src/prisma.service';
import { FirebaseAdminService } from 'src/firebase/firebase-admin.service';
import { UsersService } from 'src/user/user.service';

@Module({
  controllers: [WordsController,],
  providers: [WordsService,PrismaService,FirebaseAdminService,UsersService]
})
export class WordsModule {}
