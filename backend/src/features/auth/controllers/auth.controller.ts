import {
  Controller,
  Get,
  HttpCode,
  Post,
  Redirect,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { Response } from 'express';
import { AuthService } from '../services/auth.service';
import { User } from '../../../core/entities/user.entity';
import { ConfigService } from '@nestjs/config/dist/config.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Get('steam')
  @UseGuards(AuthGuard('steam'))
  steamLogin() {}

  @Get('steam/callback')
  @UseGuards(AuthGuard('steam'))
  @Redirect()
  async steamLoginCallback(@Req() req, @Res() res: Response) {
    const user = req.user as User;

    const { access_token } = await this.authService.login(user);

    res.cookie('access_token', access_token, {
      httpOnly: true,
      secure: true,
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: 'lax',
    });

    const frontendUrl =
      this.configService.get<string>('FRONTEND_URL') || 'http://localhost:3001';
    res.redirect(`${frontendUrl}/profile`);
  }

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  getProfile(@Req() req) {
    return req.user;
  }

  @Post('logout')
  @HttpCode(200)
  async logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('access_token', {
      httpOnly: true,
      path: '/',
      secure: true,
      sameSite: 'lax',
    });

    return { message: 'Logged out successfully' };
  }
}
