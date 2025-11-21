import { useState, useEffect } from "react";
import type { LeaderboardUsers } from "../types/user.interface";
import type { TrendingGame } from "../types/game.interface";

const BACKEND_URL =
  import.meta.env.REACT_APP_BACKEND_URL || "http://localhost:3000";

export const useHomeData = () => {
  const [topPerfectUsers, setTopPerfectUsers] = useState<LeaderboardUsers>();
  const [topAchievUsers, setTopAchievUsers] = useState<LeaderboardUsers>();
  const [trendingGames, setTrendingGames] = useState<TrendingGame[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [perfectRes, achievRes, gamesRes] = await Promise.all([
          fetch(`${BACKEND_URL}/leaderboard/users?limit=15`),
          fetch(`${BACKEND_URL}/leaderboard/users?sort=achievement&limit=15`),
          fetch(`${BACKEND_URL}/games-discovery/popular`),
        ]);

        if (!perfectRes.ok || !achievRes.ok || !gamesRes.ok) {
          throw new Error("Failed to fetch data from server");
        }

        const perfectData = await perfectRes.json();
        const achievData = await achievRes.json();
        const gamesData = await gamesRes.json();

        console.log(perfectData, achievData, gamesData);

        setTopPerfectUsers(perfectData);
        setTopAchievUsers(achievData);
        setTrendingGames(gamesData);
      } catch (err) {
        console.error(err);
        setError("Server is not responding. Using offline mode?");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { topPerfectUsers, topAchievUsers, trendingGames, loading, error };
};
