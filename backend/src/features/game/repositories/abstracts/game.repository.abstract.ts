import { Game } from '../../entities/game.entity';
import { IGameSteamData } from '../../interfaces/game-steam-data.interface';
import { IGame } from '../../../../core/interfaces/games/game.interface';
import { EntityManager } from 'typeorm';
import { GameStatsResult } from '../../interfaces/game-stats.interface';

export abstract class GameRepository {
  abstract findByIds(
    ids: number[],
    transactionManager?: EntityManager,
  ): Promise<Game[]>;

  abstract findBySteamIds(
    steamIds: string[],
    transactionManager?: EntityManager,
  ): Promise<Game[]>;

  abstract findOneBySteamId(
    steamId: string,
    options?: { withAchievements?: boolean },
    transactionManager?: EntityManager,
  ): Promise<Game | null>;

  abstract findOrCreateBySteamId(
    steamGame: IGameSteamData,
    transactionManager?: EntityManager,
  ): Promise<Game>;

  abstract bulkCreate(
    gamesData: IGame[],
    transactionManager?: EntityManager,
  ): Promise<Game[]>;

  abstract findMissingSteamIds(
    steamIds: string[],
    transactionManager?: EntityManager,
  ): Promise<string[]>;

  abstract getAggregateStats(
    gameIds: number[],
    transactionManager?: EntityManager,
  ): Promise<GameStatsResult>;
}
