import { useState, useEffect, useCallback, useRef } from "react";
import apiClient from "../services/apiClient";
import type {
  UserProfileExtended,
  RecentGame,
  FriendRank,
  UserRoadmap,
} from "../types/profile.interface";
import type { User } from "../types/user.interface";
import { useSync } from "../context/useSyncContext";

interface UserRanksResponse {
  rank_completed: number;
  rank_achievement: number;
}

interface FriendsRanksResponse {
  friends_perfect: FriendRank[];
  friends_achievements: FriendRank[];
}

export const useProfileData = (userId: string | undefined) => {
  const [profile, setProfile] = useState<UserProfileExtended | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const syncedUserIdRef = useRef<string | null>(null);

  const { triggerSync, refreshKey } = useSync();

  const profileRef = useRef(profile);

  useEffect(() => {
    profileRef.current = profile;
  }, [profile]);

  const fetchData = useCallback(
    async (showLoading = true) => {
      if (!userId) return;

      if (showLoading) setIsLoading(true);
      setError(null);

      try {
        const [userRes, ranksRes, friendsRes, gamesRes, roadmapRes] =
          await Promise.all([
            apiClient.get<User>(`/users/${userId}`),

            apiClient.get<UserRanksResponse>(`/leaderboard/user/${userId}`),

            apiClient.get<FriendsRanksResponse>(
              `/leaderboard/friends/${userId}`
            ),

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

          recent_games: gamesRes.data.map((game) => ({
            ...game,
          })),

          active_roadmap: roadmapRes.data,
        };

        setProfile(profileData);
      } catch (err) {
        console.error("Failed to load profile data", err);
        setError("Could not load profile data.");
      } finally {
        if (showLoading) setIsLoading(false);
      }
    },
    [userId]
  );

  useEffect(() => {
    if (!userId) return;

    const shouldShowLoader = !profileRef.current;

    fetchData(shouldShowLoader);
  }, [userId, refreshKey, fetchData]);

  useEffect(() => {
    if (!userId) return;
    if (syncedUserIdRef.current === userId) return;

    triggerSync(userId);
    syncedUserIdRef.current = userId;
  }, [userId, triggerSync]);

  return { profile, isLoading, error };
};
