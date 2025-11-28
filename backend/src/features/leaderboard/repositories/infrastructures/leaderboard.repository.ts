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

  async getTopUsers(limit: number, tm?: EntityManager): Promise<UserRank[]> {
    return this.find(
      {
        take: limit,
        order: { rank_completed: 'ASC' },
        relations: { user: true },
      },
      tm,
    );
  }

  async getUserRank(
    userId: number,
    tm?: EntityManager,
  ): Promise<UserRank | null> {
    return this.findOne(
      {
        where: { userId },
        relations: { user: true },
      },
      tm,
    );
  }

  async findWithPagination(
    sort: LeaderboardSort,
    page: number,
    limit: number,
    tm?: EntityManager,
  ): Promise<[UserRank[], number]> {
    const manager = this.getManager(tm);

    const orderColumn =
      sort === LeaderboardSort.COMPLETED
        ? 'rank_completed'
        : 'rank_achievement';

    return manager.findAndCount(UserRank, {
      order: { [orderColumn]: 'ASC' },
      take: limit,
      skip: (page - 1) * limit,
      relations: { user: true },
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

  async getFriendsRank(
    userId: number,
    tm?: EntityManager,
  ): Promise<UserRank[]> {
    const manager = this.getManager(tm);

    const qb = manager
      .createQueryBuilder(UserRank, 'rank')
      .leftJoinAndSelect('rank.user', 'user')
      .leftJoin(
        'FriendList',
        'friend',
        '(friend.user_id = :userId AND friend.friend_id = rank.user_id) OR ' +
          '(friend.friend_id = :userId AND friend.user_id = rank.user_id)',
        { userId },
      )
      .where('friend.id IS NOT NULL OR rank.user_id = :userId', { userId });

    return qb.getMany();
  }

  async refreshRanks(tm?: EntityManager): Promise<void> {
    const manager = this.getManager(tm);

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
}
