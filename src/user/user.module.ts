import { Module } from '@nestjs/common';
import { FirebaseAdminService } from '../firebase/firebase-admin.service';
import { PrismaService } from '../prisma.service';
import { UsersService } from './user.service';

@Module({
  providers: [FirebaseAdminService , PrismaService, UsersService],
  controllers: [],
})
export class UserModule {}
