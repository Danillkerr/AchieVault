import { Inject, Injectable, Logger } from '@nestjs/common';
import { IGame } from 'src/core/interfaces/games/game.interface';
import { ExternalGameRepository } from '../../../core/repositories/external-game.repository.abstract';

@Injectable()
export class GameEnrichmentService {
  private readonly logger = new Logger(GameEnrichmentService.name);
  private readonly TIME_TO_WAIT_MS = 1010;

  constructor(
    @Inject(ExternalGameRepository)
    private readonly externalGameRepo: ExternalGameRepository,
  ) {}

  async enrichGames(steamIds: string[]): Promise<IGame[]> {
    if (!steamIds || steamIds.length === 0) return [];

    this.logger.log(
      `Enriching ${steamIds.length} new games via External Provider...`,
    );
    const enrichedGames: IGame[] = [];

    for (const id of steamIds) {
      try {
        const game = await this.externalGameRepo.getGameDetailsBySteamId(id);

        if (game) {
          enrichedGames.push(game);
        } else {
          this.logger.warn(`Game ${id} not found in external source.`);
        }
      } catch (err) {
        this.logger.error(`Failed to enrich Steam ID ${id}: ${err.message}`);
      } finally {
        await this._wait(this.TIME_TO_WAIT_MS);
      }
    }

    this.logger.log(`Successfully enriched ${enrichedGames.length} games.`);
    return enrichedGames;
  }

  private _wait(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
