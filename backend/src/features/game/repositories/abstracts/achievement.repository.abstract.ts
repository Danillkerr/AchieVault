import { EntityManager } from 'typeorm';
import { ISteamPlayerAchievement } from 'src/core/interfaces/games/player-achievement.interface';

export abstract class AchievementRepository {
  abstract bulkUpsert(
    gameId: number,
    achievements: ISteamPlayerAchievement[],
    transactionManager?: EntityManager,
  ): Promise<Map<string, number> | undefined>;
}
