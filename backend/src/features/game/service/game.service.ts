import { Inject, Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { Game } from 'src/features/game/entities/game.entity';
import { IGame } from 'src/core/interfaces/games/game.interface';
import { IGameSteamData } from '../interfaces/game-steam-data.interface';
import { GameRepository } from '../repositories/abstracts/game.repository.abstract';

@Injectable()
export class GameService {
  constructor(
    @Inject(GameRepository)
    private readonly gameRepository: GameRepository,
  ) {}

  async findBySteamIds(
    steamIds: string[],
    transactionManager?: EntityManager,
  ): Promise<Game[]> {
    return this.gameRepository.findBySteamIds(steamIds, transactionManager);
  }

  async findOneBySteamId(
    steamId: string,
    options?: { withAchievements?: boolean },
  ): Promise<Game | null> {
    return this.gameRepository.findOneBySteamId(steamId, options);
  }

  async findByIds(
    ids: number[],
    transactionManager?: EntityManager,
  ): Promise<Game[]> {
    return this.gameRepository.findByIds(ids, transactionManager);
  }

  async findNewSteamIds(
    steamIds: string[],
    transactionManager?: EntityManager,
  ): Promise<string[]> {
    return this.gameRepository.findMissingSteamIds(
      steamIds,
      transactionManager,
    );
  }

  async getRoadmapStats(gameIds: number[]) {
    return this.gameRepository.getAggregateStats(gameIds);
  }

  async findOrCreateGame(
    steamGame: IGameSteamData,
    transactionManager?: EntityManager,
  ): Promise<Game> {
    return this.gameRepository.findOrCreateBySteamId(
      steamGame,
      transactionManager,
    );
  }

  async bulkCreateGames(
    gamesData: IGame[],
    transactionManager?: EntityManager,
  ): Promise<Game[]> {
    return this.gameRepository.bulkCreate(gamesData, transactionManager);
  }
}
