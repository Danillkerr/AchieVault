import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, In, Repository } from 'typeorm';
import { Achievement } from 'src/features/game/entities/achievement.entity';
import { AchievementRepository } from '../abstracts/achievement.repository.abstract';
import { BaseTypeOrmRepository } from '../../../../core/repositories/base.repository';
import { ISteamPlayerAchievement } from 'src/core/interfaces/games/player-achievement.interface';

@Injectable()
export class TypeOrmAchievementRepository
  extends BaseTypeOrmRepository<Achievement>
  implements AchievementRepository
{
  constructor(
    @InjectRepository(Achievement)
    private readonly achRepo: Repository<Achievement>,
  ) {
    super(achRepo);
  }

  async findMapByGame(
    gameId: number,
    apiNames: string[],
    tm?: EntityManager,
  ): Promise<Map<string, number>> {
    if (!apiNames || apiNames.length === 0) {
      return new Map();
    }

    const achievements = await this.find(
      {
        where: {
          game: { id: gameId },
          api_name: In(apiNames),
        },
        select: ['id', 'api_name'],
      },
      tm,
    );

    const map = new Map<string, number>();
    achievements.forEach((ach) => map.set(ach.api_name, ach.id));

    return map;
  }

  async countByGameIds(
    gameIds: number[],
    tm?: EntityManager,
  ): Promise<Map<number, number>> {
    if (!gameIds.length) return new Map();

    const manager = this.getManager(tm);

    const res = await manager
      .createQueryBuilder(Achievement, 'a')
      .select('a.game_id', 'gameId')
      .addSelect('COUNT(a.id)', 'cnt')
      .where('a.game_id IN (:...ids)', { ids: gameIds })
      .groupBy('a.game_id')
      .getRawMany();

    const map = new Map<number, number>();
    res.forEach((r) => map.set(Number(r.gameId), Number(r.cnt)));
    return map;
  }

  async bulkUpsert(
    gameId: number,
    achievementsFromApi: ISteamPlayerAchievement[],
    tm?: EntityManager,
  ): Promise<Map<string, number> | undefined> {
    if (!achievementsFromApi) return undefined;

    const achievementsToUpsert = achievementsFromApi.map((ach) => ({
      api_name: ach.apiname,
      game: { id: gameId },
      global_percent: ach.global_percent || 0,
    }));

    await this.upsert(achievementsToUpsert, ['game', 'api_name'], tm);

    const apiNames = achievementsFromApi.map((a) => a.apiname);
    return this.findMapByGame(gameId, apiNames, tm);
  }
}
