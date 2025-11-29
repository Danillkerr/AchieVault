import { Inject, Injectable, Logger } from '@nestjs/common';
import { ISyncStep } from '../interfaces/sync-step.interface';
import { User } from '../../../core/entities/user.entity';
import { GameService } from '../../game/service/game.service';
import { GameEnrichmentService } from '../services/game-enrichment.service';
import { UserGameService } from '../../users/services/user-game.service';
import { IGameSource } from '../../../core/repositories/interfaces/game-source.interface';
import {
  ISourceGameSummary,
  ISteamOwnedGame,
} from '../../../core/interfaces/user-source/user-source.interface';
import { DataSource } from 'typeorm';
import { UserStatsService } from 'src/features/users/services/user-stats.service';

@Injectable()
export class GamesSyncStep implements ISyncStep {
  name = 'GamesSync';
  private readonly logger = new Logger(GamesSyncStep.name);

  constructor(
    @Inject(IGameSource) private readonly userSource: IGameSource,
    private readonly gameEnrichmentService: GameEnrichmentService,
    private readonly userGameService: UserGameService,
    private readonly gamesService: GameService,
    private readonly userStatsService: UserStatsService,

    private readonly dataSource: DataSource,
  ) {}

  async execute(user: User): Promise<void> {
    this.logger.log(`Syncing games for ${user.name} (${user.steamid})...`);

    const prerequisites = await this._getSyncPrerequisites(user);

    if (!prerequisites.shouldSync) {
      this.logger.log(
        `Skipping sync for ${user.name}: ${prerequisites.message}`,
      );
      return;
    }

    const { userUnlinkedGames, newDBGames, allGamesCount } = prerequisites;

    if (!userUnlinkedGames) return;

    if (newDBGames.length > 0) {
      await this.gameEnrichmentService.enrichGames(newDBGames);
    }

    await this._performSyncTransaction(user, userUnlinkedGames, allGamesCount);

    this.logger.log(`Game sync finished for ${user.name}.`);
  }

  private async _getSyncPrerequisites(user: User) {
    const userGamesSummary: ISourceGameSummary =
      await this.userSource.getOwnedGames(user.steamid);

    if (userGamesSummary.games.length === 0)
      return { shouldSync: false, message: 'No games found on Steam' };

    if (user.game_count === userGamesSummary.game_count)
      return { shouldSync: false, message: 'No change in game count' };

    const userGames: ISteamOwnedGame[] = userGamesSummary.games.map((g) => ({
      appid: g.appid,
      playtime_forever: g.playtime_forever,
    }));

    const userLinkedIds: string[] =
      await this.userGameService.getOwnedGameSteamIds(user.id);

    const userUnlinkedGames = userGames.filter(
      (game) => !userLinkedIds.includes(game.appid.toString()),
    );

    const newDBGames = await this.gamesService.findNewSteamIds(
      userUnlinkedGames.map((g) => g.appid.toString()),
    );

    return {
      shouldSync: true,
      userUnlinkedGames,
      newDBGames,
      allGamesCount: userGamesSummary.game_count,
    };
  }

  private async _performSyncTransaction(
    user: User,
    userUnlinkedGames: ISteamOwnedGame[],
    totalGameCount: number,
  ) {
    await this.dataSource.transaction(async (manager) => {
      if (userUnlinkedGames.length > 0) {
        await this.userGameService.bulkUpsertFromSteam(
          user.id,
          userUnlinkedGames,
          manager,
        );
      }

      await this.userStatsService.updateUserGameCount(
        user.id,
        totalGameCount,
        manager,
      );
    });
  }
}
