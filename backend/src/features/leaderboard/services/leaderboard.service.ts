import { Inject, Injectable, Logger } from '@nestjs/common';
import { LeaderboardRepository } from '../repositories/abstracts/leaderboard.repository.abstract';

@Injectable()
export class LeaderboardService {
  private readonly logger = new Logger(LeaderboardService.name);

  constructor(
    @Inject(LeaderboardRepository)
    private readonly leaderboardRepo: LeaderboardRepository,
  ) {}

  async updateLeaderboard(): Promise<void> {
    this.logger.log('Starting leaderboard recalculation...');

    await this.leaderboardRepo.refreshRanks();

    this.logger.log('Leaderboard updated successfully.');
  }

  async getTopPlayers() {
    return this.leaderboardRepo.getTopUsers(100);
  }
}
