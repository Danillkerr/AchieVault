import styles from "./HomePage.module.css";

const LoginButton = () => {
  const BACKEND_URL =
    import.meta.env.REACT_APP_BACKEND_URL || "http://localhost:3000";

  const handleLogin = () => {
    window.location.href = `${BACKEND_URL}/auth/steam`;
  };

  return (
    <button className={styles.loginButton} onClick={handleLogin}>
      Log via Steam
    </button>
  );
};

export const HomePage = () => {
  return (
    <div className={styles.homePage}>
      <section className={styles.loginSection}>
        <h1 className={styles.mainTitle}>AchieVault</h1>
        <LoginButton />
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
