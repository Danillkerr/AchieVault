import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../context/useAuthContext";
import { useGameData } from "../../hooks/useGameData";
import { ScreenLoader } from "../../components/feedback/ScreenLoader/ScreenLoader";
import styles from "./GamePage.module.css";
import { useGameAchievements } from "../../hooks/useGameAchievements";
import type { Guide } from "../../types/guide.interface";
import { useGameGuides } from "../../hooks/useGameGuides";
import { GameHero } from "./components/gameHero/GameHero";
import { AchievementsList } from "./components/achievementsList/AchievementsList";
import { GuideList } from "./components/guide/guideList/GuideList";
import { GuideForm } from "./components/guide/guideForm/GuideForm";
import { GuideDetails } from "./components/guide/guideDetails/GuideDetails";

type GuideMode = "list" | "view" | "create" | "edit";
type Tab = "achievements" | "backlog" | "guide";

export const GamePage = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const { user, isAuthenticated } = useAuth();

  const { game, isLoading: gameLoading } = useGameData(gameId);
  const { allAchievements, backlog } = useGameAchievements(gameId);
  const {
    guides,
    isLoading: guideLoading,
    createGuide,
    updateGuide,
    deleteGuide,
    page,
    setPage,
    totalPages,
  } = useGameGuides(gameId);

  const [activeTab, setActiveTab] = useState<Tab>("achievements");
  const [guideMode, setGuideMode] = useState<GuideMode>("list");
  const [selectedGuide, setSelectedGuide] = useState<Guide | null>(null);

  const [formTitle, setFormTitle] = useState("");
  const [formContent, setFormContent] = useState("");

  const guideViewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (guideMode === "view" && guideViewRef.current) {
      guideViewRef.current.scrollIntoView({
        behavior: "smooth",

        block: "start",
      });
    }
  }, [guideMode]);

  if (gameLoading) return <ScreenLoader text="Loading game data..." />;
  if (!game) return <div className={styles.error}>Game not found</div>;
  if (!gameId) return <div className={styles.error}>Invalid game ID</div>;

  const handleSaveGuide = async () => {
    if (!formTitle.trim() || !formContent.trim()) {
      alert("Title and content are required");
      return;
    }

    try {
      if (guideMode === "create") {
        if (!user?.id) return;
        await createGuide({
          title: formTitle,
          text: formContent,
          steamId: gameId,
          user_id: user?.id,
        });
      } else if (guideMode === "edit" && selectedGuide) {
        await updateGuide(selectedGuide.id, {
          title: formTitle,
          text: formContent,
        });
      }
      setGuideMode("list");
      setFormTitle("");
      setFormContent("");
      setSelectedGuide(null);
    } catch (error) {
      alert("Error saving guide" + error);
    }
  };

  const handleDeleteGuide = async () => {
    if (!selectedGuide) return;
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this guide? This action cannot be undone."
    );

    if (isConfirmed) {
      await deleteGuide(selectedGuide.id);
      setGuideMode("list");
      setSelectedGuide(null);
    }
  };

  const handleCancel = () => {
    setGuideMode("list");
    setFormTitle("");
    setFormContent("");
    setSelectedGuide(null);
  };

  const openGuide = (guide: Guide) => {
    setSelectedGuide(guide);
    setGuideMode("view");
  };

  const startEditGuide = () => {
    if (!selectedGuide) return;
    setFormTitle(selectedGuide.title);
    setFormContent(selectedGuide.text);
    setGuideMode("edit");
  };

  return (
    <div className={styles.gamePage}>
      <GameHero game={game} />

      <nav className={styles.tabsContainer}>
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${
              activeTab === "achievements" ? styles.activeTab : ""
            }`}
            onClick={() => setActiveTab("achievements")}
          >
            Achievements
            <span className={styles.badge}>{allAchievements.length}</span>
          </button>

          {isAuthenticated && (
            <button
              className={`${styles.tab} ${
                activeTab === "backlog" ? styles.activeTab : ""
              }`}
              onClick={() => setActiveTab("backlog")}
            >
              Backlog
              <span className={`${styles.badge} ${styles.badgeBacklog}`}>
                {backlog.length}
              </span>
            </button>
          )}

          <button
            className={`${styles.tab} ${
              activeTab === "guide" ? styles.activeTab : ""
            }`}
            onClick={() => setActiveTab("guide")}
          >
            Guide
          </button>
        </div>
      </nav>

      <div className={styles.contentArea}>
        {activeTab === "achievements" && (
          <AchievementsList items={allAchievements} />
        )}

        {activeTab === "backlog" && isAuthenticated && (
          <AchievementsList
            items={backlog}
            emptyMessage="All achievements completed!"
          />
        )}

        {activeTab === "guide" && (
          <div className={styles.guideSection} ref={guideViewRef}>
            {guideMode === "list" && (
              <GuideList
                guides={guides}
                loading={guideLoading}
                currentUser={user}
                onSelect={openGuide}
                onCreate={() => setGuideMode("create")}
                pagination={{ page, totalPages, setPage }}
              />
            )}

            {(guideMode === "create" || guideMode === "edit") && (
              <GuideForm
                mode={guideMode === "create" ? "create" : "edit"}
                title={formTitle}
                content={formContent}
                setTitle={setFormTitle}
                setContent={setFormContent}
                onSave={handleSaveGuide}
                onCancel={handleCancel}
              />
            )}

            {guideMode === "view" && selectedGuide && (
              <GuideDetails
                guide={selectedGuide}
                currentUser={user}
                onBack={() => setGuideMode("list")}
                onEdit={startEditGuide}
                onDelete={handleDeleteGuide}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};
