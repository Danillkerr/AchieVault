export interface IAchievementToUpsert {
  user: { id: number };
  achievement: { id: number };
  obtained: Date | null;
}
