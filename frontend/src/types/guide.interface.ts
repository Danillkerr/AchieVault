import type { PaginationMeta } from "./pagination.interface";
import type { User } from "./user.interface";

export interface Guide {
  id: number;
  user: User;
  game_id: number;
  title: string;
  text: string;
  created_at: string;
  updated_at: string;
}

export interface CreateGuideDto {
  title: string;
  text: string;
  steamId: string;
  user_id: number;
}

export interface GuidesResponse {
  data: Guide[];
  meta: PaginationMeta;
}
