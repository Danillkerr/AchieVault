import { Inject, Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { ISteamPlayerAchievement } from 'src/core/interfaces/games/player-achievement.interface';
import { AchievementRepository } from '../repositories/abstracts/achievement.repository.abstract';

interface IAchievementsDto {
  apiname: any;
  displayName: any;
  global_percent: number;
  achieved: number;
  unlocktime: number;
}

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

  async bulkUpsertAchievements123(
    gameId: number,
    achievementsFromApi: IAchievementsDto[],
    transactionManager?: EntityManager,
  ): Promise<Map<string, number> | undefined> {
    return this.achievementRepo.bulkUpsert(
      gameId,
      achievementsFromApi,
      transactionManager,
    );
  }

  async getAchievementsMap(
    gameId: number,
    apiNames: string[],
  ): Promise<Map<string, number>> {
    return this.achievementRepo.findMapByGame(gameId, apiNames);
  }

  async getTotalCountsByGameIds(
    gameIds: number[],
  ): Promise<Map<number, number>> {
    return this.achievementRepo.countByGameIds(gameIds);
  }
}
