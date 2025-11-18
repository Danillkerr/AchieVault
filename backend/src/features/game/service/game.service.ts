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

  async findOrCreateGame(
    steamGame: IGameSteamData,
    transactionManager?: EntityManager,
  ): Promise<Game> {
    return this.gameRepository.findOrCreateBySteamId(
      steamGame,
      transactionManager,
    );
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

  async bulkCreateGames(
    gamesData: IGame[],
    transactionManager?: EntityManager,
  ): Promise<Game[]> {
    return this.gameRepository.bulkCreate(gamesData, transactionManager);
  }
}
