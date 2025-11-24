import type { User } from "../types/user.interface";

export interface FriendRank {
  id: number;
  user: User;
  rank: number;
  value: number;
}

export interface UserRoadmap {
  id: number;
  title: string;
  progress: number;
  total_games: number;
  completed_games: number;
  in_progress: number;
  abandoned: number;
  estimated_time: number;
  recommended_game?: {
    id: number;
    steam_id: string;
    title: string;
    cover: string;
  };
}

export interface RecentGame {
  id: number;
  steam_id: string;
  title: string;
  logo: string;
  playtime_forever: number;
  achievements_total: number;
  achievements_unlocked: number;
  completion_percent: number;
}

export interface UserProfileExtended extends User {
  rank_perfect: number;
  rank_achievements: number;

  friends_perfect: FriendRank[];
  friends_achievements: FriendRank[];

  active_roadmap?: UserRoadmap | null;
  recent_games: RecentGame[];
}
