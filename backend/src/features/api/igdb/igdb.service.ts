import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config/dist/config.service';
import { BaseApiService } from '../entities/api.service.base';
import { HttpService } from '@nestjs/axios';
import { IIgdbHeader } from 'src/core/interfaces/igdb/igdb-header.inteface';
import { IGameIgdb } from 'src/core/interfaces/igdb/igdb-game.interface';
import { IGame } from 'src/core/interfaces/games/game.interface';

@Injectable()
export class IgdbService extends BaseApiService {
  private readonly igdbApiUrl;
  private readonly clientId: string;
  private readonly authorization: string;
  private readonly commonHeaders: IIgdbHeader;

  constructor(
    protected httpService: HttpService,
    private configService: ConfigService,
  ) {
    super(httpService);

    const igdbApiUrl: string | undefined =
      this.configService.get<string>('IGDB_API_URL');
    const clientId: string | undefined =
      this.configService.get<string>('CLIENT_ID');
    const authorization: string | undefined =
      this.configService.get<string>('AUTHORIZATION');
    if (!igdbApiUrl || !clientId || !authorization) {
      throw new Error(
        'IGDB_API_URL, CLIENT_ID, or AUTHORIZATION is not set in environment variables.',
      );
    } else {
      this.igdbApiUrl = igdbApiUrl;
      this.clientId = clientId;
      this.authorization = authorization;

      this.commonHeaders = {
        'Client-ID': this.clientId,
        Authorization: `Bearer ${this.authorization}`,
      };
    }
  }

  private async _queryIgdb(
    endpoint: string,
    queryBody: string,
  ): Promise<any | undefined> {
    const url = `${this.igdbApiUrl}/${endpoint}`;
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

  async enrichGameBySteamId(steamId: string): Promise<IGame> {
    const igdbId = await this.getGameIGDBId(steamId);

    if (igdbId === 0 || igdbId === undefined) {
      return {
        igdb_id: '0',
        steam_id: steamId,
        rating: 0,
        title: 'Unknown Title',
        summary: 'No summary available.',
        time_to_beat: 0,
        logo: '',
        url: '',
      };
    }

    const [igdbData, logo, timeToBeat] = await Promise.all([
      this.getGameIGDB(igdbId),
      this.getGameCover(igdbId),
      this.getTimeToBeatFromIGDB(igdbId),
    ]);

    if (!igdbData) {
      throw new Error(`IGDB data not found for IGDB ID ${igdbId}`);
    }

    return {
      igdb_id: igdbData.id.toString(),
      steam_id: steamId,
      rating: igdbData.total_rating,
      title: igdbData.name,
      summary: igdbData.summary,
      time_to_beat: timeToBeat || 0,
      logo: logo || '',
      url: igdbData.url,
    };
  }
}
