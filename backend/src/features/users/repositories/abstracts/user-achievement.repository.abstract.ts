import { EntityManager } from 'typeorm';
import { IAchievementToUpsert } from '../../interfaces/user-achievement.interface';

export abstract class UserAchievementRepository {
  abstract bulkUpsert(
    achievements: IAchievementToUpsert[],
    transactionManager?: EntityManager,
  ): Promise<void>;

  abstract countCompletedAchievements(
    userId: number,
    transactionManager?: EntityManager,
  ): Promise<number>;

  abstract countCompletedGames(
    userId: number,
    transactionManager?: EntityManager,
  ): Promise<number>;

  abstract findAchievementByGame(
    userId: number,
    steamId: string,
    transactionManager?: EntityManager,
  ): Promise<any[]>;
}
