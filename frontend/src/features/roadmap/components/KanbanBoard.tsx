import { useState } from "react";
import { Link } from "react-router-dom";
import {
  DndContext,
  useDraggable,
  useDroppable,
  DragOverlay,
  defaultDropAnimationSideEffects,
} from "@dnd-kit/core";
import type {
  DragEndEvent,
  DragStartEvent,
  DropAnimation,
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { toast } from "react-hot-toast";
import type { RoadmapGame, RoadmapStatus } from "@/types/roadmap.interface";
import styles from "./RoadmapComponents.module.css";
import { useTranslation } from "react-i18next";

interface Props {
  games: RoadmapGame[];
  isEditMode: boolean;
  onGameUpdate: (gameId: number, newStatus: RoadmapStatus) => void;
}

const DraggableGameCard = ({
  game,
  isEditMode,
}: {
  game: RoadmapGame;
  isEditMode: boolean;
}) => {
  const { t } = useTranslation();
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: game.id.toString(),
      data: { game },
      disabled: !isEditMode,
    });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0 : 1,
    cursor: isEditMode ? "grab" : "pointer",
  };

  const content = (
    <>
      <div className={styles.kbCoverWrapper}>
        <img
          src={`https://images.igdb.com/igdb/image/upload/t_cover_big/${game.cover}.jpg`}
          className={styles.kbCover}
          alt={game.title}
        />
      </div>
      <div className={styles.kbInfo}>
        <span className={styles.kbTitle}>{game.title}</span>
        <div className={styles.kbMeta}>
          {game.status === "completed" ? (
            <span className={styles.tagDone}>
              {t("roadmap.status.completed")}
            </span>
          ) : (
            <span className={styles.tagTime}>
              {game.estimated_time_to_completion
                ? `~${(game.estimated_time_to_completion / 60 / 60).toFixed(
                    1
                  )}${t("common.hours_short")}`
                : "N/A"}
            </span>
          )}
        </div>
      </div>
    </>
  );

  if (isEditMode) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        {...listeners}
        {...attributes}
        className={styles.kanbanCard}
      >
        {content}
      </div>
    );
  }

  return (
    <Link to={`/game/${game.steam_id}`} className={styles.kanbanCard}>
      {content}
    </Link>
  );
};

const DroppableColumn = ({
  id,
  label,
  styleClass,
  children,
  count,
}: {
  id: string;
  label: string;
  styleClass: string;
  children: React.ReactNode;
  count: number;
}) => {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`${styles.kanbanColumn} ${isOver ? styles.columnHovered : ""}`}
    >
      <div className={`${styles.columnHeader} ${styleClass}`}>
        <span className={styles.columnTitle}>{label}</span>
        <span className={styles.columnCount}>{count}</span>
      </div>
      <div className={styles.columnContent}>{children}</div>
    </div>
  );
};

export const KanbanBoard = ({ games, isEditMode, onGameUpdate }: Props) => {
  const { t } = useTranslation();
  const [activeDragGame, setActiveDragGame] = useState<RoadmapGame | null>(
    null
  );

  const columns: { id: RoadmapStatus; label: string; styleClass: string }[] = [
    {
      id: "planned",
      label: t("roadmap.status.planned"),
      styleClass: styles.headerQueue,
    },
    {
      id: "in_progress",
      label: t("roadmap.status.in_progress"),
      styleClass: styles.headerProgress,
    },
    {
      id: "deferred",
      label: t("roadmap.status.deferred"),
      styleClass: styles.headerAbandoned,
    },
    {
      id: "completed",
      label: t("roadmap.status.completed"),
      styleClass: styles.headerCompleted,
    },
  ];

  const isValidTransition = (
    game: RoadmapGame,
    newStatus: RoadmapStatus
  ): boolean => {
    const oldStatus = game.status;
    if (oldStatus === newStatus) return false;

    const toastOptions = {
      style: {
        border: "1px solid #ef4444",
        padding: "16px",
        color: "#ef4444",
        background: "#fff",
      },
      iconTheme: { primary: "#ef4444", secondary: "#FFFAEE" },
    };

    if (oldStatus === "completed") {
      toast.error(t("toasts.completed_revert_error"), toastOptions);
      return false;
    }

    if (newStatus === "completed") {
      if (game.completion_percent < 100) {
        toast.error(
          t("toasts.completion_requirement_error", {
            title: game.title,
            percent: game.completion_percent,
          }),
          toastOptions
        );
        return false;
      }
    }

    switch (oldStatus) {
      case "planned":
        return true;
      case "in_progress":
        if (newStatus === "deferred" || newStatus === "completed") return true;
        toast.error(t("toasts.move_progress_error"), toastOptions);
        return false;
      case "deferred":
        if (newStatus === "in_progress" || newStatus === "completed")
          return true;
        toast.error(t("toasts.move_deferred_error"), toastOptions);
        return false;
      default:
        return false;
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveDragGame(event.active.data.current?.game || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveDragGame(null);

    if (!over) return;

    const gameId = Number(active.id);
    const newStatus = over.id as RoadmapStatus;
    const game = active.data.current?.game as RoadmapGame;

    if (isValidTransition(game, newStatus)) {
      onGameUpdate(gameId, newStatus);

      const statusLabel = t(`roadmap.status.${newStatus}`);
      toast.success(t("toasts.moved_to", { status: statusLabel }), {
        icon: "👌",
        style: { borderRadius: "10px", background: "#333", color: "#fff" },
      });
    }
  };

  const dropAnimation: DropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: { active: { opacity: "0.5" } },
    }),
  };

  return (
    <DndContext onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
      <div className={styles.kanbanContainer}>
        {columns.map((col) => {
          const colGames = games.filter((g) => g.status === col.id);
          return (
            <DroppableColumn
              key={col.id}
              id={col.id}
              label={col.label}
              styleClass={col.styleClass}
              count={colGames.length}
            >
              {colGames.map((game) => (
                <DraggableGameCard
                  key={game.id}
                  game={game}
                  isEditMode={isEditMode}
                />
              ))}
              {colGames.length === 0 && (
                <div className={styles.emptySlot}>
                  {t("roadmap.empty_slot")}
                </div>
              )}
            </DroppableColumn>
          );
        })}
      </div>

      <DragOverlay dropAnimation={dropAnimation}>
        {activeDragGame ? (
          <div className={`${styles.kanbanCard} ${styles.cardDragging}`}>
            <div className={styles.kbCoverWrapper}>
              <img
                src={`https://images.igdb.com/igdb/image/upload/t_cover_big/${activeDragGame.cover}.jpg`}
                className={styles.kbCover}
                alt=""
              />
            </div>
            <div className={styles.kbInfo}>
              <span className={styles.kbTitle}>{activeDragGame.title}</span>
              <div className={styles.kbMeta}>
                <span className={styles.tagTime}>{t("roadmap.moving")}</span>
              </div>
            </div>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};
