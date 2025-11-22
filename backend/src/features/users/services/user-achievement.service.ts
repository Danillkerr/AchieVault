import { Injectable } from '@nestjs/common';
import { UserAchievementRepository } from '../repositories/abstracts/user-achievement.repository.abstract';
import { Inject } from '@nestjs/common/decorators/core/inject.decorator';
import { IAchievementToUpsert } from '../interfaces/user-achievement.interface';
import { EntityManager } from 'typeorm';
import { ISteamPlayerAchievement } from 'src/core/interfaces/games/player-achievement.interface';

@Injectable()
export class UserAchievementService {
  constructor(
    @Inject(UserAchievementRepository)
    private readonly userAchievementRepo: UserAchievementRepository,
  ) {}

  async bulkUpsertFromSteam(
    userId: number,
    achievementMap: Map<string, number>,
    achievementsFromApi: ISteamPlayerAchievement[],
    transactionManager?: EntityManager,
  ): Promise<void> {
    const achievementsToUpsert: IAchievementToUpsert[] = [];

    for (const ach of achievementsFromApi) {
      const achievementId = achievementMap.get(ach.apiname);
      if (!achievementId) {
        continue;
      }

      const obtainedDate =
        ach.achieved === 1 ? new Date(ach.unlocktime * 1000) : null;

      achievementsToUpsert.push({
        user: { id: userId },
        achievement: { id: achievementId },
        obtained: obtainedDate,
      });
    }

    return this.userAchievementRepo.bulkUpsert(
      achievementsToUpsert,
      transactionManager,
    );
  }

  async getUserProgress(
    userId: number,
    steamId: string,
    transactionManager?: EntityManager,
  ): Promise<any[]> {
    return this.userAchievementRepo.findAchievementByGame(
      userId,
      steamId,
      transactionManager,
    );
  }
}
