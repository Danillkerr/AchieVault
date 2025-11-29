import { useTranslation } from "react-i18next";
import styles from "./LanguageSwitcher.module.css";

export const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  return (
    <div className={styles.switcherContainer}>
      <button
        className={`${styles.langBtn} ${
          i18n.language === "uk" ? styles.active : ""
        }`}
        onClick={() => changeLanguage("uk")}
        aria-label="Switch to Ukrainian"
      >
        <span className={styles.flag}>🇺🇦</span>
        <span className={styles.langCode}>UA</span>
      </button>

      <button
        className={`${styles.langBtn} ${
          i18n.language === "en" ? styles.active : ""
        }`}
        onClick={() => changeLanguage("en")}
        aria-label="Switch to English"
      >
        <span className={styles.flag}>🇺🇸</span>
        <span className={styles.langCode}>EN</span>
      </button>
    </div>
  );
};
