import { Injectable, Inject } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { UserGameRepository } from '../repositories/abstracts/user-game.repository.abstract';
import { UserGame } from '../entities/user-game.entity';
import { ISteamOwnedGame } from '../../../core/interfaces/user-source/user-source.interface';
import { IUserGameUpsert } from '../interfaces/user-game.interface';

@Injectable()
export class UserGameService {
  constructor(
    @Inject(UserGameRepository)
    private readonly userGameRepository: UserGameRepository,
  ) {}

  async getAllUserGames(
    userId: number,
    transactionManager?: EntityManager,
  ): Promise<UserGame[]> {
    return this.userGameRepository.getAllUserGames(userId, transactionManager);
  }

  async getOwnedGameSteamIds(
    userId: number,
    transactionManager?: EntityManager,
  ): Promise<string[]> {
    return this.userGameRepository.getOwnedSteamIds(userId, transactionManager);
  }

  async updateUserGamePlaytime(
    userGameId: number,
    newPlaytime: number,
    transactionManager?: EntityManager,
  ): Promise<void> {
    return this.userGameRepository.updatePlaytime(
      userGameId,
      newPlaytime,
      transactionManager,
    );
  }

  async bulkUpsertFromSteam(
    userId: number,
    steamGames: ISteamOwnedGame[],
    transactionManager?: EntityManager,
  ): Promise<void> {
    const gamesToUpsert: IUserGameUpsert[] = steamGames.map((game) => ({
      steam_id: game.appid.toString(),
      playtime: game.playtime_forever,
    }));

    return this.userGameRepository.bulkUpsert(
      userId,
      gamesToUpsert,
      transactionManager,
    );
  }
}
