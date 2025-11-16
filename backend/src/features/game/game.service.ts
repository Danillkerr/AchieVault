import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { Game } from 'src/core/entities/game.entity';
import { IGame } from 'src/core/interfaces/games/game.interface';

@Injectable()
export class GameService {
  constructor(
    @InjectRepository(Game) private gameRepository: Repository<Game>,
    private dataSource: DataSource,
  ) {}

  async findOrCreateGame(steamGame: any): Promise<any> {
    const steamIdString = steamGame.appid.toString();
    let game = await this.gameRepository.findOneBy({ steam_id: steamIdString });

    if (game) {
      return game;
    }
  }

  async findNewSteamIds(steamIds: string[]): Promise<string[]> {
    if (steamIds.length === 0) {
      return [];
    }

    const subQueryString = `(SELECT unnest(:steamIds::text[]) AS id_from_list)`;

    const results: { id_from_list: string }[] = await this.dataSource
      .createQueryBuilder()
      .select('s.id_from_list', 'id_from_list')
      .from(subQueryString, 's')
      .leftJoin('Game', 'g', 'g.steam_id = s.id_from_list')
      .where('g.id IS NULL')
      .setParameters({ steamIds })
      .getRawMany();

    return results.map((row) => row.id_from_list);
  }

  async bulkCreateGames(
    gamesData: IGame[],
    manager: EntityManager,
  ): Promise<Game[]> {
    if (gamesData.length === 0) return [];
    const games = manager.create(Game, gamesData);
    return manager.save(Game, games);
  }
}
