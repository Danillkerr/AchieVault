import { CreateRoadmapDto } from '../dto/create-roadmap.dto';
import type { RoadmapStatus } from '../entities/roadmap-game.entity';

export interface CreateRoadmapData extends CreateRoadmapDto {
  etcTime: number;
  totalAchievements: number;
  recGameId: number | null;
}

export interface RoadmapPreviewResponse {
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
export interface RoadmapDetailsResponse {
  id: number;
  title: string;
  total_etc: number;
  total_achievements: number;

  recommended_game?: {
    id: number;
    title: string;
    cover: string;
    status: RoadmapStatus;
    playtime: number;
    achievements_total: number;
    achievements_unlocked: number;
    completion_percent: number;
    estimated_time_to_completion: number | null;
  };

  games: {
    id: number;
    steam_id: string;
    title: string;
    cover: string;
    status: RoadmapStatus;
    estimated_time_to_completion: number | null;
  }[];
}
