import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../../users/services/users.service';
import { User } from '../../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateSteamUser(profile: any): Promise<User> {
    return this.usersService.findOrCreateBySteamProfile(profile);
  }

  async login(user: User) {
    const payload = {
      sub: user.id,
      steamid: user.steamid,
      name: user.name,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
