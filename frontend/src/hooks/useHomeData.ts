import { useQuery } from "@tanstack/react-query";
import type { LeaderboardUsers } from "@/types/user.interface";
import type { TrendingGame } from "@/types/game.interface";

const BACKEND_URL =
  import.meta.env.REACT_APP_BACKEND_URL || "http://localhost:3000";

const fetchJson = async <T>(url: string): Promise<T> => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
};

export const useHomeData = () => {
  const perfectQuery = useQuery({
    queryKey: ["leaderboard", "perfect"],
    queryFn: () =>
      fetchJson<LeaderboardUsers>(`${BACKEND_URL}/leaderboard/users?limit=15`),
  });

  const achievQuery = useQuery({
    queryKey: ["leaderboard", "achievement"],
    queryFn: () =>
      fetchJson<LeaderboardUsers>(
        `${BACKEND_URL}/leaderboard/users?sort=achievement&limit=15`
      ),
  });

  const trendingQuery = useQuery({
    queryKey: ["trending"],
    queryFn: () =>
      fetchJson<TrendingGame[]>(`${BACKEND_URL}/games-discovery/popular`),
  });

  return {
    topPerfectUsers: perfectQuery.data,
    topAchievUsers: achievQuery.data,
    trendingGames: trendingQuery.data || [],
    loading:
      perfectQuery.isLoading ||
      achievQuery.isLoading ||
      trendingQuery.isLoading,
    error:
      perfectQuery.error || achievQuery.error || trendingQuery.error
        ? "Error loading data"
        : null,
  };
};
