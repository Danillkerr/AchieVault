import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { UsersService } from '../../users/users.service';
import { Request } from 'express';

const cookieExtractor = (req: Request): string | null => {
  if (req && req.cookies) {
    return req.cookies['access_token'];
  }
  return null;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly usersService: UsersService) {
    const jwtFromRequest = ExtractJwt.fromExtractors([cookieExtractor]);
    const ignoreExpiration = false;
    const secretOrKey = process.env.JWT_SECRET;

    if (!secretOrKey) {
      throw new Error('JWT_SECRET is not defined in environment variables');
    }

    super({
      jwtFromRequest,
      ignoreExpiration,
      secretOrKey,
    });
  }

  async validate(payload: { sub: number; name: string }): Promise<any> {
    const user = await this.usersService.findById(payload.sub);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return user;
  }
}
