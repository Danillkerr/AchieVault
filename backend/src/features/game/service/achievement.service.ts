import { Inject, Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { ISteamPlayerAchievement } from 'src/core/interfaces/games/player-achievement.interface';
import { AchievementRepository } from '../repositories/abstracts/achievement.repository.abstract';

@Injectable()
export class AchievementService {
  constructor(
    @Inject(AchievementRepository)
    private readonly achievementRepo: AchievementRepository,
  ) {}

  async bulkUpsertAchievements(
    gameId: number,
    achievementsFromApi: ISteamPlayerAchievement[],
    transactionManager?: EntityManager,
  ): Promise<Map<string, number> | undefined> {
    return this.achievementRepo.bulkUpsert(
      gameId,
      achievementsFromApi,
      transactionManager,
    );
  }
}
