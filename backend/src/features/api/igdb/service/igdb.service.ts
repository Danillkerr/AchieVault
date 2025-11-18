import { Injectable } from '@nestjs/common';
import { BaseApiService } from '../../entities/api.service.base';
import { HttpService } from '@nestjs/axios';
import type {
  IgdbConfig,
  IIgdbHeader,
} from '../interfaces/igdb-config.interface';
import type { IGameIgdb } from '../interfaces/game-igdb.interface';

@Injectable()
export class IgdbService extends BaseApiService {
  private readonly igdbConfig: IgdbConfig;
  private readonly commonHeaders: IIgdbHeader;

  constructor(
    protected httpService: HttpService,
    private config: IgdbConfig,
  ) {
    super(httpService);

    this.igdbConfig = config;

    this.commonHeaders = {
      'Client-ID': this.igdbConfig.clientId,
      Authorization: `Bearer ${this.igdbConfig.authorization}`,
    };
  }

  private async _queryIgdb(
    endpoint: string,
    queryBody: string,
  ): Promise<any | undefined> {
    const url = `${this.igdbConfig.apiUrl}/${endpoint}`;
    try {
      return await this._makePostRequest(url, queryBody, this.commonHeaders);
    } catch (error) {
      return undefined;
    }
  }

  async getGameIGDBId(steamid: string): Promise<number | undefined> {
    const endpoint = 'external_games';
    const data = `fields game; where uid = "${steamid}" & url = "https://store.steampowered.com/app/${steamid}";`;

    const response = await this._queryIgdb(endpoint, data);

    this.logger.log(
      `IGDB response for Steam ID ${steamid}: ${JSON.stringify(response)}`,
    );

    return response?.[0]?.game;
  }

  async getGameIGDB(igdbId: number): Promise<IGameIgdb | undefined> {
    const endpoint = `games`;
    const data = `fields id, name, summary, total_rating, url; where id = ${igdbId};`;

    const response = await this._queryIgdb(endpoint, data);

    return response?.[0];
  }

  async getTimeToBeatFromIGDB(igdbId: number): Promise<number | undefined> {
    const endpoint = `game_time_to_beats`;
    const data = `fields completely; where game_id = ${igdbId};`;

    const response = await this._queryIgdb(endpoint, data);

    return response?.[0]?.completely;
  }

  async getGameCover(igdbId: number): Promise<string | undefined> {
    const endpoint = `covers`;
    const data = `fields image_id; where game = ${igdbId};`;

    const response = await this._queryIgdb(endpoint, data);

    return response?.[0]?.image_id;
  }
}
