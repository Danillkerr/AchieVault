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
  achievements?: Achievement[];
}

export interface TrendingGame extends Game {
  currentPlayers: number;
  rank: number;
}

export interface Achievement {
  apiName: string;
  displayName: string;
  description: string;
  icon: string;
  iconGray: string;
  percent: number;
}

export interface UserAchievementProgress {
  apiName: string;
  obtainedAt: string | null;
}

export interface AchievementWithStatus extends Achievement {
  isUnlocked: boolean;
  obtainedDate?: Date;
}
