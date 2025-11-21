import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { UserRank } from '../../entities/user-rank.entity';
import { LeaderboardRepository } from '../abstracts/leaderboard.repository.abstract';
import { BaseTypeOrmRepository } from '../../../../core/repositories/base.repository';
import { LeaderboardSort } from '../../dto/get-leaderboard.dto';

@Injectable()
export class TypeOrmLeaderboardRepository
  extends BaseTypeOrmRepository<UserRank>
  implements LeaderboardRepository
{
  constructor(
    @InjectRepository(UserRank)
    private readonly rankRepo: Repository<UserRank>,
  ) {
    super(rankRepo);
  }

  async refreshRanks(transactionManager?: EntityManager): Promise<void> {
    const manager = this.getManager(transactionManager);

    const sql = `
      INSERT INTO "Rating" (user_id, rank_completed, rank_achievement)
      SELECT 
        u.id,
        RANK() OVER (ORDER BY u.completed_count DESC),
        RANK() OVER (ORDER BY u.achievement_count DESC)
      FROM "User" u
      ON CONFLICT (user_id) 
      DO UPDATE SET
        rank_completed = EXCLUDED.rank_completed,
        rank_achievement = EXCLUDED.rank_achievement;
    `;

    await manager.query(sql);
  }

  async getTopUsers(limit: number): Promise<UserRank[]> {
    return this.rankRepo.find({
      take: limit,
      order: { rank_completed: 'ASC' },
      relations: { user: true },
    });
  }

  async findWithPagination(
    sort: LeaderboardSort,
    page: number,
    limit: number,
  ): Promise<[UserRank[], number]> {
    const orderColumn =
      sort === LeaderboardSort.COMPLETED
        ? 'rank_completed'
        : 'rank_achievement';

    return this.rankRepo.findAndCount({
      order: { [orderColumn]: 'ASC' },
      take: limit,
      skip: (page - 1) * limit,
      relations: {
        user: true,
      },
      select: {
        user: {
          id: true,
          name: true,
          avatar: true,
          completed_count: true,
          achievement_count: true,
        },
      },
    });
  }

  async getUserRank(userId: number): Promise<UserRank | null> {
    const manager = this.getManager();

    return manager.findOne(UserRank, {
      where: { userId },
      relations: { user: true },
    });
  }
}
