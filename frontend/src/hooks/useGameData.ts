import { useQuery } from "@tanstack/react-query";
import apiClient from "@/services/apiClient";
import type { Game } from "@/types/game.interface";

export const useGameData = (gameId: string | undefined) => {
  return useQuery({
    queryKey: ["game", gameId],
    queryFn: async () => {
      const response = await apiClient.get<Game[]>(`/game/${gameId}`);
      return response.data[0];
    },
    enabled: !!gameId,
  });
};
