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

  async findOrCreateBySteamId(
    steamGame: IGameSteamData,
    transactionManager?: EntityManager,
  ): Promise<Game> {
    const manager = this.getManager(transactionManager);
    const steamIdString = steamGame.appid.toString();

    await manager.upsert(
      Game,
      {
        steam_id: steamIdString,
        title: steamGame.name,
      },
      ['steam_id'],
    );

    const game = await manager.findOneBy(Game, { steam_id: steamIdString });
    return game!;
  }

  async bulkCreate(
    gamesData: IGame[],
    transactionManager?: EntityManager,
  ): Promise<Game[]> {
    if (gamesData.length === 0) return [];
    const manager = this.getManager(transactionManager);

    const games = manager.create(Game, gamesData);
    return manager.save(Game, games);
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

  async findBySteamIds(
    steamIds: string[],
    transactionManager?: EntityManager,
  ): Promise<Game[]> {
    if (steamIds.length === 0) return [];
    const manager = this.getManager(transactionManager);

    return manager.find(Game, {
      where: {
        steam_id: In(steamIds),
      },
    });
  }

  async getAggregateStats(gameIds: number[]): Promise<GameStatsResult> {
    if (gameIds.length === 0) return { totalTime: 0, totalAchievements: 0 };

    const manager = this.getManager();

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
