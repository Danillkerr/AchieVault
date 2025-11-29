import { useQuery } from "@tanstack/react-query";
import apiClient from "@/services/apiClient";
import { useAuth } from "@/context/useAuthContext";
import type {
  Achievement,
  UserAchievementProgress,
  AchievementWithStatus,
} from "@/types/game.interface";

export const useGameAchievements = (gameId: string | undefined) => {
  const { user, isAuthenticated } = useAuth();
  const userId = user?.id;

  const query = useQuery({
    queryKey: ["achievements", gameId, userId],
    queryFn: async () => {
      const schemaRes = await apiClient.get<Achievement[]>(
        `/games-discovery/${gameId}/achievements/global`
      );
      const schema = schemaRes.data;
      if (isAuthenticated && userId) {
        const progressRes = await apiClient.get<UserAchievementProgress[]>(
          `/users-achievements/${userId}/${gameId}/progress`
        );
        const userProgress = progressRes.data;
        const progressMap = new Map(
          userProgress.map((p) => [p.apiName, p.obtainedAt])
        );

        return schema.map((ach): AchievementWithStatus => {
          const obtainedVal = progressMap.get(ach.apiName);
          const isUnlocked = obtainedVal !== undefined && obtainedVal !== null;
          return {
            ...ach,
            isUnlocked,
            obtainedDate: isUnlocked ? new Date(obtainedVal!) : undefined,
          };
        });
      }

      return schema.map(
        (ach): AchievementWithStatus => ({
          ...ach,
          isUnlocked: true,
          obtainedDate: undefined,
        })
      );
    },
    enabled: !!gameId,
  });

  return {
    allAchievements: query.data || [],
    backlog: query.data?.filter((a) => !a.isUnlocked) || [],
    isLoading: query.isLoading,
    error: query.error,
  };
};
