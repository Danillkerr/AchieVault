import { Repository } from 'typeorm';
import { User } from '../../core/entities/user.entity';
import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ProfileFromSteam,
  SteamProfile,
} from 'src/core/interfaces/steam-profile.interface';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async findOrCreateBySteamProfile({
    id,
    displayName,
    photos,
  }: ProfileFromSteam): Promise<User> {
    const profile: SteamProfile = {
      steamid: id,
      name: displayName,
      avatar: photos[2]?.value,
    };

    let user = await this.userRepository.findOneBy({
      steamid: profile.steamid,
    });

    if (!user) {
      user = this.userRepository.create(profile);
      await this.userRepository.save(user);
    }

    return user;
  }

  async findById(id: string): Promise<User | null> {
    return this.userRepository.findOneBy({ id });
  }
}
