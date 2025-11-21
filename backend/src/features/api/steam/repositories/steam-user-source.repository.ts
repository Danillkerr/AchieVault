import { Injectable } from '@nestjs/common';
import { UserSourceRepository } from 'src/core/repositories/user-source.repository.abstract';
import { SteamService } from '../service/steam.service';
import { ISourceGameSummary } from 'src/core/interfaces/user-source/user-source.interface';
import { ISteamPlayerAchievement } from 'src/core/interfaces/games/player-achievement.interface';

@Injectable()
export class SteamUserSourceRepository implements UserSourceRepository {
  constructor(private readonly steamApi: SteamService) {}

  async getOwnedGames(steamId: string): Promise<ISourceGameSummary> {
    const response: ISourceGameSummary =
      await this.steamApi.getOwnedGamesFromSteam(steamId);
    return response;
  }

  async getGameAchievements(
    steamId: string,
    appId: string,
  ): Promise<ISteamPlayerAchievement[]> {
    const response = await this.steamApi.getPlayerGameAchievements(
      steamId,
      Number(appId),
    );

    if (!response || !response.achievements) return [];

    return response.achievements;
  }

  async getFriendIds(steamId: string): Promise<string[]> {
    return this.steamApi.getFriendList(steamId);
  }

  async getTopPlayedGames(limit: number): Promise<any[]> {
    return this.steamApi.getTopPlayedGames(limit);
  }

  async getGameSchema(appId: string): Promise<any[]> {
    return this.steamApi.getGameSchema(appId);
  }
}
