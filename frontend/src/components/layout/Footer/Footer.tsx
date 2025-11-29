import { Link } from "react-router-dom";
import styles from "./Footer.module.css";
import { useTranslation } from "react-i18next";

export const Footer = () => {
  const { t } = useTranslation();
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
              {t("nav.home")}
            </Link>
            <Link to="/global-ranking" className={styles.link}>
              {t("nav.ranking")}
            </Link>
            <Link to="/search" className={styles.link}>
              {t("nav.search")}
            </Link>

            <span className={styles.dot}>•</span>

            <Link to="/terms" className={styles.link}>
              {t("nav.terms")}
            </Link>
            <Link to="/privacy" className={styles.link}>
              {t("nav.privacy")}
            </Link>

            <a
              href="https://opensource.org/licenses/MIT"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
            >
              {t("nav.license")} (MIT)
            </a>
          </nav>
        </div>

        <div className={styles.divider} />

        <div className={styles.bottomRow}>
          <div className={styles.techStack}>
            <span>&copy; {currentYear} AchieVault</span>
            <span className={styles.separator}>|</span>
            <span className={styles.poweredBy}>
              {t("footer.data_provided")}{" "}
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

          <p className={styles.disclaimer}>{t("footer.disclaimer")}</p>
        </div>
      </div>
    </footer>
  );
};
