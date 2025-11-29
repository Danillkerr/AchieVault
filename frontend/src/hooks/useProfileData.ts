import { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import apiClient from "@/services/apiClient";
import type {
  UserProfileExtended,
  RecentGame,
  FriendRank,
  UserRoadmap,
} from "@/types/profile.interface";
import type { User } from "@/types/user.interface";
import { useSync } from "@/context/useSyncContext";

interface UserRanksResponse {
  rank_completed: number;
  rank_achievement: number;
}

interface FriendsRanksResponse {
  friends_perfect: FriendRank[];
  friends_achievements: FriendRank[];
}

export const useProfileData = (userId: string | undefined) => {
  const { triggerSync } = useSync();
  const syncedUserIdRef = useRef<string | null>(null);

  const query = useQuery({
    queryKey: ["profile", userId],
    queryFn: async () => {
      const [userRes, ranksRes, friendsRes, gamesRes, roadmapRes] =
        await Promise.all([
          apiClient.get<User>(`/users/${userId}`),
          apiClient.get<UserRanksResponse>(`/leaderboard/user/${userId}`),
          apiClient.get<FriendsRanksResponse>(`/leaderboard/friends/${userId}`),
          apiClient.get<RecentGame[]>(
            `/games-discovery/${userId}/games/recent`
          ),
          apiClient.get<UserRoadmap>(`/roadmaps/`),
        ]);

      const profileData: UserProfileExtended = {
        ...userRes.data,
        rank_perfect: ranksRes.data.rank_completed,
        rank_achievements: ranksRes.data.rank_achievement,
        friends_perfect: friendsRes.data.friends_perfect,
        friends_achievements: friendsRes.data.friends_achievements,
        recent_games: gamesRes.data,
        active_roadmap: roadmapRes.data,
      };

      return profileData;
    },
    enabled: !!userId,
  });

  useEffect(() => {
    if (!userId) return;
    if (syncedUserIdRef.current === userId) return;

    triggerSync(userId);
    syncedUserIdRef.current = userId;
  }, [userId, triggerSync]);

  return {
    profile: query.data || null,
    isLoading: query.isLoading,
    error: query.error ? "Could not load profile data" : null,
  };
};
