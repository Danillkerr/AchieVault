import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-steam';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class SteamStrategy extends PassportStrategy(Strategy, 'steam') {
  constructor(private readonly authService: AuthService) {
    const returnURL = process.env.STEAM_CALLBACK_URL;
    const realm = process.env.STEAM_REALM_URL;
    const apiKey = process.env.STEAM_API_KEY;

    if (!returnURL || !realm || !apiKey) {
      throw new Error('Steam strategy environment variables are not set');
    }

    super({
      returnURL,
      realm,
      apiKey,
    });
  }

  async validate(identifier: string, profile: any): Promise<any> {
    if (!profile) {
      throw new UnauthorizedException('Steam profile not found');
    }

    const user = await this.authService.validateSteamUser(profile);

    if (!user) {
      throw new UnauthorizedException('Failed to validate user');
    }

    return user;
  }
}
