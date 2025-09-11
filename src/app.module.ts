import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { UsersService } from './user/user.service';
import { AuthController } from './auth/auth.controller';
import { FirebaseAdminService } from './firebase/firebase-admin.service';
import { AuthService } from './auth/auth.service';
import { UserController } from './user/user.controller';

@Module({
  providers: [PrismaService, UsersService, FirebaseAdminService, AuthService],
  controllers: [AuthController, UserController],
})
export class AppModule {}
