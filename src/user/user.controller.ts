import { Controller, Get, Post, Req, Body, UseGuards } from '@nestjs/common';
import { UsersService } from './user.service';
import { FirebaseAuthGuard } from '../firebase/firebase-auth.guard';

@Controller('user')
export class UserController {
  constructor(private userService: UsersService) {}
  @Get('profile')
  @UseGuards(FirebaseAuthGuard)
  async getProfile(@Req() req) {
    const { uid } = req.user;
    const result = await this.userService.getProfile(uid as string);
    return result;
  }
  
  @Post('onboarding')
  @UseGuards(FirebaseAuthGuard)
  async onboarding(@Req() req , @Body() body) {
    const { uid } = req.user;
    const result = await this.userService.onboarding(uid as string , body);
    return result;
  }

  @Get('/checkOnboarding')
  @UseGuards(FirebaseAuthGuard)
  async checkOnboarding(@Req() req) {
    const { uid } = req.user;
    const result = await this.userService.checkOnboarding(uid);
    return result;
  }
}


