import styles from "./GlobalRankingPage.module.css";
import { RankingTableWidget } from "./components/RankingTableWidget/RankingTableWidget";
import { UserRankBanner } from "./components/UserRankBanner/UserRankBanner";

export const GlobalRankingPage = () => {
  return (
    <div className={styles.page}>
      <section className={styles.heroSection}>
        <h1 className={styles.title}>Global Ranking</h1>
        <p className={styles.subtitle}>
          Top players by completion and dedication
        </p>
        <div
          style={{
            marginTop: "30px",
            width: "100%",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <UserRankBanner />
        </div>
      </section>

      <section className={styles.tablesSection}>
        <div className={styles.grid}>
          <div className={styles.tableWrapper}>
            <RankingTableWidget
              title="Completionists Leaderboard"
              metric="perfect"
            />
          </div>

          <div className={styles.tableWrapper}>
            <RankingTableWidget title="Achievement Hunters" metric="total" />
          </div>
        </div>
      </section>
    </div>
  );
};
