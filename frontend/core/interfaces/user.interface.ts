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
