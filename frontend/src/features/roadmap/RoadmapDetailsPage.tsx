import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ScreenLoader } from "@/components/feedback/ScreenLoader/ScreenLoader";
import { useRoadmapDetails } from "@/hooks/useRoadmapDetails";
import styles from "./RoadmapDetailsPage.module.css";

import { RoadmapHeader } from "./components/RoadmapHeader";
import { GameListWidget } from "./components/GameListWidget";
import { KanbanBoard } from "./components/KanbanBoard";

export const RoadmapDetailsPage = () => {
  const { t } = useTranslation();
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

  if (isLoading && !roadmap)
    return <ScreenLoader text={t("loading.roadmap")} />;
  if (!roadmap)
    return <div className={styles.error}>{t("common.not_found")}</div>;

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
            <h2 className={styles.sectionTitle}>{t("roadmap.board_title")}</h2>

            <div className={styles.modeToggle}>
              <span
                className={
                  !isEditMode ? styles.modeLabelActive : styles.modeLabel
                }
              >
                {t("roadmap.view_mode")}
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
                {isSaving ? t("roadmap.saving") : t("roadmap.edit_mode")}
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
            {t("roadmap.delete_roadmap")}
          </button>
        </div>
      </div>
    </div>
  );
};
