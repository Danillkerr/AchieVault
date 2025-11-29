import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/context/useAuthContext";
import apiClient from "@/services/apiClient";
import styles from "./CreateRoadmapPage.module.css";
import { RoadmapNameInput } from "@/features/createRoadmap/components/roadmapName/RoadmapNameInput";
import { GameSelector } from "@/features/createRoadmap/components/gameSelector/GameSelector";
import type { LibraryGame } from "@/features/createRoadmap/components/gameCard/GameCard";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";

interface LibraryResponse {
  data: LibraryGame[];
  meta: { totalPages: number };
}

export const CreateRoadmapPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [title, setTitle] = useState("");
  const [selectedGameIds, setSelectedGameIds] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const ITEMS_PER_PAGE = 12;
  const MAX_GAMES = 10;

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const libraryQuery = useQuery({
    queryKey: ["library", user?.id, page, debouncedSearch],
    queryFn: async () => {
      const res = await apiClient.get<LibraryResponse>(
        `/user-game/${user?.id}/library`,
        {
          params: {
            page,
            limit: ITEMS_PER_PAGE,
            search: debouncedSearch || undefined,
          },
        }
      );
      return res.data;
    },
    enabled: !!user?.id,
    placeholderData: (prev) => prev,
  });

  const createMutation = useMutation({
    mutationFn: (data: { name: string; gameIds: number[] }) =>
      apiClient.post("/roadmaps/create", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });

      toast.success(t("toasts.roadmap_created"));
      navigate("/profile");
    },
    onError: () => toast.error(t("toasts.create_error")),
  });

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    setPage(1);
  };

  const toggleGame = (id: number) => {
    setSelectedGameIds((prev) => {
      if (prev.includes(id)) return prev.filter((g) => g !== id);
      if (prev.length >= MAX_GAMES) return prev;
      return [...prev, id];
    });
  };

  const isValid =
    title.trim().length > 0 &&
    selectedGameIds.length >= 3 &&
    selectedGameIds.length <= MAX_GAMES;

  return (
    <div className={styles.page}>
      <div className="container">
        <div className={styles.cardWrapper}>
          <div className={styles.card}>
            <h1 className={styles.pageTitle}>
              {t("roadmap.create_page_title")}
            </h1>
            <RoadmapNameInput value={title} onChange={setTitle} />

            <GameSelector
              games={libraryQuery.data?.data || []}
              selectedIds={selectedGameIds}
              onToggle={toggleGame}
              searchQuery={searchQuery}
              onSearchChange={handleSearchChange}
              page={page}
              setPage={setPage}
              totalPages={libraryQuery.data?.meta.totalPages || 1}
              isLoading={libraryQuery.isLoading}
              maxGames={MAX_GAMES}
            />

            <div className={styles.footer}>
              <button className={styles.cancelBtn} onClick={() => navigate(-1)}>
                {t("common.cancel")}
              </button>
              <button
                className={styles.submitBtn}
                onClick={() =>
                  createMutation.mutate({
                    name: title,
                    gameIds: selectedGameIds,
                  })
                }
                disabled={!isValid || createMutation.isPending}
              >
                {createMutation.isPending
                  ? t("common.saving")
                  : t("roadmap.create_btn")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
