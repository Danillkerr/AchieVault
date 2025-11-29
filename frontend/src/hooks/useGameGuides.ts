import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/services/apiClient";
import { useAuth } from "@/context/useAuthContext";
import type {
  Guide,
  CreateGuideDto,
  GuidesResponse,
} from "@/types/guide.interface";
import { toast } from "react-hot-toast";

export const useGameGuides = (gameId: string | undefined) => {
  const { user } = useAuth();
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["guides", gameId, page],
    queryFn: async () => {
      const res = await apiClient.get<GuidesResponse>(`/guides/`, {
        params: { page, limit: 5, gameId, userId: user?.id },
      });
      return res.data;
    },
    enabled: !!gameId,
    placeholderData: (previousData) => previousData,
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateGuideDto) => apiClient.post(`/guides/`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["guides", gameId] });
      setPage(1);
      toast.success("Guide published successfully!");
    },
    onError: () => toast.error("Failed to create guide"),
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: Pick<CreateGuideDto, "title" | "text">;
    }) => apiClient.put(`/guides/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["guides", gameId] });
      toast.success("Guide updated!");
    },
    onError: () => toast.error("Failed to update guide"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiClient.delete(`/guides/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["guides", gameId] });
      toast.success("Guide deleted!");
    },
    onError: () => toast.error("Failed to delete guide"),
  });

  return {
    guides: query.data?.data || [],
    totalPages: query.data?.meta.totalPages || 1,
    isLoading: query.isLoading,
    page,
    setPage,
    createGuide: createMutation.mutateAsync,
    updateGuide: (id: number, data: Guide) =>
      updateMutation.mutateAsync({ id, data }),
    deleteGuide: deleteMutation.mutateAsync,
  };
};
