import { useState, useEffect } from "react";
import apiClient from "../services/apiClient";
import type {
  UserProfileExtended,
  RecentGame,
  FriendRank,
} from "../types/profile.interface";
import type { User } from "../types/user.interface";

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

  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const [userRes, ranksRes, friendsRes, gamesRes] = await Promise.all([
          apiClient.get<User>(`/users/${userId}`),

          apiClient.get<UserRanksResponse>(`/leaderboard/user/${userId}`),

          apiClient.get<FriendsRanksResponse>(`/leaderboard/friends/${userId}`),

          apiClient.get<RecentGame[]>(
            `/games-discovery/${userId}/games/recent`
          ),
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

          active_roadmap: null,
        };
        console.log("Fetched profile data:", profileData);

        setProfile(profileData);
      } catch (err) {
        console.error("Failed to load profile data", err);
        setError("Could not load profile data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  return { profile, isLoading, error };
};
