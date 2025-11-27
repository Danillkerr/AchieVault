import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserGame } from 'src/features/users/entities/user-game.entity';
import { EntityManager, In, Repository } from 'typeorm';
import { UserGameRepository } from '../abstracts/user-game.repository.abstract';
import { IUserGameUpsert } from '../../interfaces/user-game.interface';
import { BaseTypeOrmRepository } from 'src/core/repositories/base.repository';
import { GetUserLibraryDto, LibrarySort } from '../../dto/get-user-library.dto';
import { Achievement } from 'src/features/game/entities/achievement.entity';

@Injectable()
export class TypeOrmUserGameRepository
  extends BaseTypeOrmRepository<UserGame>
  implements UserGameRepository
{
  constructor(
    @InjectRepository(UserGame)
    private readonly userGameRepo: Repository<UserGame>,
  ) {
    super(userGameRepo);
  }

  async getAllUserGames(
    userId: number,
    transactionManager?: EntityManager,
  ): Promise<UserGame[]> {
    const manager = this.getManager(transactionManager);
    return manager.find(UserGame, {
      where: { user: { id: userId } },
      relations: {
        game: true,
      },
    });
  }

  async getOwnedSteamIds(
    userId: number,
    transactionManager?: EntityManager,
  ): Promise<string[]> {
    const manager = this.getManager(transactionManager);
    const userGames: { steamid: string }[] = await manager
      .createQueryBuilder(UserGame, 'User_Game')
      .leftJoin('User_Game.game', 'Game')
      .select('Game.steam_id', 'steamid')
      .where('User_Game.user_id = :userId', { userId })
      .getRawMany();

    return userGames.map((game) => game.steamid);
  }

  async updatePlaytime(
    userGameId: number,
    newPlaytime: number,
    transactionManager?: EntityManager,
  ): Promise<void> {
    const manager = this.getManager(transactionManager);
    await manager.update(
      UserGame,
      { id: userGameId },
      { playtime: newPlaytime },
    );
  }

  async bulkUpsert(
    userId: number,
    games: IUserGameUpsert[],
    transactionManager?: EntityManager,
  ): Promise<void> {
    if (games.length === 0) return;

    const steamIds = games.map((g) => g.steam_id);
    const playtimes = games.map((g) => g.playtime);

    const sql = `
      INSERT INTO "User_Game" (user_id, game_id, playtime) 
    SELECT
      $1 AS user_id,
      g.id AS game_id,
      NULL AS playtime
    FROM
      unnest($2::text[], $3::int[]) AS s(steam_id, playtime)
    
    INNER JOIN "Game" g ON g.steam_id = s.steam_id
    
    ON CONFLICT (user_id, game_id) DO UPDATE
    SET
      playtime = EXCLUDED.playtime;
    `;

    const manager = this.getManager(transactionManager);
    await manager.query(sql, [userId, steamIds, playtimes]);
  }

  async findLibrary(
    userId: number,
    options: GetUserLibraryDto,
  ): Promise<[UserGame[], number]> {
    const { page, limit, search, sortBy } = options;
    const manager = this.getManager();

    const qb = manager
      .createQueryBuilder(UserGame, 'ug')
      .leftJoinAndSelect('ug.game', 'g')
      .where('ug.user_id = :userId', { userId });

    qb.andWhere('g.title != :unknownTitle', { unknownTitle: 'Unknown Title' });

    qb.andWhere((qb) => {
      const subQuery = qb
        .subQuery()
        .select('1')
        .from(Achievement, 'a')
        .where('a.game_id = g.id')
        .getQuery();
      return `EXISTS ${subQuery}`;
    });

    if (search) {
      qb.andWhere('g.title ILIKE :search', { search: `%${search}%` });
    }

    switch (sortBy) {
      case LibrarySort.NAME:
        qb.orderBy('g.title', 'ASC');
        break;
      case LibrarySort.PLAYTIME:
      default:
        qb.orderBy('ug.playtime', 'DESC');
        break;
    }

    qb.skip((page - 1) * limit).take(limit);

    return qb.getManyAndCount();
  }

  async findGamesForRecommendation(
    userId: number,
    gameIds: number[],
  ): Promise<any[]> {
    if (!gameIds || gameIds.length === 0) return [];

    const manager = this.getManager();

    const idsString = gameIds.join(',');

    const rawData = await manager.query(
      `
      SELECT 
        ug.id as user_game_id,
        g.id as game_id,
        g.title,
        g.time_to_beat,
        (SELECT COUNT(*) FROM "Achievement" a WHERE a.game_id = g.id) as total_achievements,
        (
          SELECT COUNT(*) 
          FROM "User_Achievement" ua_cnt 
          JOIN "Achievement" a_cnt ON ua_cnt.achievement_id = a_cnt.id
          WHERE ua_cnt.user_id = $1 
          AND ua_cnt.obtained IS NOT NULL 
          AND a_cnt.game_id = g.id
        ) as unlocked_count,
        (
          SELECT array_agg(a.global_percent)
          FROM "Achievement" a
          WHERE a.game_id = g.id
          AND a.id NOT IN (
            SELECT ua.achievement_id 
            FROM "User_Achievement" ua 
            WHERE ua.user_id = $1 AND ua.obtained IS NOT NULL
          )
        ) as locked_achievements
      FROM "User_Game" ug
      JOIN "Game" g ON ug.game_id = g.id
      WHERE ug.user_id = $1
      AND g.id IN (${idsString})
    `,
      [userId],
    );

    return rawData.filter((row) => {
      const total = parseInt(row.total_achievements);
      const unlocked = parseInt(row.unlocked_count);
      return total > 0 && unlocked < total;
    });
  }

  async findByGameIds(userId: number, gameIds: number[]): Promise<UserGame[]> {
    if (gameIds.length === 0) return [];

    const manager = this.getManager();
    return manager.find(UserGame, {
      where: {
        user: { id: userId },
        game: { id: In(gameIds) },
      },
    });
  }
}
