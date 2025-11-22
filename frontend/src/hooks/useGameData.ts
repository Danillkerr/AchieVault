import { useState, useEffect } from "react";
import apiClient from "../services/apiClient";
import type { Game } from "../types/game.interface";

export const useGameData = (gameId: string | undefined) => {
  const [game, setGame] = useState<Game | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!gameId) return;

    const fetchGame = async () => {
      setIsLoading(true);
      try {
        const response = await apiClient.get<Game[]>(`/game/${gameId}`);
        setGame(response.data[0]);
      } catch (error) {
        console.error("Failed to load game data", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGame();
  }, [gameId]);

  return { game, isLoading };
};
