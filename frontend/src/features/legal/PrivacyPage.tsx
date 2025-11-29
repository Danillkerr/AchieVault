import styles from "./LegalPage.module.css";
import { Link } from "react-router-dom";
import { useTranslation, Trans } from "react-i18next";

export const PrivacyPage = () => {
  const { t } = useTranslation();

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.document}>
          <h1 className={styles.title}>{t("legal.privacy.title")}</h1>
          <span className={styles.lastUpdated}>{t("legal.last_updated")}</span>

          <div className={styles.section}>
            <h2>{t("legal.privacy.collect_title")}</h2>
            <p>{t("legal.privacy.collect_text")}</p>
            <ul>
              <li>
                <strong>{t("legal.privacy.collect_li1_strong")}</strong>{" "}
                {t("legal.privacy.collect_li1_text")}
              </li>
              <li>
                <strong>{t("legal.privacy.collect_li2_strong")}</strong>{" "}
                {t("legal.privacy.collect_li2_text")}
              </li>
            </ul>
          </div>

          <div className={styles.section}>
            <h2>{t("legal.privacy.usage_title")}</h2>
            <p>{t("legal.privacy.usage_text")}</p>
            <ul>
              <li>{t("legal.privacy.usage_li1")}</li>
              <li>{t("legal.privacy.usage_li2")}</li>
              <li>{t("legal.privacy.usage_li3")}</li>
            </ul>
          </div>

          <div className={styles.section}>
            <h2>{t("legal.privacy.third_party_title")}</h2>
            <p>{t("legal.privacy.third_party_text")}</p>
            <ul>
              <li>
                <a
                  href="https://store.steampowered.com/privacy_agreement/"
                  target="_blank"
                  rel="noreferrer"
                  className={styles.link}
                >
                  Valve Corporation (Steam)
                </a>
              </li>
              <li>
                <a
                  href="https://www.igdb.com/privacy"
                  target="_blank"
                  rel="noreferrer"
                  className={styles.link}
                >
                  IGDB (Game Metadata)
                </a>
              </li>
            </ul>
          </div>

          <div className={styles.section}>
            <h2>{t("legal.privacy.retention_title")}</h2>
            <p>
              <Trans i18nKey="legal.privacy.retention_text1" />
            </p>
            <p>{t("legal.privacy.retention_text2")}</p>
          </div>

          <div className={styles.section}>
            <h2>{t("legal.privacy.cookies_title")}</h2>
            <p>{t("legal.privacy.cookies_text")}</p>
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
