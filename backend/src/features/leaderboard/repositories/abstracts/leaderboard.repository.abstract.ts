import { EntityManager } from 'typeorm';
import { UserRank } from '../../entities/user-rank.entity';

export abstract class LeaderboardRepository {
  abstract refreshRanks(transactionManager?: EntityManager): Promise<void>;

  abstract getTopUsers(limit: number): Promise<UserRank[]>;
}
