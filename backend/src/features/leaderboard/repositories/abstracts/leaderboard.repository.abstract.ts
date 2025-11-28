import { EntityManager } from 'typeorm';
import { UserRank } from '../../entities/user-rank.entity';
import { LeaderboardSort } from '../../dto/get-leaderboard.dto';

export abstract class LeaderboardRepository {
  abstract refreshRanks(tm?: EntityManager): Promise<void>;

  abstract getTopUsers(limit: number, tm?: EntityManager): Promise<UserRank[]>;

  abstract findWithPagination(
    sort: LeaderboardSort,
    page: number,
    limit: number,
    tm?: EntityManager,
  ): Promise<[UserRank[], number]>;

  abstract getUserRank(
    userId: number,
    tm?: EntityManager,
  ): Promise<UserRank | null>;

  abstract getFriendsRank(
    userId: number,
    tm?: EntityManager,
  ): Promise<UserRank[]>;
}
