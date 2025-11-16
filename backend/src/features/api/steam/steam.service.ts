import { Injectable } from '@nestjs/common';
import { BaseApiService } from '../entities/api.service.base';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { ISteamOwnedGamesSummary } from 'src/core/interfaces/steam/steam-owned-games.interface';

@Injectable()
export class SteamService extends BaseApiService {
  private readonly steamApiUrl: string;
  private readonly apiKey: string;

  constructor(
    protected httpService: HttpService,
    private configService: ConfigService,
  ) {
    super(httpService);

    const steamKey: string | undefined =
      this.configService.get<string>('STEAM_API_KEY');
    const steamApiUrl: string | undefined =
      this.configService.get<string>('STEAM_API_URL');
    if (!steamKey || !steamApiUrl) {
      throw new Error(
        'STEAM_API_KEY or STEAM_API_URL is not set in environment variables.',
      );
    } else {
      this.apiKey = steamKey;
      this.steamApiUrl = steamApiUrl;
    }
  }

  private async _querySteam(endpoint: string, params: any): Promise<any> {
    const url = `${this.steamApiUrl}/${endpoint}`;
    try {
      return await this._makeGetRequest(url, params);
    } catch (error) {
      return undefined;
    }
  }

  async getOwnedGamesFromSteam(
    steamid: string,
  ): Promise<ISteamOwnedGamesSummary> {
    const endpoint = `IPlayerService/GetOwnedGames/v0001/`;
    const params = {
      key: this.apiKey,
      steamid: steamid,
      include_played_free_games: true,
      format: 'json',
    };

    const response = await this._querySteam(endpoint, params);

    return response?.response;
  }
}
