import { useState, useEffect } from "react";
import apiClient from "../services/apiClient";
import { useAuth } from "../context/useAuthContext";
import type {
  Achievement,
  UserAchievementProgress,
  AchievementWithStatus,
} from "../types/game.interface";

export const useGameAchievements = (gameId: string | undefined) => {
  const { user, isAuthenticated } = useAuth();

  const [achievements, setAchievements] = useState<AchievementWithStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const userId = user?.id || "";

  useEffect(() => {
    if (!gameId || gameId === "" || !isAuthenticated) return;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const schemaReq = apiClient.get<Achievement[]>(
          `/games-discovery/${gameId}/achievements/global`
        );

        const progressReq = apiClient.get<UserAchievementProgress[]>(
          `/users-achievements/${userId}/${gameId}/progress`
        );

        const [schemaRes, progressRes] = await Promise.all([
          schemaReq,
          progressReq,
        ]);

        const schema = schemaRes.data;
        const userProgress = progressRes.data;

        const progressMap = new Map<string, string | null>();

        userProgress.forEach((p) => {
          progressMap.set(p.apiName, p.obtainedAt);
        });

        const mergedData: AchievementWithStatus[] = schema.map((ach) => {
          const obtainedVal = progressMap.get(ach.apiName);
          const isUnlocked = obtainedVal !== undefined && obtainedVal !== null;

          return {
            ...ach,
            isUnlocked,
            obtainedDate: isUnlocked ? new Date(obtainedVal!) : undefined,
          };
        });

        setAchievements(mergedData);
      } catch (err) {
        console.error("Failed to fetch achievements", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [gameId, isAuthenticated, userId]);

  const backlog = achievements.filter((a) => !a.isUnlocked);

  return {
    allAchievements: achievements,
    backlog,
    isLoading,
  };
};
