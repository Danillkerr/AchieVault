import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserGame } from 'src/features/users/entities/user-game.entity';
import { EntityManager, Repository } from 'typeorm';
import { UserGameRepository } from '../abstracts/user-game.repository.abstract';
import { IUserGameUpsert } from '../../interfaces/user-game.interface';
import { BaseTypeOrmRepository } from 'src/core/repositories/base.repository';

@Injectable()
export class TypeOrmUserGameRepository
  extends BaseTypeOrmRepository<UserGame>
  implements UserGameRepository
{
  constructor(
    @InjectRepository(UserGame)
    private readonly userGameRepo: Repository<UserGame>,
  ) {
    super(userGameRepo);
  }

  async getAllUserGames(
    userId: number,
    transactionManager?: EntityManager,
  ): Promise<UserGame[]> {
    const manager = this.getManager(transactionManager);
    return manager.find(UserGame, {
      where: { user: { id: userId } },
      relations: {
        game: true,
      },
    });
  }

  async getOwnedSteamIds(
    userId: number,
    transactionManager?: EntityManager,
  ): Promise<string[]> {
    const manager = this.getManager(transactionManager);
    const userGames: { steamid: string }[] = await manager
      .createQueryBuilder(UserGame, 'User_Game')
      .leftJoin('User_Game.game', 'Game')
      .select('Game.steam_id', 'steamid')
      .where('User_Game.user_id = :userId', { userId })
      .getRawMany();

    return userGames.map((game) => game.steamid);
  }

  async updatePlaytime(
    userGameId: number,
    newPlaytime: number,
    transactionManager?: EntityManager,
  ): Promise<void> {
    const manager = this.getManager(transactionManager);
    await manager.update(
      UserGame,
      { id: userGameId },
      { playtime: newPlaytime },
    );
  }

  async bulkUpsert(
    userId: number,
    games: IUserGameUpsert[],
    transactionManager?: EntityManager,
  ): Promise<void> {
    if (games.length === 0) return;

    const steamIds = games.map((g) => g.steam_id);
    const playtimes = games.map((g) => g.playtime);

    const sql = `
      INSERT INTO "User_Game" (user_id, game_id, playtime) 
    SELECT
      $1 AS user_id,
      g.id AS game_id,
      NULL AS playtime
    FROM
      unnest($2::text[], $3::int[]) AS s(steam_id, playtime)
    
    INNER JOIN "Game" g ON g.steam_id = s.steam_id
    
    ON CONFLICT (user_id, game_id) DO UPDATE
    SET
      playtime = EXCLUDED.playtime;
    `;

    const manager = this.getManager(transactionManager);
    await manager.query(sql, [userId, steamIds, playtimes]);
  }
}
