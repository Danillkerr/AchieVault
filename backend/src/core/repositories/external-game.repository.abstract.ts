import { IGame } from '../interfaces/games/game.interface';

export abstract class ExternalGameRepository {
  abstract getGameDetailsBySteamId(steamId: string): Promise<IGame | null>;
}
