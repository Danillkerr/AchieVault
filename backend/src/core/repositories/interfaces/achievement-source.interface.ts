import { ISteamPlayerAchievement } from '../../interfaces/games/player-achievement.interface';

export interface IAchievementSource {
  getGameAchievements(
    userId: string,
    gameId: string,
  ): Promise<ISteamPlayerAchievement[]>;
  getGameSchema(appId: string): Promise<any[]>;
  getAchievementPercentages(appId: string): Promise<any>;
}
export const IAchievementSource = Symbol('IAchievementSource');
