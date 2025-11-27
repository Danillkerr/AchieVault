import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import apiClient from "../services/apiClient";
import type { Roadmap, RoadmapStatus } from "../types/roadmap.interface";
import { useSync } from "../context/useSyncContext";

export const useRoadmapDetails = (roadmapId: string | undefined) => {
  const navigate = useNavigate();
  const { refreshKey } = useSync();

  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [pendingChanges, setPendingChanges] = useState<
    Record<number, RoadmapStatus>
  >({});

  const fetchRoadmap = useCallback(async () => {
    if (!roadmapId) return;
    setIsLoading(true);
    try {
      const res = await apiClient.get<Roadmap>(
        `/roadmaps/${roadmapId}/details`
      );

      setRoadmap(res.data);
    } catch (error) {
      console.error("Failed to load roadmap", error);
      toast.error("Could not load roadmap");
    } finally {
      setIsLoading(false);
    }
  }, [roadmapId]);

  useEffect(() => {
    fetchRoadmap();
  }, [fetchRoadmap, refreshKey]);

  const handleLocalStatusChange = (
    gameId: number,
    newStatus: RoadmapStatus
  ) => {
    if (!roadmap) return;

    const updatedGames = roadmap.games.map((g) =>
      g.id === gameId ? { ...g, status: newStatus } : g
    );
    setRoadmap({ ...roadmap, games: updatedGames });

    setPendingChanges((prev) => ({
      ...prev,
      [gameId]: newStatus,
    }));
  };

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

    setIsSaving(true);
    const toastId = toast.loading("Saving changes...");

    try {
      const updatePromises = Object.entries(pendingChanges).map(
        ([gameId, status]) =>
          apiClient.patch(`/roadmaps/${roadmapId}/games/${gameId}`, { status })
      );

      await Promise.all(updatePromises);

      toast.success(`Updated ${changesCount} games`, { id: toastId });
      setPendingChanges({});
      setIsEditMode(false);
    } catch (error) {
      console.error("Failed to save updates", error);
      toast.error("Failed to save changes", { id: toastId });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteRoadmap = async () => {
    if (!window.confirm("Are you sure you want to delete this roadmap?"))
      return;

    try {
      await apiClient.delete(`/roadmaps/${roadmapId}`);
      toast.success("Roadmap deleted");
      navigate("/profile");
    } catch (error) {
      console.error("Failed to delete roadmap", error);
      toast.error("Failed to delete roadmap");
    }
  };

  return {
    roadmap,
    isLoading,
    isEditMode,
    isSaving,
    handleLocalStatusChange,
    toggleEditMode,
    handleDeleteRoadmap,
  };
};
