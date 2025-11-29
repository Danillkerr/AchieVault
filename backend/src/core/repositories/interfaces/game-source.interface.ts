import { ISourceGameSummary } from '../../interfaces/user-source/user-source.interface';

export interface IGameSource {
  getOwnedGames(userId: string): Promise<ISourceGameSummary>;
  getRecentlyPlayedGames(userId: string, limit: number): Promise<any[]>;
}

export const IGameSource = Symbol('IGameSource');
