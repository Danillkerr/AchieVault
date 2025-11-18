import { Injectable } from '@nestjs/common';
import { ExternalGameRepository } from '../../../../core/repositories/external-game.repository.abstract';
import { IgdbService } from '../service/igdb.service';
import { IGame } from 'src/core/interfaces/games/game.interface';

@Injectable()
export class IgdbExternalGameRepository implements ExternalGameRepository {
  constructor(private readonly igdbService: IgdbService) {}

  async getGameDetailsBySteamId(steamId: string): Promise<IGame | null> {
    const igdbId = await this.igdbService.getGameIGDBId(steamId);

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
      this.igdbService.getGameIGDB(igdbId),
      this.igdbService.getGameCover(igdbId),
      this.igdbService.getTimeToBeatFromIGDB(igdbId),
    ]);

    if (!igdbData) {
      throw new Error(`IGDB data not found for IGDB ID ${igdbId}`);
    }

    return {
      igdb_id: igdbData.id.toString(),
      steam_id: steamId,
      rating: igdbData.total_rating || 0,
      title: igdbData.name,
      summary: igdbData.summary || 'No summary available.',
      time_to_beat: timeToBeat || 0,
      logo: logo || '',
      url: igdbData.url || '',
    };
  }
}
