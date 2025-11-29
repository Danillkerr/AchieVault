import { DeepPartial, EntityManager } from 'typeorm';
import { User } from '../entities/user.entity';
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

  async findAll(transactionManager?: EntityManager): Promise<User[]> {
    return this.userRepository.findAll(transactionManager);
  }

  async findBySteamIds(
    steamIds: string[],
    transactionManager?: EntityManager,
  ): Promise<User[]> {
    return this.userRepository.findBySteamIds(steamIds, transactionManager);
  }

  async search(query: string): Promise<User[]> {
    const sanitizedQuery = query?.trim();

    if (!sanitizedQuery || sanitizedQuery.length < 2) {
      return [];
    }

    return this.userRepository.searchUsers(sanitizedQuery);
  }

  async findOrCreateBySteamProfile(
    steamProfile: IProfileFromSteam,
    transactionManager?: EntityManager,
  ): Promise<User> {
    const profileDto = this.mapSteamProfileToDto(steamProfile);
    return this.userRepository.findOrCreate(profileDto, transactionManager);
  }

  async updateUser(
    id: number,
    data: DeepPartial<User>,
    transactionManager?: EntityManager,
  ): Promise<void> {
    return this.userRepository.update(id, data, transactionManager);
  }

  async deleteUser(userId: number): Promise<void> {
    await this.userRepository.delete(userId);
  }

  private mapSteamProfileToDto(profile: IProfileFromSteam): ISteamProfile {
    const avatarUrl = profile.photos?.[2]?.value;

    return {
      steamid: profile.id,
      name: profile.displayName,
      avatar: avatarUrl,
    };
  }
}
