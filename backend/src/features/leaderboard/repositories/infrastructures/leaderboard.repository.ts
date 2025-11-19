import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { UserRank } from '../../entities/user-rank.entity';
import { LeaderboardRepository } from '../abstracts/leaderboard.repository.abstract';
import { BaseTypeOrmRepository } from '../../../../core/repositories/base.repository';
import { User } from 'src/core/entities/user.entity';

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
      INSERT INTO "Rating" (user_id, rank_completed, rank_achievement, updated_at)
      SELECT 
        u.id,
        RANK() OVER (ORDER BY u.completed_count DESC),
        RANK() OVER (ORDER BY u.achievement_count DESC),
        NOW()
      FROM "User" u
      ON CONFLICT (user_id) 
      DO UPDATE SET
        rank_completed = EXCLUDED.rank_completed,
        rank_achievement = EXCLUDED.rank_achievement,
        updated_at = EXCLUDED.updated_at;
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
}
