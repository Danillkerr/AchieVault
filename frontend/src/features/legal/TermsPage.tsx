import styles from "./LegalPage.module.css";
import { Link } from "react-router-dom";
import { useTranslation, Trans } from "react-i18next";

export const TermsPage = () => {
  const { t } = useTranslation();

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.document}>
          <h1 className={styles.title}>{t("legal.terms.title")}</h1>
          <span className={styles.lastUpdated}>{t("legal.last_updated")}</span>

          <div className={styles.section}>
            <h2>{t("legal.terms.intro_title")}</h2>
            <p>
              <Trans i18nKey="legal.terms.intro_text" />
            </p>
          </div>

          <div className={styles.section}>
            <h2>{t("legal.terms.steam_title")}</h2>
            <p>{t("legal.terms.steam_text")}</p>
            <ul>
              <li>{t("legal.terms.steam_li1")}</li>
              <li>{t("legal.terms.steam_li2")}</li>
              <li>{t("legal.terms.steam_li3")}</li>
            </ul>
          </div>

          <div className={styles.section}>
            <h2>{t("legal.terms.accounts_title")}</h2>
            <p>{t("legal.terms.accounts_text1")}</p>
            <p>{t("legal.terms.accounts_text2")}</p>
          </div>

          <div className={styles.section}>
            <h2>{t("legal.terms.ip_title")}</h2>
            <p>{t("legal.terms.ip_text1")}</p>
            <p>{t("legal.terms.ip_text2")}</p>
          </div>

          <div className={styles.section}>
            <h2>{t("legal.terms.liability_title")}</h2>
            <p>{t("legal.terms.liability_text")}</p>
          </div>

          <div className={styles.section}>
            <p>
              <Link to="/" className={styles.link}>
                &larr; {t("legal.back_home")}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
