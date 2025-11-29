import { Link } from "react-router-dom";
import styles from "./Header.module.css";
import { useAuth } from "@/context/useAuthContext";
import { SearchForm } from "@/components/feedback/SearchForm/SearchForm";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher/LanguageSwitcher";

export const Header = () => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const { t } = useTranslation();

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <Link to="/" className={styles.logo}>
          AchieVault
        </Link>
        <nav>
          <Link to="/global-ranking" className={styles.navLink}>
            {t("nav.ranking")}
          </Link>
        </nav>
      </div>
      <div className={styles.right}>
        <SearchForm variant="header" />

        <LanguageSwitcher />

        {!isLoading && isAuthenticated && (
          <Link to="/profile" className={styles.profileIcon}>
            {user?.avatar && (
              <img
                src={user.avatar}
                alt={user.name || "User"}
                className={styles.avatarImage}
              />
            )}
          </Link>
        )}
      </div>
    </header>
  );
};
