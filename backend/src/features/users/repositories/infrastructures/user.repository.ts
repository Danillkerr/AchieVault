import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, EntityManager, ILike, In, Repository } from 'typeorm';
import { User } from 'src/core/entities/user.entity';
import { UserRepository } from '../abstracts/user.repository.abstract';
import { ISteamProfile } from '../../interfaces/steam-profile.interface';
import { BaseTypeOrmRepository } from 'src/core/repositories/base.repository';

@Injectable()
export class TypeOrmUserRepository
  extends BaseTypeOrmRepository<User>
  implements UserRepository
{
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {
    super(userRepo);
  }

  async findById(
    id: number,
    transactionManager?: EntityManager,
  ): Promise<User | null> {
    const manager = this.getManager(transactionManager);
    return manager.findOneBy(User, { id });
  }

  async findAll(transactionManager?: EntityManager): Promise<User[]> {
    const manager = this.getManager(transactionManager);
    return manager.find(User);
  }

  async findBySteamId(
    steamId: string,
    transactionManager?: EntityManager,
  ): Promise<User | null> {
    const manager = this.getManager(transactionManager);
    return manager.findOneBy(User, { steamid: steamId });
  }

  async findBySteamIds(
    steamIds: string[],
    transactionManager?: EntityManager,
  ): Promise<User[]> {
    const manager = this.getManager(transactionManager);

    if (steamIds.length === 0) return [];

    return manager.find(User, {
      where: { steamid: In(steamIds) },
      select: ['id'],
    });
  }

  async findOrCreate(
    profileData: ISteamProfile,
    transactionManager?: EntityManager,
  ): Promise<User> {
    const manager = this.getManager(transactionManager);
    await manager.upsert(User, profileData, ['steamid']);

    const user = await this.findBySteamId(
      profileData.steamid,
      transactionManager,
    );
    if (!user) {
      throw new Error('Failed to find or create user after upsert');
    }
    return user;
  }

  async update(
    id: number,
    data: DeepPartial<User>,
    transactionManager?: EntityManager,
  ): Promise<void> {
    const manager = this.getManager(transactionManager);
    await manager.update(User, id, data);
  }

  async searchUsers(query: string, limit: number = 10): Promise<User[]> {
    const manager = this.getManager();

    return manager.find(User, {
      where: [{ name: ILike(`%${query}%`) }, { steamid: ILike(`${query}%`) }],
      take: limit,
      order: {
        name: 'ASC',
      },
    });
  }
}
