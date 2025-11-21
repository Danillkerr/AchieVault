import { EntityManager } from 'typeorm';
import { UserRank } from '../../entities/user-rank.entity';
import { LeaderboardSort } from '../../dto/get-leaderboard.dto';

export abstract class LeaderboardRepository {
  abstract refreshRanks(transactionManager?: EntityManager): Promise<void>;

  abstract getTopUsers(limit: number): Promise<UserRank[]>;

  abstract findWithPagination(
    sort: LeaderboardSort,
    page: number,
    limit: number,
  ): Promise<[UserRank[], number]>;

  abstract getUserRank(userId: number): Promise<UserRank | null>;
}
