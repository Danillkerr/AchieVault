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
}
