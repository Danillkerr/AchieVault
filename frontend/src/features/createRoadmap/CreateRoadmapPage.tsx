import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuthContext";
import apiClient from "../../services/apiClient";
import styles from "./CreateRoadmapPage.module.css";

import { RoadmapNameInput } from "./components/roadmapName/RoadmapNameInput";
import { GameSelector } from "./components/gameSelector/GameSelector";
import type { LibraryGame } from "./components/gameCard/GameCard";
import { toast } from "react-hot-toast";

interface LibraryResponse {
  data: LibraryGame[];
  meta: {
    totalPages: number;
  };
}

export const CreateRoadmapPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [title, setTitle] = useState("");
  const [selectedGameIds, setSelectedGameIds] = useState<number[]>([]);

  const [games, setGames] = useState<LibraryGame[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const ITEMS_PER_PAGE = 12;
  const MAX_GAMES = 10;

  useEffect(() => {
    if (!user?.id) return;

    const fetchLibrary = async () => {
      setIsLoading(true);
      try {
        const res = await apiClient.get<LibraryResponse>(
          `/user-game/${user.id}/library`,
          {
            params: {
              page: page,
              limit: ITEMS_PER_PAGE,
              search: searchQuery || undefined,
            },
          }
        );
        setGames(res.data.data);
        setTotalPages(res.data.meta.totalPages);
      } catch (error) {
        console.error("Failed to fetch library", error);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(() => fetchLibrary(), 500);
    return () => clearTimeout(debounceTimer);
  }, [page, searchQuery, user?.id]);

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

  const isTitleValid = title.trim().length > 0;
  const isSelectionValid =
    selectedGameIds.length >= 3 && selectedGameIds.length <= MAX_GAMES;
  const isValid = isTitleValid && isSelectionValid;

  const handleSubmit = async () => {
    if (!isValid) return;

    const toastId = toast.loading("Creating roadmap...");

    try {
      await apiClient.post("/roadmaps/create", {
        name: title,
        gameIds: selectedGameIds,
      });
      toast.success("Roadmap created successfully!", { id: toastId });
      navigate("/profile");
    } catch (error) {
      console.error("Failed to create roadmap", error);
      toast.error("Error creating roadmap", { id: toastId });
    }
  };

  return (
    <div className={styles.page}>
      <div className="container">
        <div className={styles.cardWrapper}>
          <div className={styles.card}>
            <h1 className={styles.pageTitle}>New Roadmap</h1>

            <RoadmapNameInput value={title} onChange={setTitle} />

            <GameSelector
              games={games}
              selectedIds={selectedGameIds}
              onToggle={toggleGame}
              searchQuery={searchQuery}
              onSearchChange={handleSearchChange}
              page={page}
              setPage={setPage}
              totalPages={totalPages}
              isLoading={isLoading}
              maxGames={MAX_GAMES}
            />

            <div className={styles.footer}>
              <button className={styles.cancelBtn} onClick={() => navigate(-1)}>
                Cancel
              </button>
              <button
                className={styles.submitBtn}
                onClick={handleSubmit}
                disabled={!isValid}
              >
                Create Roadmap
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
