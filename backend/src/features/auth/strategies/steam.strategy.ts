import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-steam';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { ConfigService } from '@nestjs/config/dist/config.service';

@Injectable()
export class SteamStrategy extends PassportStrategy(Strategy, 'steam') {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {
    const returnURL = configService.get<string>('STEAM_CALLBACK_URL');
    const realm = configService.get<string>('STEAM_REALM_URL');
    const apiKey = configService.get<string>('STEAM_API_KEY');

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
