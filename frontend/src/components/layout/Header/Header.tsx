import { Link } from "react-router-dom";
import styles from "./Header.module.css";
import { useAuth } from "../../../context/useAuthContext";
import { SearchForm } from "../../common/SearchForm/SearchForm";

export const Header = () => {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <Link to="/" className={styles.logo}>
          AchieVault
        </Link>
        <nav>
          <Link to="/global-ranking" className={styles.navLink}>
            Global ranking
          </Link>
        </nav>
      </div>
      <div className={styles.right}>
        <SearchForm variant="header" />
        {!isLoading && isAuthenticated && (
          <Link to="/profile" className={styles.profileIcon}>
            P
          </Link>
        )}
      </div>
    </header>
  );
};
