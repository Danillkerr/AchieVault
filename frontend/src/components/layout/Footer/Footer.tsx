import { Link } from "react-router-dom";
import styles from "./Footer.module.css";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.topRow}>
          <div className={styles.brandSection}>
            <h3 className={styles.brand}>AchieVault</h3>
            <span className={styles.version}>v1.0</span>
          </div>

          <nav className={styles.nav}>
            <Link to="/" className={styles.link}>
              Home
            </Link>
            <Link to="/global-ranking" className={styles.link}>
              Ranking
            </Link>
            <Link to="/search" className={styles.link}>
              Search
            </Link>

            <span className={styles.dot}>•</span>

            <Link to="/terms" className={styles.link}>
              Terms
            </Link>
            <Link to="/privacy" className={styles.link}>
              Privacy
            </Link>

            <a
              href="https://opensource.org/licenses/MIT"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
            >
              License (MIT)
            </a>
          </nav>
        </div>

        <div className={styles.divider} />

        <div className={styles.bottomRow}>
          <div className={styles.techStack}>
            <span>&copy; {currentYear} AchieVault</span>
            <span className={styles.separator}>|</span>
            <span className={styles.poweredBy}>
              Data provided by{" "}
              <a
                href="https://steamcommunity.com/dev"
                target="_blank"
                rel="noreferrer"
              >
                Steam
              </a>{" "}
              &{" "}
              <a
                href="https://www.igdb.com/api"
                target="_blank"
                rel="noreferrer"
              >
                IGDB
              </a>
            </span>
          </div>

          <p className={styles.disclaimer}>
            Steam and the Steam logo are trademarks of Valve Corporation. All
            other trademarks are property of their respective owners. Not
            affiliated with Valve.
          </p>
        </div>
      </div>
    </footer>
  );
};
