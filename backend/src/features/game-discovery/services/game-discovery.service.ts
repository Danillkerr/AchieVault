import { Injectable, Logger } from '@nestjs/common';
import { GameService } from '../../game/service/game.service';
import { GameEnrichmentService } from '../../sync/services/game-enrichment.service';
import { UserSourceRepository } from '../../../core/repositories/user-source.repository.abstract';
import { Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { UserAchievementService } from '../../users/services/user-achievement.service';
import { UsersService } from '../../users/services/users.service';

@Injectable()
export class GameDiscoveryService {
  private readonly logger = new Logger(GameDiscoveryService.name);
  private readonly IGDB_DELAY_MS = 1100;

  constructor(
    private userSource: UserSourceRepository,
    private readonly gameService: GameService,
    private readonly enrichmentService: GameEnrichmentService,
    private readonly userAchievementService: UserAchievementService,
    private readonly userService: UsersService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async getPopularGames() {
    const topGames = await this.userSource.getTopPlayedGames(15);
    const steamIds = topGames.map((g) => g.steamId);

    return this._processGamesList(steamIds, topGames);
  }

  async searchGames(query: string) {
    const searchResults = await this.userSource.searchGames(query);
    const steamIds = searchResults.map((g) => g.id);

    return this._processGamesList(steamIds, searchResults);
  }

  private async _processGamesList(steamIds: string[], sourceList: any[]) {
    if (steamIds.length === 0) return [];

    const missingIds = await this.gameService.findNewSteamIds(steamIds);

    if (missingIds.length > 0) {
      for (const id of missingIds) {
        await this.enrichmentService.syncGameWithAchievements(id);

        await this._wait(this.IGDB_DELAY_MS);
      }
    }

    const allDbGames = await this.gameService.findBySteamIds(steamIds);

    return sourceList.map((stat) => {
      const dbGame = allDbGames.find(
        (g) => g.steam_id == (stat.id || stat.steamId),
      );

      return {
        ...stat,
        ...dbGame,
      };
    });
  }

  private _wait(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async getGameAchievementsWithGlobalStats(steamId: string) {
    const cacheKey = `achievements_global:${steamId}`;

    const cached = await this.cacheManager.get(cacheKey);
    if (cached) return cached;

    const [schema, globalStats] = await Promise.all([
      this.userSource.getGameSchema(steamId),
      this.userSource.getAchievementPercentages(steamId),
    ]);

    if (!schema || schema.length === 0) return [];

    const statsMap = new Map(globalStats.map((s) => [s.name, s.percent]));

    const result = schema.map((ach) => ({
      apiName: ach.name,
      displayName: ach.displayName,
      description: ach.description,
      icon: ach.icon,
      iconGray: ach.icongray,
      hidden: ach.hidden,
      globalPercent: statsMap.get(ach.name) || 0,
    }));

    await this.cacheManager.set(cacheKey, result, 3600 * 24000);

    return result;
  }

  async getUserRecentGames(userId: number) {
    const user = await this.userService.findById(userId);

    if (!user) return [];

    const recentGames = await this.userSource.getRecentlyPlayedGames(
      user.steamid,
      5,
    );
    if (!recentGames.length) return [];

    const result = await Promise.all(
      recentGames.map(async (steamGame) => {
        const dbGame = (
          await this.gameService.findBySteamIds([steamGame.steamId])
        )[0];

        const userAchievements =
          await this.userAchievementService.getUserProgress(
            userId,
            steamGame.steamId,
          );

        const total = userAchievements.length;
        const unlocked = userAchievements.filter(
          (ua) => ua.obtained !== null,
        ).length;
        const percent = total > 0 ? Math.round((unlocked / total) * 100) : 0;

        return {
          id: dbGame?.id || null,
          steam_id: steamGame.steamId,

          title: dbGame?.title || steamGame.name,
          logo: dbGame?.logo || '',

          playtime_forever: steamGame.playtime_forever,

          achievements_total: total,
          achievements_unlocked: unlocked,
          completion_percent: percent,
        };
      }),
    );

    return result;
  }
}
