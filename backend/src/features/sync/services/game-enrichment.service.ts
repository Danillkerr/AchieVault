import { Inject, Injectable, Logger } from '@nestjs/common';
import { IGame } from 'src/core/interfaces/games/game.interface';
import { ExternalGameRepository } from 'src/core/repositories/external-game.repository.abstract';
import { UserSourceRepository } from 'src/core/repositories/user-source.repository.abstract';
import { GameService } from '../../game/service/game.service';
import { AchievementService } from '../../game/service/achievement.service';

@Injectable()
export class GameEnrichmentService {
  private readonly logger = new Logger(GameEnrichmentService.name);
  private readonly TIME_TO_WAIT_MS = 1010;

  constructor(
    @Inject(ExternalGameRepository)
    private readonly externalGameRepo: ExternalGameRepository,
    private readonly userSource: UserSourceRepository,
    private readonly gameService: GameService,
    private readonly achievementService: AchievementService,
  ) {}
  async enrichGames(steamIds: string[]): Promise<IGame[]> {
    if (!steamIds || steamIds.length === 0) return [];

    this.logger.log(`Enriching ${steamIds.length} games (Data + Schema)...`);
    const createdGames: IGame[] = [];

    for (const id of steamIds) {
      const savedGame = await this.processSingleGame(id);

      if (savedGame) {
        createdGames.push(savedGame);
      }

      await this._wait(this.TIME_TO_WAIT_MS);
    }

    return createdGames;
  }

  async syncGameWithAchievements(steamId: string): Promise<void> {
    await this.processSingleGame(steamId);
  }

  private async processSingleGame(steamId: string): Promise<IGame | null> {
    this.logger.log(`Processing game ${steamId}...`);

    try {
      const [gameData, achievementsSchema, globalStats] = await Promise.all([
        this.externalGameRepo.getGameDetailsBySteamId(steamId),
        this.userSource.getGameSchema(steamId),
        this.userSource.getAchievementPercentages(steamId),
      ]);

      if (!gameData) {
        this.logger.warn(`Game ${steamId} not found in external sources.`);
        return null;
      }

      const [savedGame] = await this.gameService.bulkCreateGames([gameData]);

      if (achievementsSchema && achievementsSchema.length > 0) {
        const statsMap = new Map();
        if (globalStats) {
          globalStats.forEach((s: any) => statsMap.set(s.name, s.percent));
        }

        const achievementsDto = achievementsSchema.map((ach) => {
          const percent = +statsMap.get(ach.name) || 0;

          return {
            apiname: ach.name,
            displayName: ach.displayName,
            global_percent: percent,

            achieved: 0,
            unlocktime: 0,
          };
        });

        await this.achievementService.bulkUpsertAchievements123(
          savedGame.id,
          achievementsDto,
        );

        this.logger.log(
          `Saved ${achievementsDto.length} achievements with stats for ${savedGame.title}`,
        );
      }

      return savedGame;
    } catch (e) {
      this.logger.error(`Failed to sync game ${steamId}`, e);
      return null;
    }
  }

  private _wait(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
