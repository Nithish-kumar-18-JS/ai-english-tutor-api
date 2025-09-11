import { Controller, Get, Req } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Get('verify')
  async verify(@Req() req) {
    const { idToken } = req.query;
    const decodedToken = await this.authService.verifyIdToken(idToken as string);
    return decodedToken;
  } 
}
