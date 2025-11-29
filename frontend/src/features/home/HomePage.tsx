import styles from "./HomePage.module.css";
import { useAuth } from "@/context/useAuthContext";
import { ScreenLoader } from "@/components/feedback/ScreenLoader/ScreenLoader";
import { SearchForm } from "@/components/feedback/SearchForm/SearchForm";
import { LeaderboardWidget } from "./components/LeaderboardWidget";
import { TrendingWidget } from "./components/TrendingWidget";
import { useHomeData } from "@/hooks/useHomeData";
import { useTranslation } from "react-i18next";

const LoginButton = () => {
  const BACKEND_URL =
    import.meta.env.REACT_APP_BACKEND_URL || "http://localhost:3000";

  const handleLogin = () => {
    window.location.href = `${BACKEND_URL}/auth/steam`;
  };

  return (
    <button className={styles.loginButton} onClick={handleLogin}>
      <img
        src="https://community.fastly.steamstatic.com/public/images/signinthroughsteam/sits_01.png"
        width="180"
        height="35"
      ></img>
    </button>
  );
};

export const HomePage = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const { t } = useTranslation();
  const {
    topPerfectUsers,
    topAchievUsers,
    trendingGames,
    loading: isDataLoading,
  } = useHomeData();

  if (isLoading) return <ScreenLoader text={t("loading.auth")} />;
  if (isDataLoading) return <ScreenLoader text={t("loading.home_data")} />;

  return (
    <div className={styles.homePage}>
      <section className={styles.heroSection}>
        <h1 className={styles.mainTitle}>AchieVault</h1>
        <p className={styles.subTitle}>{t("home.subtitle")}</p>
        <div className={styles.actionArea}>
          {isAuthenticated ? <SearchForm variant="hero" /> : <LoginButton />}
        </div>
      </section>

      <section className={styles.widgetsSection}>
        <div className={styles.widgetsGrid}>
          <div className={styles.widgetWrapper}>
            <LeaderboardWidget
              title={t("home.completionists")}
              users={topPerfectUsers}
              metric="perfect"
            />
          </div>
          <div className={styles.widgetWrapper}>
            <LeaderboardWidget
              title={t("home.hunters")}
              users={topAchievUsers}
              metric="total"
            />
          </div>
          <div className={styles.widgetWrapper}>
            <TrendingWidget games={trendingGames} />
          </div>
        </div>
      </section>
    </div>
  );
};
