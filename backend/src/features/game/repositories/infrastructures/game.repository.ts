import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, In, Repository } from 'typeorm';
import { Game } from 'src/features/game/entities/game.entity';
import { IGame } from 'src/core/interfaces/games/game.interface';
import { BaseTypeOrmRepository } from '../../../../core/repositories/base.repository';
import { GameRepository } from '../abstracts/game.repository.abstract';
import { IGameSteamData } from '../../interfaces/game-steam-data.interface';
import { Achievement } from '../../entities/achievement.entity';
import { GameStatsResult } from '../../interfaces/game-stats.interface';

@Injectable()
export class TypeOrmGameRepository
  extends BaseTypeOrmRepository<Game>
  implements GameRepository
{
  constructor(
    @InjectRepository(Game)
    private readonly gameRepo: Repository<Game>,
  ) {
    super(gameRepo);
  }

  async findByIds(ids: number[], tm?: EntityManager): Promise<Game[]> {
    if (ids.length === 0) return [];
    return this.find({ where: { id: In(ids) } }, tm);
  }

  async findBySteamIds(
    steamIds: string[],
    tm?: EntityManager,
  ): Promise<Game[]> {
    if (steamIds.length === 0) return [];
    return this.find({ where: { steam_id: In(steamIds) } }, tm);
  }

  async findOneBySteamId(
    steamId: string,
    options?: { withAchievements?: boolean },
    tm?: EntityManager,
  ): Promise<Game | null> {
    return this.findOne(
      {
        where: { steam_id: steamId },
        relations: options?.withAchievements ? ['achievements'] : undefined,
      },
      tm,
    );
  }

  async findOrCreateBySteamId(
    steamGame: IGameSteamData,
    tm?: EntityManager,
  ): Promise<Game> {
    const steamIdString = steamGame.appid.toString();

    await this.upsert(
      {
        steam_id: steamIdString,
        title: steamGame.name,
      },
      ['steam_id'],
      tm,
    );

    const game = await this.findOne({ where: { steam_id: steamIdString } }, tm);
    return game!;
  }

  async bulkCreate(gamesData: IGame[], tm?: EntityManager): Promise<Game[]> {
    if (gamesData.length === 0) return [];
    return this.saveMany(gamesData, tm);
  }

  async findMissingSteamIds(
    steamIds: string[],
    transactionManager?: EntityManager,
  ): Promise<string[]> {
    if (steamIds.length === 0) return [];
    const manager = this.getManager(transactionManager);

    const subQueryString = `(SELECT unnest(:steamIds::text[]) AS id_from_list)`;

    const results: { id_from_list: string }[] = await manager
      .createQueryBuilder()
      .select('s.id_from_list', 'id_from_list')
      .from(subQueryString, 's')
      .leftJoin('Game', 'g', 'g.steam_id = s.id_from_list')
      .where('g.id IS NULL')
      .setParameters({ steamIds })
      .getRawMany();

    return results.map((row) => row.id_from_list);
  }

  async getAggregateStats(
    gameIds: number[],
    tm?: EntityManager,
  ): Promise<GameStatsResult> {
    if (gameIds.length === 0) return { totalTime: 0, totalAchievements: 0 };

    const manager = this.getManager(tm);

    const { sumTime } = await manager
      .createQueryBuilder(Game, 'g')
      .select('SUM(g.time_to_beat)', 'sumTime')
      .where('g.id IN (:...ids)', { ids: gameIds })
      .getRawOne();

    const achResult = await manager
      .createQueryBuilder(Achievement, 'a')
      .select('COUNT(a.id)', 'cnt')
      .where('a.game IN (:...ids)', { ids: gameIds })
      .getRawOne();

    return {
      totalTime: parseInt(sumTime, 10) || 0,
      totalAchievements: parseInt(achResult?.cnt, 10) || 0,
    };
  }
}
