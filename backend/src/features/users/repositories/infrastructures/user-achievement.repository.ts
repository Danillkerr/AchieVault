import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserAchievement } from 'src/features/users/entities/user-achievement.entity';
import { IsNull, Not, Repository, EntityManager } from 'typeorm';
import { UserAchievementRepository } from '../abstracts/user-achievement.repository.abstract';
import { IAchievementToUpsert } from '../../interfaces/user-achievement.interface';
import { BaseTypeOrmRepository } from 'src/core/repositories/base.repository';

@Injectable()
export class TypeOrmUserAchievementRepository
  extends BaseTypeOrmRepository<UserAchievement>
  implements UserAchievementRepository
{
  constructor(
    @InjectRepository(UserAchievement)
    private readonly userAchievementRepo: Repository<UserAchievement>,
  ) {
    super(userAchievementRepo);
  }

  async findAchievementByGame(
    userId: number,
    steamId: string,
    tm?: EntityManager,
  ): Promise<UserAchievement[]> {
    return this.find(
      {
        where: {
          user: { id: userId },
          achievement: { game: { steam_id: steamId } },
        },
        relations: { achievement: true },
      },
      tm,
    );
  }

  async countCompletedAchievements(
    userId: number,
    tm?: EntityManager,
  ): Promise<number> {
    return this.count(
      {
        where: {
          user: { id: userId },
          obtained: Not(IsNull()),
        },
      },
      tm,
    );
  }

  async countCompletedGames(
    userId: number,
    tm?: EntityManager,
  ): Promise<number> {
    const manager = this.getManager(tm);

    const subQuery = manager
      .createQueryBuilder(UserAchievement, 'ua')
      .select('a.game_id')
      .innerJoin('ua.achievement', 'a')
      .where('ua.user_id = :userId', { userId })
      .groupBy('a.game_id')
      .having('COUNT(*) FILTER (WHERE ua.obtained IS NULL) = 0');

    const count = await manager
      .createQueryBuilder()
      .select('COUNT(*)', 'cnt')
      .from(`(${subQuery.getQuery()})`, 't')
      .setParameters(subQuery.getParameters())
      .getRawOne();

    return parseInt(count?.cnt, 10) || 0;
  }

  async countUnlockedByGameIds(
    userId: number,
    gameIds: number[],
    tm?: EntityManager,
  ): Promise<{ game_id: number; cnt: string }[]> {
    if (gameIds.length === 0) return [];

    const manager = this.getManager(tm);

    return manager
      .createQueryBuilder(UserAchievement, 'ua')
      .select('a.game_id', 'game_id')
      .addSelect('COUNT(ua.id)', 'cnt')
      .innerJoin('ua.achievement', 'a')
      .where('ua.user_id = :userId', { userId })
      .andWhere('a.game_id IN (:...ids)', { ids: gameIds })
      .andWhere('ua.obtained IS NOT NULL')
      .groupBy('a.game_id')
      .getRawMany();
  }

  async bulkUpsert(
    achievements: IAchievementToUpsert[],
    tm?: EntityManager,
  ): Promise<void> {
    if (achievements.length === 0) return;

    const data = achievements.map((a) => ({
      user: { id: a.user.id },
      achievement: { id: a.achievement.id },
      obtained: a.obtained,
    }));

    await this.upsert(data, ['user', 'achievement'], tm);
  }
}
