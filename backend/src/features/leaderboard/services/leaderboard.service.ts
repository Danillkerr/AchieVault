import { Inject, Injectable, Logger } from '@nestjs/common';
import { LeaderboardRepository } from '../repositories/abstracts/leaderboard.repository.abstract';
import { GetLeaderboardDto } from '../dto/get-leaderboard.dto';

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

  async getLeaderboard(dto: GetLeaderboardDto) {
    const { sort, page, limit } = dto;

    const [items, total] = await this.leaderboardRepo.findWithPagination(
      sort,
      page,
      limit,
    );

    return {
      data: items,
      meta: {
        totalItems: total,
        itemCount: items.length,
        itemsPerPage: limit,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
      },
    };
  }

  async getUserRank(userId: number) {
    const rank = await this.leaderboardRepo.getUserRank(userId);

    if (!rank) {
      this.logger.warn(`User rank not found for userId: ${userId}`);
      return null;
    }

    return rank;
  }

  async getFriendsLeaderboard(userId: number) {
    const ranks = await this.leaderboardRepo.getFriendsRank(userId);

    const friends_perfect = [...ranks]
      .sort((a, b) => b.user.completed_count - a.user.completed_count)
      .map((r, index) => ({
        id: r.id,
        rank: index + 1,
        value: r.user.completed_count,
        user: r.user,
      }));
    const friends_achievements = [...ranks]
      .sort((a, b) => b.user.achievement_count - a.user.achievement_count)
      .map((r, index) => ({
        id: r.id,
        rank: index + 1,
        value: r.user.achievement_count,
        user: r.user,
      }));

    return { friends_perfect, friends_achievements };
  }
}
