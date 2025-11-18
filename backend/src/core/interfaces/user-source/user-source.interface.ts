export interface ISourceGameSummary {
  game_count: number;
  games: ISteamOwnedGame[];
}

export interface ISteamOwnedGame {
  appid: number;
  playtime_forever: number;
}
