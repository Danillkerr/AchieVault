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
    tm?: EntityManager,
  ): Promise<void> {
    const [totalAchievements, completedGames] = await Promise.all([
      this.userAchievementRepo.countCompletedAchievements(userId, tm),
      this.userAchievementRepo.countCompletedGames(userId, tm),
    ]);

    await this.userRepo.update(
      userId,
      {
        achievement_count: totalAchievements,
        completed_count: completedGames,
      },
      tm,
    );
  }

  async updateUserGameCount(
    userId: number,
    count: number,
    tm?: EntityManager,
  ): Promise<void> {
    await this.userRepo.update(userId, { game_count: count }, tm);
  }
}
