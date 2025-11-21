export interface User {
  id: number;
  steamid: string;
  name: string;
  avatar: string;
  achievement_count: number;
  completed_count: number;
  game_count: number;
  created_at: Date;
  updated_at: Date;
}

export interface LeaderboardUsers {
  data: LeaderboardUser[];
  meta: Meta;
}

export interface LeaderboardUser {
  id: number;
  rank_achievement: number;
  rank_completed: number;
  userId: number;
  user: User;
}

export interface User {
  id: number;
  name: string;
  avatar: string;
  achievement_count: number;
  completed_count: number;
}

export interface Meta {
  currentPage: number;
  itemCount: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
}
