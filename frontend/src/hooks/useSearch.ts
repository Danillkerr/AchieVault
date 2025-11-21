import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import apiClient from "../services/apiClient";
import type { User } from "../types/user.interface";
import type { TrendingGame } from "../types/game.interface";

export const useSearch = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";

  const [users, setUsers] = useState<User[]>([]);
  const [games, setGames] = useState<TrendingGame[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!query.trim()) {
        setUsers([]);
        setGames([]);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const [usersResponse, gamesResponse] = await Promise.all([
          apiClient.get<User[]>("users/search/", { params: { q: query } }),
          apiClient.get<TrendingGame[]>("games-discovery/search", {
            params: { q: query },
          }),
        ]);

        setUsers(usersResponse.data);
        setGames(gamesResponse.data);
      } catch (err) {
        console.error("Search failed:", err);
        setError("Failed to fetch search results");
        setUsers([]);
        setGames([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [query]);

  return { users, games, isLoading, query, error };
};
