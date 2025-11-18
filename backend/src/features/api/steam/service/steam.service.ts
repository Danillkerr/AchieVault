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

  private async _querySteam(endpoint: string, params: any): Promise<any> {
    const url = `${this.steamConfig.steamApiUrl}/${endpoint}`;
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
}
