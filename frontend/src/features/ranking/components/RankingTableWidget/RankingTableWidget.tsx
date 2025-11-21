import { useState, useEffect } from "react";
import apiClient from "../../../../services/apiClient";
import { BaseWidget } from "../../../../components/widgets/BaseWidget";
import { Pagination } from "../../../../components/ui/Pagination/Pagination";
import type { LeaderboardUser } from "../../../../types/user.interface";
import type { PaginatedResponse } from "../../../../types/pagination.interface";
import styles from "./RankingTableWidget.module.css";
import { Link } from "react-router-dom";

interface Props {
  title: string;
  metric: "perfect" | "total";
}

export const RankingTableWidget = ({ title, metric }: Props) => {
  const [data, setData] = useState<LeaderboardUser[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await apiClient.get<
          PaginatedResponse<LeaderboardUser>
        >("/leaderboard/users", {
          params: {
            sort: metric === "perfect" ? "completed" : "achievement",
            page,
            limit: ITEMS_PER_PAGE,
          },
        });

        console.log("Fetched ranking data:", response.data);
        setData(response.data.data);
        setTotalPages(response.data.meta.totalPages);
      } catch (error) {
        console.error("Failed to load ranking", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [page, metric]);

  const renderMetricValue = (user: LeaderboardUser) => {
    if (metric === "perfect") {
      return (
        <div className={styles.statValue} title="100% Games">
          {user.user.completed_count}
        </div>
      );
    }
    return (
      <div className={styles.statValue} title="Total Achievements">
        {user.user.achievement_count}
      </div>
    );
  };

  return (
    <BaseWidget title={title} className={styles.widgetContainer}>
      <div className={styles.tableHeader}>
        <span className={styles.colRank}>Rank</span>
        <span className={styles.colUser}>User</span>
        <span className={styles.colStat}>
          {metric === "perfect" ? "100% Compl." : "Achievements"}
        </span>
      </div>

      <div className={styles.list}>
        {isLoading ? (
          <div className={styles.loadingState}>Loading...</div>
        ) : (
          data.map((user, index) => {
            const realRank = (page - 1) * ITEMS_PER_PAGE + index + 1;

            return (
              <Link
                key={user.id}
                to={`/profile/${user.id}`}
                className={styles.row}
              >
                <span
                  className={`${styles.rank} ${
                    realRank <= 3 ? styles.topRank : ""
                  }`}
                >
                  #{realRank}
                </span>

                <div className={styles.userInfo}>
                  <img
                    src={user.user.avatar}
                    alt={user.user.name}
                    className={styles.avatar}
                  />
                  <span className={styles.username}>{user.user.name}</span>
                </div>

                {renderMetricValue(user)}
              </Link>
            );
          })
        )}
      </div>

      <Pagination
        page={page}
        totalPages={totalPages}
        onNext={() => setPage((p) => p + 1)}
        onPrev={() => setPage((p) => p - 1)}
        isLoading={isLoading}
      />
    </BaseWidget>
  );
};
