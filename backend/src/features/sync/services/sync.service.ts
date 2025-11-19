import { Injectable, Logger } from '@nestjs/common';
import { User } from 'src/core/entities/user.entity';
import {
  ISourceGameSummary,
  ISteamOwnedGame,
} from '../../../core/interfaces/user-source/user-source.interface';
import { DataSource } from 'typeorm';
import { InjectQueue } from '@nestjs/bull';
import type { Queue } from 'bull';
import { Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

import { IGame } from '../../../core/interfaces/games/game.interface';
import { IGameToSync } from '../interfaces/game-to-sync.interface';

import { UserGameService } from '../../users/services/user-game.service';
import { UserAchievementService } from '../../users/services/user-achievement.service';
import { FriendListService } from '../../users/services/friend-list.service';
import { UserStatsService } from '../../users/services/user-stats.service';

import { GameService } from '../../game/service/game.service';
import { AchievementService } from '../../game/service/achievement.service';
import { GameEnrichmentService } from './game-enrichment.service';
import { UserSourceRepository } from 'src/core/repositories/user-source.repository.abstract';

@Injectable()
export class SyncService {
  private logger = new Logger(SyncService.name);
  constructor(
    private dataSource: DataSource,

    private userGameService: UserGameService,
    private userAchievementService: UserAchievementService,
    private friendListService: FriendListService,
    private userStatsService: UserStatsService,

    private gamesService: GameService,
    private achievementService: AchievementService,

    private userSource: UserSourceRepository,
    private gameEnrichmentService: GameEnrichmentService,

    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @InjectQueue('user-sync-queue') private userQueue: Queue,
  ) {}

  async triggerBackgroundSync(userId: number): Promise<void> {
    const key = `sync_cooldown:${userId}`;
    const isCooldown = await this.cacheManager.get(key);

    if (isCooldown) {
      this.logger.log(`User ${userId} is on sync cooldown. Skipping.`);
      return;
    }

    this.logger.log(`Triggering background sync for user ${userId}`);

    await this.userQueue.add('sync-user-job', { userId });

    await this.cacheManager.set(key, 'true', 1800 * 1000);
  }

  async syncUser(user: User): Promise<void> {
    await this.syncUserGames(user);
    await this.syncUsersAchievements(user);
    await this.syncUserFriends(user);
  }

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

  async syncUsersAchievements(user: User): Promise<void> {
    this.logger.log(
      `Syncing achievements for ${user.name} (${user.steamid})...`,
    );

    const [userGamesSummary, userGamesInDb] = await Promise.all([
      this.userSource.getOwnedGames(user.steamid),
      this.userGameService.getAllUserGames(user.id),
    ]);

    this.logger.log(
      `Fetched ${userGamesSummary.games.length} games from Steam for achievement sync.`,
    );

    this.logger.log(
      `Found ${userGamesInDb.length} linked games in DB for achievement sync.`,
    );

    const gamesToUpdate: IGameToSync[] = [];
    for (const steamGame of userGamesSummary.games) {
      const dbGame = userGamesInDb.find(
        (g) => g.game.steam_id === steamGame.appid.toString(),
      );

      this.logger.log(`Processing game ${steamGame.appid}...`);

      if (!dbGame) {
        this.logger.warn(
          `Game ${steamGame.appid} not in DB. Run game sync first.`,
        );
        continue;
      }

      this.logger.log(
        `Checking playtime for game ${JSON.stringify(steamGame)}...`,
      );
      this.logger.log(
        `Steam playtime: ${steamGame.playtime_forever}, DB playtime: ${dbGame.playtime}`,
      );

      if (steamGame.playtime_forever > dbGame.playtime) {
        gamesToUpdate.push({
          steam_id: steamGame.appid.toString(),
          new_playtime: steamGame.playtime_forever,
          userGame_id: dbGame.id,
          game_id: dbGame.game.id,
        });
      }
    }

    if (gamesToUpdate.length === 0) {
      this.logger.log('No new achievement progress to sync.');
      return;
    }

    this.logger.log(`Found ${gamesToUpdate.length} games with new playtime...`);

    const syncPromises = gamesToUpdate.map((game) =>
      this._syncSingleGameAchievements(user, game).catch((err) => {
        this.logger.error(`Parallel sync for ${game.steam_id} failed`, err);
      }),
    );

    await Promise.all(syncPromises);

    await this.userStatsService.recalculateUserStats(user.id);

    this.logger.log(`Achievement sync finished for ${user.name}.`);
  }

  async syncUserFriends(user: User): Promise<void> {
    this.logger.log(`Syncing friends for ${user.name}...`);

    const friendSteamIds = await this.userSource.getFriendIds(user.steamid);
    if (friendSteamIds.length === 0) return;

    await this.dataSource.transaction(async (manager) => {
      await this.friendListService.syncFriendsBySteamIds(
        user.id,
        friendSteamIds,
        manager,
      );
    });

    this.logger.log(`Successfully synced ${friendSteamIds.length} friends.`);
  }

  private async _syncSingleGameAchievements(user: User, game: any) {
    const achievementsFromApi = await this.userSource.getGameAchievements(
      user.steamid,
      game.steam_id,
    );

    if (typeof achievementsFromApi === 'undefined') {
      this.logger.warn(`No achievements found for ${game.steam_id}. Skipping.`);

      await this.dataSource.transaction(async (manager) => {
        await this.userGameService.updateUserGamePlaytime(
          game.userGame_id,
          game.new_playtime,
          manager,
        );
      });
      return;
    }

    await this.dataSource.transaction(async (manager) => {
      this.logger.log(
        `Syncing achievements for game ${JSON.stringify(game)}...`,
      );

      const achievementMap =
        await this.achievementService.bulkUpsertAchievements(
          game.game_id,
          achievementsFromApi,
          manager,
        );

      if (achievementMap) {
        await this.userAchievementService.bulkUpsertFromSteam(
          user.id,
          achievementMap,
          achievementsFromApi,
          manager,
        );
      }

      await this.userGameService.updateUserGamePlaytime(
        game.userGame_id,
        game.new_playtime,
        manager,
      );
    });
    this.logger.log(`Successfully synced ${game.steam_id}.`);
  }

  private async _getSyncPrerequisites(user: User) {
    const userGamesSummary: ISourceGameSummary =
      await this.userSource.getOwnedGames(user.steamid);

    if (userGamesSummary.games.length === 0)
      return { shouldSync: false, message: 'No games found on Steam' };

    if (user.game_count === userGamesSummary.game_count)
      return { shouldSync: false, message: 'No change in game count' };

    const userGames: ISteamOwnedGame[] = userGamesSummary.games.map((g) => ({
      appid: g.appid,
      playtime_forever: g.playtime_forever,
    }));

    const userLinkedIds: string[] =
      await this.userGameService.getOwnedGameSteamIds(user.id);

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

    const enrichedGames: IGame[] =
      await this.gameEnrichmentService.enrichGames(steamIds);

    this.logger.log(`Successfully enriched ${enrichedGames.length} games.`);
    return enrichedGames;
  }

  private async _performSyncTransaction(
    user: User,
    userUnlinkedGames: ISteamOwnedGame[],
    enrichedGames: IGame[],
    totalGameCount: number,
  ) {
    await this.dataSource.transaction(async (manager) => {
      this.logger.log(`Running transaction...`);

      if (enrichedGames.length > 0) {
        this.logger.log(`Creating ${enrichedGames.length} new games in DB...`);
        await this.gamesService.bulkCreateGames(enrichedGames, manager);
      }

      if (userUnlinkedGames.length > 0) {
        this.logger.log(
          `Linking ${userUnlinkedGames.length} new games to user...`,
        );
        await this.userGameService.bulkUpsertFromSteam(
          user.id,
          userUnlinkedGames,
          manager,
        );
      }

      this.logger.log(`Updating game count to ${totalGameCount}...`);
      await this.userStatsService.updateUserGameCount(
        user.id,
        totalGameCount,
        manager,
      );
    });
  }
}
