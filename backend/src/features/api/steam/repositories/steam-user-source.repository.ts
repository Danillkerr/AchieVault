import { Injectable, Logger } from '@nestjs/common';
import { UserSourceRepository } from 'src/core/repositories/user-source.repository.abstract';
import { SteamService } from '../service/steam.service';
import { ISourceGameSummary } from 'src/core/interfaces/user-source/user-source.interface';
import { ISteamPlayerAchievement } from 'src/core/interfaces/games/player-achievement.interface';

@Injectable()
export class SteamUserSourceRepository implements UserSourceRepository {
  private readonly logger = new Logger(SteamUserSourceRepository.name);
  constructor(private readonly steamApi: SteamService) {}

  async getOwnedGames(steamId: string): Promise<ISourceGameSummary> {
    try {
      const response: ISourceGameSummary =
        await this.steamApi.getOwnedGamesFromSteam(steamId);

      if (!response || !response.games) {
        this.logger.warn(
          `No games found for SteamID ${steamId} (Profile might be private)`,
        );
        return { game_count: 0, games: [] };
      }
      return response;
    } catch (error) {
      this.logger.error(
        `Failed to fetch owned games for ${steamId}: ${error.message}`,
      );
      return { game_count: 0, games: [] };
    }
  }

  async getGameAchievements(
    steamId: string,
    appId: string,
  ): Promise<ISteamPlayerAchievement[]> {
    try {
      const response = await this.steamApi.getPlayerGameAchievements(
        steamId,
        Number(appId),
      );

      if (!response || !response.achievements) return [];

      return response.achievements;
    } catch (error) {
      this.logger.warn(
        `Failed to fetch achievements for app ${appId}: ${error.message}`,
      );
      return [];
    }
  }

  async getFriendIds(steamId: string): Promise<string[]> {
    try {
      const friends = await this.steamApi.getFriendList(steamId);
      return friends || [];
    } catch (error) {
      this.logger.warn(
        `Failed to fetch friends for ${steamId}: ${error.message}`,
      );
      return [];
    }
  }

  async getTopPlayedGames(limit: number): Promise<any[]> {
    try {
      return await this.steamApi.getTopPlayedGames(limit);
    } catch (error) {
      this.logger.error(`Failed to fetch top played games: ${error.message}`);
      return [];
    }
  }

  async getGameSchema(appId: string): Promise<any[]> {
    try {
      return await this.steamApi.getGameSchema(appId);
    } catch (error) {
      return [];
    }
  }

  async searchGames(query: string): Promise<any[]> {
    try {
      return await this.steamApi.searchGames(query);
    } catch (error) {
      this.logger.error(
        `Failed to search games for "${query}": ${error.message}`,
      );
      return [];
    }
  }

  async getAchievementPercentages(appId: string): Promise<any> {
    try {
      return await this.steamApi.getGlobalAchievementPercentages(appId);
    } catch (error) {
      return [];
    }
  }

  async getRecentlyPlayedGames(steamId: string, limit: number): Promise<any[]> {
    try {
      const recent = await this.steamApi.getRecentlyPlayedGames(steamId, limit);
      return recent || [];
    } catch (error) {
      this.logger.error(
        `Failed to fetch recent games for ${steamId}: ${error.message}`,
      );
      return [];
    }
  }
}
