import { useState, useEffect, useCallback } from "react";
import apiClient from "../services/apiClient";
import { useAuth } from "../context/useAuthContext";
import type {
  Guide,
  CreateGuideDto,
  GuidesResponse,
} from "../types/guide.interface";
import { toast } from "react-hot-toast";

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
    } catch (error) {
      console.error("Failed to fetch guides", error);
      toast.error("Could not load guides");
    } finally {
      setIsLoading(false);
    }
  }, [gameId, page, user?.id]);

  useEffect(() => {
    fetchGuides();
  }, [fetchGuides]);

  const createGuide = async (data: CreateGuideDto) => {
    if (!gameId) return;
    const toastId = toast.loading("Publishing guide...");
    await apiClient.post(`/guides/`, data);
    setPage(1);
    await fetchGuides();
    toast.success("Guide published successfully!", { id: toastId });
  };

  const updateGuide = async (
    guideId: number,
    inputData: Pick<CreateGuideDto, "title" | "text">
  ) => {
    const toastId = toast.loading("Updating guide...");
    await apiClient.put(`/guides/${guideId}`, {
      title: inputData.title,
      text: inputData.text,
    });
    await fetchGuides();
    toast.success("Guide updated successfully!", { id: toastId });
  };

  const deleteGuide = async (guideId: number) => {
    if (!window.confirm("Are you sure you want to delete this guide?")) return;
    const toastId = toast.loading("Deleting guide...");
    await apiClient.delete(`/guides/${guideId}`);
    await fetchGuides();
    toast.success("Guide deleted successfully!", { id: toastId });
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
