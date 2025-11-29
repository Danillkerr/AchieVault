import { Inject, Injectable, Logger } from '@nestjs/common';
import { IGame } from 'src/core/interfaces/games/game.interface';
import { ExternalGameRepository } from 'src/core/repositories/external-game.repository.abstract';
import { GameService } from '../../game/service/game.service';
import { AchievementService } from '../../game/service/achievement.service';
import { DataSource } from 'typeorm';
import { ISteamPlayerAchievement } from '../../../core/interfaces/games/player-achievement.interface';
import { IAchievementSource } from 'src/core/repositories/interfaces/achievement-source.interface';
@Injectable()
export class GameEnrichmentService {
  private readonly logger = new Logger(GameEnrichmentService.name);
  private readonly TIME_TO_WAIT_MS = 1010;

  constructor(
    @Inject(ExternalGameRepository)
    private readonly externalGameRepo: ExternalGameRepository,
    @Inject(IAchievementSource)
    private readonly achievementSource: IAchievementSource,
    private readonly gameService: GameService,
    private readonly achievementService: AchievementService,
    private readonly dataSource: DataSource,
  ) {}
  async enrichGames(steamIds: string[]): Promise<IGame[]> {
    const uniqueIds = [...new Set(steamIds)].filter(Boolean);
    if (uniqueIds.length === 0) return [];

    this.logger.log(`Start enriching ${uniqueIds.length} games...`);
    const createdGames: IGame[] = [];

    for (const id of uniqueIds) {
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
    const start = Date.now();

    try {
      const [gameData, achievementsSchema, globalStats] = await Promise.all([
        this.externalGameRepo.getGameDetailsBySteamId(steamId),
        this.achievementSource.getGameSchema(steamId),
        this.achievementSource.getAchievementPercentages(steamId),
      ]);

      if (!gameData) {
        this.logger.warn(`Game ${steamId} not found in external sources.`);
        return null;
      }

      const savedGame = await this.dataSource.transaction(async (manager) => {
        const [game] = await this.gameService.bulkCreateGames(
          [gameData],
          manager,
        );

        if (achievementsSchema && achievementsSchema.length > 0) {
          const achievementsDto = this.mergeAchievementsData(
            achievementsSchema,
            globalStats,
          );

          await this.achievementService.bulkUpsertAchievements(
            game.id,
            achievementsDto,
            manager,
          );
          this.logger.debug(
            `   + Linked ${achievementsDto.length} achievements`,
          );
        }
        return game;
      });

      const duration = Date.now() - start;
      this.logger.log(`Synced game "${savedGame.title}" (${duration}ms)`);
      return savedGame;
    } catch (e) {
      this.logger.error(`Failed to sync game ${steamId}`, e);
      return null;
    }
  }

  private mergeAchievementsData(
    schema: any[],
    globalStats: any[],
  ): ISteamPlayerAchievement[] {
    const statsMap = new Map<string, number>();

    if (Array.isArray(globalStats)) {
      globalStats.forEach((s) => statsMap.set(s.name, s.percent));
    }

    return schema.map((ach) => ({
      apiname: ach.name,
      global_percent: statsMap.get(ach.name) || 0,
      achieved: 0,
      unlocktime: 0,
    }));
  }

  private _wait(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
