import { Inject, Injectable, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ISyncStep } from '../interfaces/sync-step.interface';
import { User } from '../../../core/entities/user.entity';
import { UserGameService } from '../../users/services/user-game.service';
import { AchievementService } from '../../game/service/achievement.service';
import { GameEnrichmentService } from '../services/game-enrichment.service';
import { UserAchievementService } from '../../users/services/user-achievement.service';
import { UserStatsService } from '../../users/services/user-stats.service';
import { ISteamOwnedGame } from '../../../core/interfaces/user-source/user-source.interface';
import { IGameToSync } from '../interfaces/game-to-sync.interface';
import { IAchievementSource } from 'src/core/repositories/interfaces/achievement-source.interface';
import { IGameSource } from 'src/core/repositories/interfaces/game-source.interface';

@Injectable()
export class AchievementsSyncStep implements ISyncStep {
  name = 'AchievementsSync';
  private readonly logger = new Logger(AchievementsSyncStep.name);

  constructor(
    @Inject(IAchievementSource)
    private readonly achievementSource: IAchievementSource,
    @Inject(IGameSource) private readonly userSource: IGameSource,
    private readonly userGameService: UserGameService,
    private readonly achievementService: AchievementService,
    private readonly gameEnrichmentService: GameEnrichmentService,
    private readonly userAchievementService: UserAchievementService,
    private readonly userStatsService: UserStatsService,
    private readonly dataSource: DataSource,
  ) {}

  async execute(user: User): Promise<void> {
    this.logger.log(`Syncing achievements for ${user.name}...`);

    const [userGamesSummary, userGamesInDb] = await Promise.all([
      this.userSource.getOwnedGames(user.steamid),
      this.userGameService.getAllUserGames(user.id),
    ]);

    const gamesToUpdate = this._findGamesWithProgress(
      userGamesSummary.games,
      userGamesInDb,
    );

    if (gamesToUpdate.length === 0) {
      this.logger.log('No games with new progress found.');
      return;
    }

    this.logger.log(
      `Updating achievements for ${gamesToUpdate.length} games...`,
    );

    for (const game of gamesToUpdate) {
      try {
        await this._syncSingleGameAchievements(user, game);
      } catch (err) {
        this.logger.warn(
          `Failed to sync achievements for game ${game.steam_id}: ${err.message}`,
        );
      }
    }

    await this.userStatsService.recalculateUserStats(user.id);
  }

  private _findGamesWithProgress(
    steamGames: ISteamOwnedGame[],
    dbGames: any[],
  ): IGameToSync[] {
    const result: IGameToSync[] = [];
    const dbMap = new Map(dbGames.map((g) => [g.game.steam_id, g]));

    for (const sGame of steamGames) {
      const dbGame = dbMap.get(sGame.appid.toString());
      if (!dbGame) continue;

      if (sGame.playtime_forever > (dbGame.playtime || 0)) {
        result.push({
          steam_id: sGame.appid.toString(),
          new_playtime: sGame.playtime_forever,
          userGame_id: dbGame.id,
          game_id: dbGame.game.id,
        });
      }
    }
    return result;
  }

  private async _syncSingleGameAchievements(user: User, game: IGameToSync) {
    const achievementsFromApi =
      await this.achievementSource.getGameAchievements(
        user.steamid,
        game.steam_id,
      );

    if (!achievementsFromApi || achievementsFromApi.length === 0) {
      await this.dataSource.transaction(async (tm) => {
        await this.userGameService.updateUserGamePlaytime(
          game.userGame_id,
          game.new_playtime,
          tm,
        );
      });
      return;
    }

    await this.dataSource.transaction(async (manager) => {
      const apiNames = achievementsFromApi.map((a) => a.apiname);

      let achievementMap = await this.achievementService.getAchievementsMap(
        game.game_id,
        apiNames,
      );

      if (achievementMap.size < apiNames.length) {
        this.logger.warn(
          `Missing achievements for ${game.steam_id}. Enriching...`,
        );
        await this.gameEnrichmentService.syncGameWithAchievements(
          game.steam_id,
        );
        achievementMap = await this.achievementService.getAchievementsMap(
          game.game_id,
          apiNames,
        );
      }

      if (achievementMap.size > 0) {
        await this.userAchievementService.bulkUpsertFromSteam(
          user.id,
          achievementMap,
          achievementsFromApi,
          manager,
        );
      }

      await this.userGameService.updateUserGamePlaytime(
        game.userGame_id,
        game.new_playtime,
        manager,
      );
    });
  }
}
