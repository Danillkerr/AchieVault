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

    if (steamIds.length === 0) return [];

    const missingIds = await this.gameService.findNewSteamIds(steamIds);

    if (missingIds.length > 0) {
      this.logger.log(
        `Missing ${missingIds.length} games. Syncing sequentially...`,
      );

      for (const id of missingIds) {
        await this.enrichmentService.syncGameWithAchievements(id);

        await this._wait(this.IGDB_DELAY_MS);
      }
    }

    const allDbGames = await this.gameService.findBySteamIds(steamIds);

    return topGames.map((stat) => {
      const dbGame = allDbGames.find((g) => g.steam_id === stat.steamId);
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
