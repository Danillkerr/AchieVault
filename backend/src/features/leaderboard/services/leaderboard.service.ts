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
}
