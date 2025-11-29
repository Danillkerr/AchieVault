import styles from "./GlobalRankingPage.module.css";
import { RankingTableWidget } from "./components/RankingTableWidget/RankingTableWidget";
import { UserRankBanner } from "./components/UserRankBanner/UserRankBanner";
import { useTranslation } from "react-i18next";

export const GlobalRankingPage = () => {
  const { t } = useTranslation();
  return (
    <div className={styles.page}>
      <section className={styles.heroSection}>
        <h1 className={styles.title}>{t("ranking.title")}</h1>
        <p className={styles.subtitle}>{t("ranking.subtitle")}</p>
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
              title={t("ranking.completionists")}
              metric="perfect"
            />
          </div>

          <div className={styles.tableWrapper}>
            <RankingTableWidget title={t("ranking.hunters")} metric="total" />
          </div>
        </div>
      </section>
    </div>
  );
};
