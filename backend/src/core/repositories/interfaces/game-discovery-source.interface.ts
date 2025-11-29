export interface IGameDiscoverySource {
  getTopGames(limit: number): Promise<any[]>;
  searchGames(query: string): Promise<any[]>;
}
export const IGameDiscoverySource = Symbol('IGameDiscoverySource');
