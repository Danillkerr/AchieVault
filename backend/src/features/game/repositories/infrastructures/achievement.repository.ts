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

  async bulkUpsert(
    gameId: number,
    achievementsFromApi: ISteamPlayerAchievement[],
    transactionManager?: EntityManager,
  ): Promise<Map<string, number> | undefined> {
    if (!achievementsFromApi) return undefined;

    const manager = this.getManager(transactionManager);

    const achievementsToUpsert = achievementsFromApi.map((ach) => ({
      api_name: ach.apiname,
      game: { id: gameId },
      global_percent: ach.global_percent || 0,
    }));

    await manager.upsert(Achievement, achievementsToUpsert, [
      'game',
      'api_name',
    ]);

    const allApiNames = achievementsFromApi.map((a) => a.apiname);
    const achievementEntities = await manager.find(Achievement, {
      where: {
        game: { id: gameId },
        api_name: In(allApiNames),
      },
      select: ['id', 'api_name'],
    });

    const map = new Map<string, number>();
    for (const ach of achievementEntities) {
      map.set(ach.api_name, ach.id);
    }
    return map;
  }

  async findMapByGame(
    gameId: number,
    apiNames: string[],
    transactionManager?: EntityManager,
  ): Promise<Map<string, number>> {
    if (!apiNames || apiNames.length === 0) {
      return new Map();
    }

    const manager = this.getManager(transactionManager);

    const achievements = await manager.find(Achievement, {
      where: {
        game: { id: gameId },
        api_name: In(apiNames),
      },
      select: ['id', 'api_name'],
    });

    const map = new Map<string, number>();
    for (const ach of achievements) {
      map.set(ach.api_name, ach.id);
    }

    return map;
  }

  async countByGameIds(gameIds: number[]): Promise<Map<number, number>> {
    if (!gameIds.length) return new Map();

    const res = await this.getManager()
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
}
