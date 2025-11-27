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
import type {
  RoadmapGame,
  RoadmapStatus,
} from "../../../types/roadmap.interface";
import styles from "./RoadmapComponents.module.css";

const COLUMNS: { id: RoadmapStatus; label: string; styleClass: string }[] = [
  { id: "planned", label: "Planned", styleClass: styles.headerQueue },
  {
    id: "in_progress",
    label: "In Progress",
    styleClass: styles.headerProgress,
  },
  { id: "deferred", label: "Deferred", styleClass: styles.headerAbandoned },
  { id: "completed", label: "Completed", styleClass: styles.headerCompleted },
];

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
            <span className={styles.tagDone}>Done</span>
          ) : (
            <span className={styles.tagTime}>
              {game.estimated_time_to_completion
                ? `~${(game.estimated_time_to_completion / 60 / 60).toFixed(
                    1
                  )}h`
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
  col,
  children,
  count,
}: {
  col: (typeof COLUMNS)[0];
  children: React.ReactNode;
  count: number;
}) => {
  const { setNodeRef, isOver } = useDroppable({ id: col.id });

  return (
    <div
      ref={setNodeRef}
      className={`${styles.kanbanColumn} ${isOver ? styles.columnHovered : ""}`}
    >
      <div className={`${styles.columnHeader} ${col.styleClass}`}>
        <span className={styles.columnTitle}>{col.label}</span>
        <span className={styles.columnCount}>{count}</span>
      </div>
      <div className={styles.columnContent}>{children}</div>
    </div>
  );
};

export const KanbanBoard = ({ games, isEditMode, onGameUpdate }: Props) => {
  const [activeDragGame, setActiveDragGame] = useState<RoadmapGame | null>(
    null
  );

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
      toast.error("Completed games cannot be moved back!", toastOptions);
      return false;
    }

    if (newStatus === "completed") {
      if (game.completion_percent < 100) {
        toast.error(
          `Cannot complete "${game.title}". Progress is ${game.completion_percent}% (Need 100%)`,
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
        toast.error(
          "From 'In Progress' you can only move to 'Deferred' or 'Completed'",
          toastOptions
        );
        return false;
      case "deferred":
        if (newStatus === "in_progress" || newStatus === "completed")
          return true;
        toast.error(
          "From 'Deferred' you can only move to 'In Progress' or 'Completed'",
          toastOptions
        );
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
      toast.success(`Moved to ${newStatus.replace("_", " ")}`, {
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
        {COLUMNS.map((col) => {
          const colGames = games.filter((g) => g.status === col.id);
          return (
            <DroppableColumn key={col.id} col={col} count={colGames.length}>
              {colGames.map((game) => (
                <DraggableGameCard
                  key={game.id}
                  game={game}
                  isEditMode={isEditMode}
                />
              ))}
              {colGames.length === 0 && (
                <div className={styles.emptySlot}>Empty</div>
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
                <span className={styles.tagTime}>Moving...</span>
              </div>
            </div>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};
