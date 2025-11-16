export interface ISteamOwnedGame {
  appid: number;
  playtime_forever: number;
  rtime_last_played: number;
}

export interface ISteamOwnedGamesSummary {
  game_count: number;
  games: ISteamOwnedGame[];
}
