import { EntityManager } from 'typeorm';
import { UserGame } from '../../entities/user-game.entity';
import { IUserGameUpsert } from '../../interfaces/user-game.interface';
import { GetUserLibraryDto } from '../../dto/get-user-library.dto';

export abstract class UserGameRepository {
  abstract getAllUserGames(
    userId: number,
    transactionManager?: EntityManager,
  ): Promise<UserGame[]>;

  abstract getOwnedSteamIds(
    userId: number,
    transactionManager?: EntityManager,
  ): Promise<string[]>;

  abstract updatePlaytime(
    userGameId: number,
    newPlaytime: number,
    transactionManager?: EntityManager,
  ): Promise<void>;

  abstract bulkUpsert(
    userId: number,
    games: IUserGameUpsert[],
    transactionManager?: EntityManager,
  ): Promise<void>;

  abstract findLibrary(
    userId: number,
    options: GetUserLibraryDto,
  ): Promise<[UserGame[], number]>;

  abstract findGamesForRecommendation(
    userId: number,
    gameIds: number[],
    transactionManager?: EntityManager,
  ): Promise<any[]>;

  abstract findByGameIds(
    userId: number,
    gameIds: number[],
  ): Promise<UserGame[]>;
}
