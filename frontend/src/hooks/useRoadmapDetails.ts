import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import apiClient from "@/services/apiClient";
import type { Roadmap, RoadmapStatus } from "@/types/roadmap.interface";
import { useTranslation } from "react-i18next";

export const useRoadmapDetails = (roadmapId: string | undefined) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [isEditMode, setIsEditMode] = useState(false);
  const [localRoadmap, setLocalRoadmap] = useState<Roadmap | null>(null);
  const [pendingChanges, setPendingChanges] = useState<
    Record<number, RoadmapStatus>
  >({});

  const query = useQuery({
    queryKey: ["roadmap", roadmapId],
    queryFn: async () => {
      const res = await apiClient.get<Roadmap>(
        `/roadmaps/${roadmapId}/details`
      );
      return res.data;
    },
    enabled: !!roadmapId,
  });

  useEffect(() => {
    if (query.data) {
      setLocalRoadmap(query.data);
    }
  }, [query.data]);

  const handleLocalStatusChange = (
    gameId: number,
    newStatus: RoadmapStatus
  ) => {
    if (!localRoadmap) return;

    const updatedGames = localRoadmap.games.map((g) =>
      g.id === gameId ? { ...g, status: newStatus } : g
    );
    setLocalRoadmap({ ...localRoadmap, games: updatedGames });

    setPendingChanges((prev) => ({
      ...prev,
      [gameId]: newStatus,
    }));
  };

  const saveMutation = useMutation({
    mutationFn: async (changes: Record<number, RoadmapStatus>) => {
      const updatePromises = Object.entries(changes).map(([gameId, status]) =>
        apiClient.patch(`/roadmaps/${roadmapId}/games/${gameId}`, { status })
      );
      await Promise.all(updatePromises);
    },
    onSuccess: (_, variables) => {
      const changesCount = Object.keys(variables).length;
      toast.success(t("toasts.roadmap_updated", { count: changesCount }));
      setPendingChanges({});
      setIsEditMode(false);

      queryClient.invalidateQueries({ queryKey: ["roadmap", roadmapId] });

      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: () => {
      toast.error(t("toasts.save_error"));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => apiClient.delete(`/roadmaps/${roadmapId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });

      toast.success(t("toasts.roadmap_deleted"));
      navigate("/profile");
    },
    onError: () => {
      toast.error(t("toasts.delete_error"));
    },
  });

  const toggleEditMode = async () => {
    if (!isEditMode) {
      setIsEditMode(true);
      return;
    }

    const changesCount = Object.keys(pendingChanges).length;
    if (changesCount === 0) {
      setIsEditMode(false);
      return;
    }

    saveMutation.mutate(pendingChanges);
  };

  const handleDeleteRoadmap = () => {
    if (!window.confirm(t("profile.delete_confirm"))) return;
    deleteMutation.mutate();
  };

  return {
    roadmap: localRoadmap,
    isLoading: query.isLoading,
    isEditMode,
    isSaving: saveMutation.isPending,
    handleLocalStatusChange,
    toggleEditMode,
    handleDeleteRoadmap,
  };
};
