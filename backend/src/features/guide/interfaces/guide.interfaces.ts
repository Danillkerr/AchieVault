export interface CreateGuide {
  user_id: number;
  steamId: string;
  title: string;
  text: string;
}

export interface FindGuidesOptions {
  page: number;
  limit: number;
  user_id?: number;
  game_id?: number;
}
