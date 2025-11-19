import { User } from '../../../../core/entities/user.entity';
import { DeepPartial, EntityManager } from 'typeorm';
import { ISteamProfile } from '../../interfaces/steam-profile.interface';

export abstract class UserRepository {
  abstract findById(
    id: number,
    transactionManager?: EntityManager,
  ): Promise<User | null>;

  abstract findAll(transactionManager?: EntityManager): Promise<User[]>;

  abstract findBySteamId(
    steamId: string,
    transactionManager?: EntityManager,
  ): Promise<User | null>;

  abstract findBySteamIds(
    steamIds: string[],
    transactionManager?: EntityManager,
  ): Promise<User[]>;

  abstract findOrCreate(
    profileData: ISteamProfile,
    transactionManager?: EntityManager,
  ): Promise<User>;

  abstract update(
    id: number,
    data: DeepPartial<User>,
    transactionManager?: EntityManager,
  ): Promise<void>;
}
