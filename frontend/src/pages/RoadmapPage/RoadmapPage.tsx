import styles from "./RoadmapPage.module.css";

const KanbanCardStub = () => (
  <div className={styles.kanbanCard}>
    <div className={styles.cardIcon}></div>
    <div className={styles.cardInfo}>
      <strong>Game name</strong>
      <small>12 h 30 m</small>
      <small>ETC</small>
    </div>
  </div>
);

export const RoadmapPage = () => {
  return (
    <div className={styles.roadmapPage}>
      <section className={styles.topSection}>
        <div className={styles.roadmapHeader}>
          <h2>Roadmap name</h2>
          <div className={styles.roadmapInfo}>
            <span>ETC time: ~100 hrs.</span>
            <span>Total achievements: 12345</span>
          </div>
          <div className={styles.recommendedGame}>
            <p>Recommended game to complete:</p>
            <div className={styles.gameCardStub}>
              [Recommended Game Card Stub]
            </div>
          </div>
        </div>

        <div className={styles.gameListWidget}>
          <h3>Game list</h3>
          <div className={styles.stubList}>[Game List Item Stub]</div>
          <div className={styles.stubList}>[Game List Item Stub]</div>
          <div className={styles.stubList}>[Game List Item Stub]</div>
          <button className={styles.moreButton}>More</button>
        </div>
      </section>

      <section className={styles.kanbanContainer}>
        <h3>Kanban board</h3>
        <div className={styles.kanbanBoard}>
          <div className={styles.kanbanColumn}>
            <h4>Completed</h4>
            <KanbanCardStub />
            <KanbanCardStub />
          </div>
          <div className={styles.kanbanColumn}>
            <h4>In progress</h4>
            <KanbanCardStub />
          </div>
          <div className={styles.kanbanColumn}>
            <h4>Deferred</h4>
            <KanbanCardStub />
          </div>
          <div className={styles.kanbanColumn}>
            <h4>Planned</h4>
            <KanbanCardStub />
            <KanbanCardStub />
            <KanbanCardStub />
          </div>
        </div>
      </section>

      <footer className={styles.actionsFooter}>
        <button className={styles.actionButton}>Change status</button>
        <button className={`${styles.actionButton} ${styles.deleteButton}`}>
          Delete
        </button>
      </footer>
    </div>
  );
};
