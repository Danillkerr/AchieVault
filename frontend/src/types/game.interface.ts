export interface Game {
  id: number;
  steam_id: number;
  rating: number;
  title: string;
  summary: string;
  time_to_beat: number;
  logo: string;
  url: string;
  created_at: Date;
  updated_at: Date;
}

export interface TrendingGame extends Game {
  currentPlayers: number;
  rank: number;
}
