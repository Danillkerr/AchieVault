import { DeepPartial, EntityManager } from 'typeorm';
import { User } from '../../../core/entities/user.entity';
import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator';
import {
  IProfileFromSteam,
  ISteamProfile,
} from '../interfaces/steam-profile.interface';
import { UserRepository } from '../repositories/abstracts/user.repository.abstract';
import { Inject } from '@nestjs/common/decorators/core/inject.decorator';

@Injectable()
export class UsersService {
  constructor(
    @Inject(UserRepository)
    private readonly userRepository: UserRepository,
  ) {}

  async findById(
    id: number,
    transactionManager?: EntityManager,
  ): Promise<User | null> {
    return this.userRepository.findById(id, transactionManager);
  }

  async findUsersBySteamId(
    steamIds: string[],
    transactionManager?: EntityManager,
  ): Promise<User[]> {
    return this.userRepository.findBySteamIds(steamIds, transactionManager);
  }

  async findUsersBySteamIds(
    steamIds: string[],
    transactionManager?: EntityManager,
  ): Promise<User[]> {
    return this.userRepository.findBySteamIds(steamIds, transactionManager);
  }

  async findOrCreateBySteamProfile(
    { id, displayName, photos }: IProfileFromSteam,
    transactionManager?: EntityManager,
  ): Promise<User> {
    const profileDto: ISteamProfile = {
      steamid: id,
      name: displayName,
      avatar: photos[2]?.value,
    };

    return this.userRepository.findOrCreate(profileDto, transactionManager);
  }

  async updateUser(
    id: number,
    data: DeepPartial<User>,
    transactionManager?: EntityManager,
  ): Promise<void> {
    return this.userRepository.update(id, data, transactionManager);
  }
}
