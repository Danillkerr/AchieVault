export type RoadmapStatus =
  | "planned"
  | "in_progress"
  | "deferred"
  | "completed";

export interface RoadmapGame {
  id: number;
  steam_id: string;
  title: string;
  cover: string;
  status: RoadmapStatus;

  playtime: number;
  achievements_total: number;
  achievements_unlocked: number;
  completion_percent: number;

  estimated_time_to_completion: number;
}

export interface Roadmap {
  id: number;
  title: string;
  total_etc: number;
  total_achievements: number;
  recommended_game?: RoadmapGame;
  games: RoadmapGame[];
}
