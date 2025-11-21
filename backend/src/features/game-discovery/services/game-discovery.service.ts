import { Injectable, Logger } from '@nestjs/common';
import { GameService } from '../../game/service/game.service';
import { GameEnrichmentService } from '../../sync/services/game-enrichment.service';
import { UserSourceRepository } from '../../../core/repositories/user-source.repository.abstract';

@Injectable()
export class GameDiscoveryService {
  private readonly logger = new Logger(GameDiscoveryService.name);
  private readonly IGDB_DELAY_MS = 1100;

  constructor(
    private userSource: UserSourceRepository,
    private readonly gameService: GameService,
    private readonly enrichmentService: GameEnrichmentService,
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
      this.logger.log(`Syncing ${missingIds.length} missing games...`);
      for (const id of missingIds) {
        await this.enrichmentService.syncGameWithAchievements(id);

        await this._wait(this.IGDB_DELAY_MS);
      }
    }

    const allDbGames = await this.gameService.findBySteamIds(steamIds);

    this.logger.log('games:', allDbGames);

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
}
