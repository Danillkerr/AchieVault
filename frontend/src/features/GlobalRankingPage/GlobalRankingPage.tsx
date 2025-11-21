import { useAuth } from "../../context/useAuthContext";
import styles from "./GlobalRankingPage.module.css";

const RankRowStub = ({ rank }: { rank: number }) => (
  <tr>
    <td>#{rank}</td>
    <td>
      <div className={styles.userCell}>
        <div className={styles.avatarStub}></div>
        <span>User Name</span>
      </div>
    </td>
    <td>12,345</td>
    <td>150</td>
    <td>85%</td>
  </tr>
);

export const GlobalRankingPage = () => {
  const { user, isAuthenticated } = useAuth();

  return (
    <div className={styles.rankingPage}>
      <h1>Global Ranking</h1>

      {isAuthenticated && user && (
        <section className={styles.userRank}>
          <h3>Your Rank</h3>
          <div className={styles.userRankCard}>
            <span className={styles.rankNumber}>#1,234</span>
            <div className={styles.avatarStub}></div>
            <span className={styles.userName}>{user.name}</span>
            <span className={styles.points}>Points: 9,876</span>
          </div>
        </section>
      )}

      <section className={styles.globalTable}>
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Rank</th>
                <th>User</th>
                <th>Points</th>
                <th>Games</th>
                <th>Completion</th>
              </tr>
            </thead>
            <tbody>
              {[...Array(10)].map((_, i) => (
                <RankRowStub key={i} rank={i + 1} />
              ))}
            </tbody>
          </table>
        </div>

        <div className={styles.pagination}>
          <button>&laquo; Prev</button>
          <span>Page 1 of 50</span>
          <button>Next &raquo;</button>
        </div>
      </section>
    </div>
  );
};
