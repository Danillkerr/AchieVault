import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserAchievement } from 'src/features/users/entities/user-achievement.entity';
import { IsNull, Not, Repository, DeepPartial, EntityManager } from 'typeorm';
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

  async bulkUpsert(
    achievements: IAchievementToUpsert[],
    transactionManager?: EntityManager,
  ): Promise<void> {
    if (achievements.length === 0) return;

    const achievementsToUpsert: DeepPartial<UserAchievement>[] =
      achievements.map((ach) => ({
        user: { id: ach.user.id },
        achievement: { id: ach.achievement.id },
        obtained: ach.obtained,
      }));

    const manager = this.getManager(transactionManager);

    await manager.upsert(UserAchievement, achievementsToUpsert, [
      'user',
      'achievement',
    ]);
  }

  async countCompletedAchievements(
    userId: number,
    transactionManager?: EntityManager,
  ): Promise<number> {
    const manager = this.getManager(transactionManager);
    return manager.count(UserAchievement, {
      where: {
        user: { id: userId },
        obtained: Not(IsNull()),
      },
    });
  }

  async countCompletedGames(
    userId: number,
    transactionManager?: EntityManager,
  ): Promise<number> {
    const manager = this.getManager(transactionManager);

    const subQuery = manager
      .createQueryBuilder(UserAchievement, 'ua')
      .innerJoin('ua.achievement', 'a')
      .where('ua.user_id = :userId', { userId })
      .groupBy('a.game_id')
      .select('a.game_id')
      .addSelect(
        `COUNT(*) FILTER (WHERE "ua"."obtained" IS NULL)`,
        'not_obtained_count',
      );

    const result = await manager.connection
      .createQueryBuilder()
      .select(`COUNT(*)`, 'completed_games_count')
      .from(`(${subQuery.getQuery()})`, 't')
      .where('t.not_obtained_count = 0')
      .setParameters(subQuery.getParameters())
      .getRawOne();

    return parseInt(result.completed_games_count, 10) || 0;
  }

  async findAchievementByGame(
    userId: number,
    steamId: string,
    transactionManager?: EntityManager,
  ): Promise<UserAchievement[]> {
    const manager = this.getManager(transactionManager);

    return manager.find(UserAchievement, {
      where: {
        user: { id: userId },
        achievement: {
          game: {
            steam_id: steamId,
          },
        },
      },
      relations: {
        achievement: true,
      },
    });
  }

  async countUnlockedByGameIds(
    userId: number,
    gameIds: number[],
  ): Promise<{ game_id: number; cnt: string }[]> {
    if (gameIds.length === 0) return [];

    const manager = this.getManager();

    const result = await manager
      .createQueryBuilder(UserAchievement, 'ua')
      .select('a.game_id', 'game_id')
      .addSelect('COUNT(ua.id)', 'cnt')
      .innerJoin('ua.achievement', 'a')
      .where('ua.user_id = :userId', { userId })
      .andWhere('a.game_id IN (:...gameIds)', { gameIds })
      .andWhere('ua.obtained IS NOT NULL')
      .groupBy('a.game_id')
      .getRawMany();

    return result;
  }
}
