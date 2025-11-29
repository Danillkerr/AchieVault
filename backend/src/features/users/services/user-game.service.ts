import { Injectable, Inject } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { UserGameRepository } from '../repositories/abstracts/user-game.repository.abstract';
import { UserGame } from '../entities/user-game.entity';
import { ISteamOwnedGame } from '../../../core/interfaces/user-source/user-source.interface';
import { IUserGameUpsert } from '../interfaces/user-game.interface';
import { GetUserLibraryDto } from '../dto/get-user-library.dto';

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

  async findByGameIds(
    userId: number,
    gameIds: number[],
    transactionManager?: EntityManager,
  ): Promise<UserGame[]> {
    return this.userGameRepository.findByGameIds(
      userId,
      gameIds,
      transactionManager,
    );
  }

  async getGamesForRecommendation(
    userId: number,
    gameIds: number[],
    transactionManager?: EntityManager,
  ): Promise<any[]> {
    return this.userGameRepository.findGamesForRecommendation(
      userId,
      gameIds,
      transactionManager,
    );
  }

  async getUserLibrary(userId: number, dto: GetUserLibraryDto) {
    const [entities, total] = await this.userGameRepository.findLibrary(
      userId,
      dto,
    );

    const data = entities.map((ug) => ({
      id: ug.game.id,
      steam_id: ug.game.steam_id,
      title: ug.game.title,
      logo: ug.game.logo,
      playtime_forever: ug.playtime,
    }));

    return {
      data,
      meta: {
        totalItems: total,
        itemCount: data.length,
        itemsPerPage: dto.limit,
        totalPages: Math.ceil(total / dto.limit),
        currentPage: dto.page,
      },
    };
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
    if (steamGames.length === 0) return;

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
