import { Game } from '../../entities/game.entity';
import { IGameSteamData } from '../../interfaces/game-steam-data.interface';
import { IGame } from '../../../../core/interfaces/games/game.interface';
import { EntityManager } from 'typeorm';

export abstract class GameRepository {
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
}
