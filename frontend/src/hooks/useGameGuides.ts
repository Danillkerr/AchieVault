import { useState, useEffect, useCallback } from "react";
import apiClient from "../services/apiClient";
import { useAuth } from "../context/useAuthContext";
import type {
  Guide,
  CreateGuideDto,
  GuidesResponse,
} from "../types/guide.interface";

export const useGameGuides = (gameId: string | undefined) => {
  const { user } = useAuth();

  const [guides, setGuides] = useState<Guide[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchGuides = useCallback(async () => {
    if (!gameId) return;

    setIsLoading(true);
    try {
      const res = await apiClient.get<GuidesResponse>(`/guides/`, {
        params: { page: page, limit: 5, gameId, userId: user?.id },
      });
      setGuides(res.data.data);
      setTotalPages(res.data.meta.totalPages);
      console.log("Fetched guides:", res.data.data);
    } catch (error) {
      console.error("Failed to fetch guides", error);
    } finally {
      setIsLoading(false);
    }
  }, [gameId, page, user?.id]);

  useEffect(() => {
    fetchGuides();
  }, [fetchGuides]);

  const createGuide = async (data: CreateGuideDto) => {
    if (!gameId) return;
    console.log("Creating guide with data:", data);
    await apiClient.post(`/guides/`, data);
    setPage(1);
    await fetchGuides();
  };

  const updateGuide = async (
    guideId: number,
    inputData: Pick<CreateGuideDto, "title" | "text">
  ) => {
    await apiClient.put(`/guides/${guideId}`, {
      title: inputData.title,
      text: inputData.text,
    });
    await fetchGuides();
  };

  const deleteGuide = async (guideId: number) => {
    if (!window.confirm("Are you sure you want to delete this guide?")) return;
    await apiClient.delete(`/guides/${guideId}`);
    await fetchGuides();
  };

  return {
    guides,
    isLoading,
    createGuide,
    updateGuide,
    deleteGuide,
    page,
    setPage,
    totalPages,
  };
};
