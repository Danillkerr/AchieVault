import { Injectable } from '@nestjs/common';
import { BaseApiService } from '../../entities/api.service.base';
import { HttpService } from '@nestjs/axios';
import { ISourceGameSummary } from '../../../../core/interfaces/user-source/user-source.interface';
import type { ISteamConfig } from '../interfaces/steam-config.interface';

@Injectable()
export class SteamService extends BaseApiService {
  private readonly steamConfig: ISteamConfig;

  constructor(
    protected httpService: HttpService,
    private config: ISteamConfig,
  ) {
    super(httpService);

    this.steamConfig = config;
  }

  private async _querySteam(
    endpoint: string,
    params: any,
    baseUrl?: string,
  ): Promise<any> {
    const url = `${baseUrl || this.steamConfig.steamApiUrl}/${endpoint}`;
    try {
      return await this._makeGetRequest(url, params);
    } catch (error) {
      return undefined;
    }
  }

  async getOwnedGamesFromSteam(steamid: string): Promise<ISourceGameSummary> {
    const endpoint = `IPlayerService/GetOwnedGames/v0001/`;
    const params = {
      key: this.steamConfig.steamApiKey,
      steamid: steamid,
      include_played_free_games: true,
      format: 'json',
    };

    const response = await this._querySteam(endpoint, params);

    return response?.response;
  }

  async getPlayerGameAchievements(
    steamId: string,
    appId: number,
  ): Promise<any> {
    const endpoint = `ISteamUserStats/GetPlayerAchievements/v0001/`;
    const params = {
      key: this.steamConfig.steamApiKey,
      steamid: steamId,
      appid: appId,
      format: 'json',
    };
    const response = await this._querySteam(endpoint, params);

    return response?.playerstats;
  }

  async getFriendList(steamId: string): Promise<string[]> {
    const endpoint = `ISteamUser/GetFriendList/v0001/`;
    const params = {
      key: this.steamConfig.steamApiKey,
      steamid: steamId,
      relationship: 'friend',
      format: 'json',
    };
    const response = await this._querySteam(endpoint, params);

    return (
      response?.friendslist?.friends.map(
        (friend: { steamid: string }) => friend.steamid,
      ) || []
    );
  }

  async getTopPlayedGames(limit: number = 10): Promise<any[]> {
    const endpoint = 'ISteamChartsService/GetGamesByConcurrentPlayers/v1/';
    const params = { key: this.steamConfig.steamApiKey };

    const response = await this._querySteam(endpoint, params);

    return response?.response?.ranks?.slice(0, limit).map((item: any) => ({
      steamId: item.appid.toString(),
      currentPlayers: item.concurrent_in_game,
      rank: item.rank,
    }));
  }

  async getGameSchema(appId: string): Promise<any[]> {
    const endpoint = 'ISteamUserStats/GetSchemaForGame/v2/';
    const params = { key: this.steamConfig.steamApiKey, appid: appId };

    const response = await this._querySteam(endpoint, params);

    return response?.game?.availableGameStats?.achievements || [];
  }

  async searchGames(query: string): Promise<any[]> {
    const endpoint = 'storesearch/';
    const params = { term: query, l: 'english', cc: 'US' };

    const response = await this._querySteam(
      endpoint,
      params,
      this.steamConfig.steamApiStoreUrl,
    );

    return response?.items || [];
  }

  async getGlobalAchievementPercentages(appId: string): Promise<any[]> {
    const endpoint =
      'ISteamUserStats/GetGlobalAchievementPercentagesForApp/v2/';
    const params = { gameid: appId };

    const response = await this._querySteam(endpoint, params);

    return response?.achievementpercentages?.achievements || [];
  }
}
