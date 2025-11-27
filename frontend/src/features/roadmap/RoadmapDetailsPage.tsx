import { useParams } from "react-router-dom";
import { ScreenLoader } from "../../components/feedback/ScreenLoader/ScreenLoader";
import { useRoadmapDetails } from "../../hooks/useRoadmapDetails";
import styles from "./RoadmapDetailsPage.module.css";

import { RoadmapHeader } from "./components/RoadmapHeader";
import { GameListWidget } from "./components/GameListWidget";
import { KanbanBoard } from "./components/KanbanBoard";

export const RoadmapDetailsPage = () => {
  const { id } = useParams<{ id: string }>();

  const {
    roadmap,
    isLoading,
    isEditMode,
    isSaving,
    handleLocalStatusChange,
    toggleEditMode,
    handleDeleteRoadmap,
  } = useRoadmapDetails(id);

  if (isLoading) return <ScreenLoader text="Loading roadmap..." />;
  if (!roadmap) return <div className={styles.error}>Roadmap not found</div>;

  return (
    <div className={styles.page}>
      <div className={styles.contentWrapper}>
        <div className={styles.topGrid}>
          <div className={styles.mainInfo}>
            <RoadmapHeader roadmap={roadmap} />
          </div>
          <div className={styles.sideInfo}>
            <GameListWidget games={roadmap.games} />
          </div>
        </div>

        <div className={styles.boardSection}>
          <div className={styles.boardHeader}>
            <h2 className={styles.sectionTitle}>Progress Board</h2>

            <div className={styles.modeToggle}>
              <span
                className={
                  !isEditMode ? styles.modeLabelActive : styles.modeLabel
                }
              >
                View
              </span>

              <button
                className={`${styles.switchBtn} ${
                  isEditMode ? styles.switchActive : ""
                }`}
                onClick={toggleEditMode}
                disabled={isSaving}
              >
                <div className={styles.switchKnob} />
              </button>

              <span
                className={
                  isEditMode ? styles.modeLabelActive : styles.modeLabel
                }
              >
                {isSaving ? "Saving..." : "Edit"}
              </span>
            </div>
          </div>

          <KanbanBoard
            games={roadmap.games}
            isEditMode={isEditMode}
            onGameUpdate={handleLocalStatusChange}
          />
        </div>

        <div className={styles.footerActions}>
          <button
            className={`${styles.actionBtn} ${styles.deleteBtn}`}
            onClick={handleDeleteRoadmap}
            disabled={isEditMode || isSaving}
          >
            Delete Roadmap
          </button>
        </div>
      </div>
    </div>
  );
};
