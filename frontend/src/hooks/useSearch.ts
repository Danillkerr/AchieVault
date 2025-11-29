import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import apiClient from "@/services/apiClient";
import type { User } from "@/types/user.interface";
import type { TrendingGame } from "@/types/game.interface";

export const useSearch = () => {
  const [searchParams] = useSearchParams();
  const queryParam = searchParams.get("q") || "";

  const query = useQuery({
    queryKey: ["search", queryParam],
    queryFn: async () => {
      if (!queryParam.trim()) {
        return { users: [], games: [] };
      }

      const [usersResponse, gamesResponse] = await Promise.all([
        apiClient.get<User[]>("users/search/", { params: { q: queryParam } }),
        apiClient.get<TrendingGame[]>("games-discovery/search", {
          params: { q: queryParam },
        }),
      ]);

      return {
        users: usersResponse.data,
        games: gamesResponse.data,
      };
    },
    enabled: !!queryParam.trim(),
    staleTime: 1000 * 60,
  });

  return {
    users: query.data?.users || [],
    games: query.data?.games || [],
    isLoading: query.isLoading,
    query: queryParam,
    error: query.error ? "Failed to fetch search results" : null,
  };
};
