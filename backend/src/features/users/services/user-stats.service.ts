import { Injectable } from '@nestjs/common';
import { Inject } from '@nestjs/common/decorators/core/inject.decorator';
import { UserRepository } from '../repositories/abstracts/user.repository.abstract';
import { UserAchievementRepository } from '../repositories/abstracts/user-achievement.repository.abstract';
import { EntityManager } from 'typeorm';

@Injectable()
export class UserStatsService {
  constructor(
    @Inject(UserRepository)
    private readonly userRepo: UserRepository,
    @Inject(UserAchievementRepository)
    private readonly userAchievementRepo: UserAchievementRepository,
  ) {}

  async recalculateUserStats(
    userId: number,
    transactionManager?: EntityManager,
  ): Promise<void> {
    const totalAchievements =
      await this.userAchievementRepo.countCompletedAchievements(
        userId,
        transactionManager,
      );

    const completedGames = await this.userAchievementRepo.countCompletedGames(
      userId,
      transactionManager,
    );

    await this.userRepo.update(
      userId,
      {
        achievement_count: totalAchievements,
        completed_count: completedGames,
      },
      transactionManager,
    );
  }

  async updateUserGameCount(
    userId: number,
    count: number,
    transactionManager?: EntityManager,
  ): Promise<void> {
    await this.userRepo.update(
      userId,
      { game_count: count },
      transactionManager,
    );
  }
}
