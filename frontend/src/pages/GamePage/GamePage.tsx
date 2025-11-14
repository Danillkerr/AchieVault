import { useState } from "react";
import { useAuth } from "../../context/useAuthContext";
import styles from "./GamePage.module.css";

type Tab = "achievements" | "backlog" | "guide";

export const GamePage = () => {
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("achievements");

  return (
    <div className={styles.gamePage}>
      <section className={styles.gameHeader}>
        <div className={styles.gameIconStub}></div>
        <div className={styles.gameInfo}>
          <h2>Game name</h2>
          <p>Game info...</p>
        </div>
      </section>

      <nav className={styles.tabs}>
        <button
          className={activeTab === "achievements" ? styles.activeTab : ""}
          onClick={() => setActiveTab("achievements")}
        >
          Achievements
        </button>

        {isAuthenticated && (
          <button
            className={activeTab === "backlog" ? styles.activeTab : ""}
            onClick={() => setActiveTab("backlog")}
          >
            Backlog
          </button>
        )}

        <button
          className={activeTab === "guide" ? styles.activeTab : ""}
          onClick={() => setActiveTab("guide")}
        >
          Guide
        </button>
      </nav>

      <div className={styles.tabContent}>
        {activeTab === "achievements" && <AchievementStub />}

        {activeTab === "backlog" && isAuthenticated && (
          <p>Backlog content placeholder...</p>
        )}

        {activeTab === "guide" && <GuideStub />}
      </div>
    </div>
  );
};

const AchievementStub = () => (
  <div className={styles.stubList}>
    <h3>Achievements</h3>
    <div className={styles.stubItem}>[Achievement item placeholder]</div>
    <div className={styles.stubItem}>[Achievement item placeholder]</div>
  </div>
);

const GuideStub = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className={styles.stubList}>
      {isAuthenticated && (
        <button className={styles.createButton}>+ Create new</button>
      )}
      <div className={styles.stubGrid}>
        <div className={styles.stubCard}>[Guide card placeholder]</div>
        <div className={styles.stubCard}>[Guide card placeholder]</div>
      </div>
    </div>
  );
};
