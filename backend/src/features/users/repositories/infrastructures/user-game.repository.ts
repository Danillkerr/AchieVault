import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserGame } from 'src/features/users/entities/user-game.entity';
import { EntityManager, In, Repository, SelectQueryBuilder } from 'typeorm';
import { UserGameRepository } from '../abstracts/user-game.repository.abstract';
import { IUserGameUpsert } from '../../interfaces/user-game.interface';
import { BaseTypeOrmRepository } from 'src/core/repositories/base.repository';
import { GetUserLibraryDto, LibrarySort } from '../../dto/get-user-library.dto';
import { Achievement } from 'src/features/game/entities/achievement.entity';
import { Game } from 'src/features/game/entities/game.entity';

interface RecommendationRawResult {
  user_game_id: number;
  game_id: number;
  title: string;
  time_to_beat: number | null;
  total_achievements: string;
  unlocked_count: string;
  locked_achievements: number[] | null;
}

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
    tm?: EntityManager,
  ): Promise<UserGame[]> {
    return this.find(
      {
        where: { user: { id: userId } },
        relations: { game: true },
      },
      tm,
    );
  }

  async findByGameIds(
    userId: number,
    gameIds: number[],
    tm?: EntityManager,
  ): Promise<UserGame[]> {
    if (gameIds.length === 0) return [];
    return this.find(
      {
        where: {
          user: { id: userId },
          game: { id: In(gameIds) },
        },
      },
      tm,
    );
  }

  async getOwnedSteamIds(
    userId: number,
    tm?: EntityManager,
  ): Promise<string[]> {
    const manager = this.getManager(tm);
    const userGames = await manager
      .createQueryBuilder(UserGame, 'User_Game')
      .leftJoin('User_Game.game', 'Game')
      .select('Game.steam_id', 'steamid')
      .where('User_Game.user_id = :userId', { userId })
      .getRawMany<{ steamid: string }>();

    return userGames.map((game) => game.steamid);
  }

  async findLibrary(
    userId: number,
    options: GetUserLibraryDto,
  ): Promise<[UserGame[], number]> {
    const manager = this.getManager();

    const qb = manager
      .createQueryBuilder(UserGame, 'ug')
      .leftJoinAndSelect('ug.game', 'g')
      .where('ug.user_id = :userId', { userId });

    this.applyLibraryFilters(qb, options.search);

    this.applyLibrarySort(qb, options.sortBy);

    qb.skip((options.page - 1) * options.limit).take(options.limit);

    return qb.getManyAndCount();
  }

  async findGamesForRecommendation(
    userId: number,
    gameIds: number[],
  ): Promise<RecommendationRawResult[]> {
    if (!gameIds.length) return [];

    const manager = this.getManager();
    const qb = manager
      .createQueryBuilder(UserGame, 'ug')
      .innerJoin('ug.game', 'g')
      .select([
        'ug.id AS user_game_id',
        'g.id AS game_id',
        'g.title AS title',
        'g.time_to_beat AS time_to_beat',
      ])
      .where('ug.user_id = :userId', { userId })
      .andWhere('g.id IN (:...gameIds)', { gameIds });

    this.addTotalAchievementsSelect(qb);
    this.addUnlockedCountSelect(qb);
    this.addLockedAchievementsSelect(qb, userId);

    const rawData = await qb.getRawMany<RecommendationRawResult>();

    return rawData.filter((row) => {
      const total = parseInt(row.total_achievements, 10);
      const unlocked = parseInt(row.unlocked_count, 10);
      return total > 0 && unlocked < total;
    });
  }

  async updatePlaytime(
    userGameId: number,
    newPlaytime: number,
    tm?: EntityManager,
  ): Promise<void> {
    await this.update(userGameId, { playtime: newPlaytime }, tm);
  }

  async bulkUpsert(
    userId: number,
    games: IUserGameUpsert[],
    tm?: EntityManager,
  ): Promise<void> {
    if (games.length === 0) return;

    const manager = this.getManager(tm);
    const steamIds = games.map((g) => g.steam_id);

    const foundGames = await manager.find(Game, {
      where: { steam_id: In(steamIds) },
      select: ['id', 'steam_id'],
    });

    if (foundGames.length === 0) return;

    const valuesToInsert = foundGames.map((game) => ({
      user: { id: userId },
      game: { id: game.id },
      playtime: null,
    }));

    await manager
      .createQueryBuilder()
      .insert()
      .into(UserGame)
      .values(valuesToInsert)
      .orUpdate(['playtime'], ['user_id', 'game_id'])
      .execute();
  }

  private applyLibraryFilters(
    qb: SelectQueryBuilder<UserGame>,
    search?: string,
  ) {
    qb.andWhere('g.title != :unknown', { unknown: 'Unknown Title' });

    qb.andWhere((sub) => {
      const sq = sub
        .subQuery()
        .select('1')
        .from(Achievement, 'a')
        .where('a.game_id = g.id')
        .getQuery();
      return `EXISTS ${sq}`;
    });

    if (search) {
      qb.andWhere('g.title ILIKE :search', { search: `%${search}%` });
    }
  }

  private applyLibrarySort(
    qb: SelectQueryBuilder<UserGame>,
    sortBy?: LibrarySort,
  ) {
    switch (sortBy) {
      case LibrarySort.NAME:
        qb.orderBy('g.title', 'ASC');
        break;
      case LibrarySort.PLAYTIME:
      default:
        qb.orderBy('ug.playtime', 'DESC');
        break;
    }
  }

  private addTotalAchievementsSelect(qb: SelectQueryBuilder<UserGame>) {
    qb.addSelect(
      (sub) =>
        sub
          .select('COUNT(*)', 'total')
          .from(Achievement, 'a')
          .where('a.game_id = g.id'),
      'total_achievements',
    );
  }

  private addUnlockedCountSelect(qb: SelectQueryBuilder<UserGame>) {
    qb.addSelect(
      (sub) =>
        sub
          .select('COUNT(*)', 'unlocked')
          .from('User_Achievement', 'ua')
          .innerJoin('ua.achievement', 'ac')
          .where('ua.user_id = :userId')
          .andWhere('ua.obtained IS NOT NULL')
          .andWhere('ac.game_id = g.id'),
      'unlocked_count',
    );
  }

  private addLockedAchievementsSelect(
    qb: SelectQueryBuilder<UserGame>,
    userId: number,
  ) {
    qb.addSelect(
      (sub) =>
        sub
          .select('array_agg(a.global_percent)', 'locked_percents')
          .from(Achievement, 'a')
          .where('a.game_id = g.id')
          .andWhere((qb2) => {
            const obtainedSq = qb2
              .subQuery()
              .select('ua.achievement_id')
              .from('User_Achievement', 'ua')
              .where('ua.user_id = :userId')
              .andWhere('ua.obtained IS NOT NULL')
              .getQuery();
            return `a.id NOT IN ${obtainedSq}`;
          }),
      'locked_achievements',
    );
  }
}
