import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { UsersService } from './user/user.service';
import { AuthController } from './auth/auth.controller';
import { FirebaseAdminService } from './firebase/firebase-admin.service';
import { AuthService } from './auth/auth.service';
import { UserController } from './user/user.controller';
import { WordsModule } from './words/words.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  providers: [PrismaService, UsersService, FirebaseAdminService, AuthService,AppService],
  controllers: [AuthController, UserController,AppController],
  imports: [WordsModule],
})
export class AppModule {}
