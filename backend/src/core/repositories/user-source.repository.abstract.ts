import { ISteamPlayerAchievement } from '../interfaces/games/player-achievement.interface';
import { ISourceGameSummary } from '../interfaces/user-source/user-source.interface';

export abstract class UserSourceRepository {
  abstract getOwnedGames(userId: string): Promise<ISourceGameSummary>;

  abstract getGameAchievements(
    userId: string,
    gameId: string,
  ): Promise<ISteamPlayerAchievement[]>;

  abstract getFriendIds(userId: string): Promise<string[]>;

  abstract getTopPlayedGames(limit: number): Promise<any[]>;

  abstract getGameSchema(appId: string): Promise<any[]>;

  abstract searchGames(query: string): Promise<any[]>;

  abstract getAchievementPercentages(appId: string): Promise<any>;
}
