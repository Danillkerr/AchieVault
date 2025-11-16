import { Injectable, Logger } from '@nestjs/common';
import { User } from 'src/core/entities/user.entity';
import { UsersService } from '../users/users.service';
import {
  ISteamOwnedGame,
  ISteamOwnedGamesSummary,
} from 'src/core/interfaces/steam/steam-owned-games.interface';
import { DataSource, EntityManager } from 'typeorm';
import { GameService } from '../game/game.service';
import { IGame } from '../../core/interfaces/games/game.interface';
import { SteamService } from '../api/steam/steam.service';
import { IgdbService } from '../api/igdb/igdb.service';

@Injectable()
export class SyncService {
  private readonly logger = new Logger(SyncService.name);
  constructor(
    private usersService: UsersService,
    private gamesService: GameService,
    private steamService: SteamService,
    private igdbService: IgdbService,
    private dataSource: DataSource,
  ) {}

  async syncUserGames(user: User): Promise<void> {
    this.logger.log(`Syncing games for ${user.name} (${user.steamid})...`);

    const prerequisites = await this._getSyncPrerequisites(user);

    if (!prerequisites.shouldSync) {
      this.logger.log(
        `Skipping sync for ${user.name}: ${prerequisites.message}`,
      );
      return;
    }

    const { userUnlinkedGames, newDBGames, allGamesCount } = prerequisites;

    if (!userUnlinkedGames) return;

    const enrichedGames = await this._enrichNewGames(newDBGames);

    await this._performSyncTransaction(
      user,
      userUnlinkedGames,
      enrichedGames,
      allGamesCount,
    );

    this.logger.log(`Game sync finished for ${user.name}.`);
  }

  private async _getSyncPrerequisites(user: User) {
    const userGamesSummary: ISteamOwnedGamesSummary =
      await this.steamService.getOwnedGamesFromSteam(user.steamid);

    if (userGamesSummary.games.length === 0) {
      return { shouldSync: false, message: 'No games found on Steam' };
    }

    if (user.game_count === userGamesSummary.game_count) {
      return { shouldSync: false, message: 'No change in game count' };
    }

    const userGames: ISteamOwnedGame[] = userGamesSummary.games.map((g) => ({
      appid: g.appid,
      playtime_forever: g.playtime_forever,
      rtime_last_played: g.rtime_last_played,
    }));

    const userLinkedIds: string[] =
      await this.usersService.getOwnedGameSteamIds(user.id);

    const userUnlinkedGames = userGames.filter(
      (game) => !userLinkedIds.includes(game.appid.toString()),
    );

    const newDBGames = await this.gamesService.findNewSteamIds(
      userUnlinkedGames.map((g) => g.appid.toString()),
    );

    return {
      shouldSync: true,
      userUnlinkedGames,
      newDBGames,
      allGamesCount: userGamesSummary.game_count,
    };
  }

  private async _enrichNewGames(
    steamIds: string[] | undefined,
  ): Promise<IGame[]> {
    if (!steamIds || steamIds.length === 0) {
      return [];
    }

    this.logger.log(`Enriching ${steamIds.length} new games sequentially...`);

    const enrichedGames: IGame[] = [];

    for (const id of steamIds) {
      try {
        const game = await this.igdbService.enrichGameBySteamId(id);

        enrichedGames.push(game);
      } catch (err) {
        this.logger.error(`Failed to enrich Steam ID ${id}`, err.message);
      }
    }

    this.logger.log(`Successfully enriched ${enrichedGames.length} games.`);
    return enrichedGames;
  }

  private async _performSyncTransaction(
    user: User,
    userUnlinkedGames: ISteamOwnedGame[],
    enrichedGames: IGame[],
    totalGameCount: number,
  ) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const manager = queryRunner.manager;

    try {
      this.logger.log(`Running transaction...`);

      if (enrichedGames.length > 0) {
        this.logger.log(`Creating ${enrichedGames.length} new games in DB...`);
        await this.gamesService.bulkCreateGames(enrichedGames, manager);
      }

      if (userUnlinkedGames.length > 0) {
        this.logger.log(
          `Linking ${userUnlinkedGames.length} new games to user...`,
        );
        await this.usersService.bulkUpsertUserGamesBySteamId(
          user.id,
          userUnlinkedGames,
          manager,
        );
      }

      this.logger.log(`Updating game count to ${totalGameCount}...`);
      await this.usersService.updateUserGameCount(
        user.id,
        totalGameCount,
        manager,
      );

      await queryRunner.commitTransaction();
      this.logger.log(`Transaction committed.`);
    } catch (err) {
      this.logger.error(`Transaction failed. Rolling back.`, err);
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
}
