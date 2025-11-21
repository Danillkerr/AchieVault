import { Inject, Injectable, Logger } from '@nestjs/common';
import { IGame } from 'src/core/interfaces/games/game.interface';
import { ExternalGameRepository } from '../../../core/repositories/external-game.repository.abstract';
import { UserSourceRepository } from 'src/core/repositories/user-source.repository.abstract';
import { GameService } from '../../game/service/game.service';
import { AchievementService } from '../../game/service/achievement.service';

interface IAchievementDTO {
  apiname: string;
  achieved: number;
  unlocktime: number;
}

interface achievementData {
  name: string;
}

@Injectable()
export class GameEnrichmentService {
  private readonly logger = new Logger(GameEnrichmentService.name);
  private readonly TIME_TO_WAIT_MS = 1010;

  constructor(
    @Inject(ExternalGameRepository)
    private readonly externalGameRepo: ExternalGameRepository,
    private userSource: UserSourceRepository,
    private gameService: GameService,
    private achievementService: AchievementService,
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

  async syncGameWithAchievements(steamId: string): Promise<void> {
    this.logger.log(`Full sync started for game ${steamId}...`);

    try {
      const [gameData, achievementsData] = await Promise.all([
        this.externalGameRepo.getGameDetailsBySteamId(steamId),
        this.userSource.getGameSchema(steamId),
      ]);

      if (!gameData) {
        this.logger.warn(`Game ${steamId} not found in external sources.`);
        return;
      }

      const [savedGame] = await this.gameService.bulkCreateGames([gameData]);

      if (achievementsData && achievementsData.length > 0) {
        const achievementsDto: IAchievementDTO[] = achievementsData.map(
          (ach) => ({
            apiname: ach.name,
            achieved: 0,
            unlocktime: 0,
          }),
        );

        await this.achievementService.bulkUpsertAchievements(
          savedGame.id,
          achievementsDto as any,
        );
      }

      this.logger.log(`Game ${steamId} synced successfully.`);
    } catch (e) {
      this.logger.error(`Failed to sync game ${steamId}`, e);
    }
  }
}
