import styles from "./HomePage.module.css";
import { useAuth } from "../../context/useAuthContext";
import { ScreenLoader } from "../../components/common/ScreenLoader/ScreenLoader";
import { SearchForm } from "../../components/common/SearchForm/SearchForm";

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

  if (isLoading) {
    return <ScreenLoader text="Verifying authentication..." />;
  }

  return (
    <div className={styles.homePage}>
      <section className={styles.mainSection}>
        <h1 className={styles.mainTitle}>AchieVault</h1>
        {isAuthenticated ? <SearchForm variant="hero" /> : <LoginButton />}
      </section>

      <section className={styles.widgetsSection}>
        <div className={styles.widget}>
          <h2>TOP 5 USERS</h2>
          <div className={styles.stubList}>[User List Placeholder]</div>
        </div>
        <div className={styles.widget}>
          <h2>Trending Games</h2>
          <div className={styles.stubList}>[Game List Placeholder]</div>
        </div>
      </section>
    </div>
  );
};
