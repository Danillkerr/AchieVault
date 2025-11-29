import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, ILike, In, Repository } from 'typeorm';
import { User } from '../../entities/user.entity';
import { UserRepository } from '../abstracts/user.repository.abstract';
import { ISteamProfile } from '../../interfaces/steam-profile.interface';
import { BaseTypeOrmRepository } from '../../../../core/repositories/base.repository';
import { QueryDeepPartialEntity } from 'typeorm/browser/query-builder/QueryPartialEntity.js';

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

  async findById(id: number, tm?: EntityManager): Promise<User | null> {
    return this.findOne({ where: { id } }, tm);
  }

  async findAll(tm?: EntityManager): Promise<User[]> {
    return this.find({}, tm);
  }

  async findBySteamId(
    steamId: string,
    tm?: EntityManager,
  ): Promise<User | null> {
    return this.findOne({ where: { steamid: steamId } }, tm);
  }

  async findBySteamIds(
    steamIds: string[],
    tm?: EntityManager,
  ): Promise<User[]> {
    if (steamIds.length === 0) return [];
    return this.find({ where: { steamid: In(steamIds) } }, tm);
  }

  async searchUsers(
    query: string,
    limit: number = 10,
    tm?: EntityManager,
  ): Promise<User[]> {
    return this.find(
      {
        where: [{ name: ILike(`%${query}%`) }, { steamid: ILike(`${query}%`) }],
        take: limit,
        order: { name: 'ASC' },
      },
      tm,
    );
  }

  async findOrCreate(
    profileData: ISteamProfile,
    tm?: EntityManager,
  ): Promise<User> {
    const manager = this.getManager(tm);
    await manager.upsert(User, profileData, {
      conflictPaths: ['steamid'],
      skipUpdateIfNoValuesChanged: true,
    });

    const user = await this.findBySteamId(profileData.steamid, tm);
    if (!user) {
      throw new InternalServerErrorException(
        `Could not find user after creating: ${profileData.steamid}`,
      );
    }
    return user;
  }

  async update(
    id: number,
    data: QueryDeepPartialEntity<User>,
    tm?: EntityManager,
  ): Promise<void> {
    await super.update(id, data, tm);
  }

  async delete(id: number): Promise<void> {
    return super.delete(id);
  }
}
