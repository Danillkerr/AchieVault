import styles from "./SearchPage.module.css";
import { useSearch } from "@/hooks/useSearch";
import { SearchForm } from "@/components/feedback/SearchForm/SearchForm";
import { ScreenLoader } from "@/components/feedback/ScreenLoader/ScreenLoader";
import { UserListWidget } from "./components/UserListWidget";
import { GameListWidget } from "./components/GameListWidget";
import { useTranslation } from "react-i18next";

export const SearchPage = () => {
  const { t } = useTranslation();
  const { users, games, isLoading, query } = useSearch();

  if (isLoading) {
    return <ScreenLoader text={t("loading.searching")} />;
  }

  return (
    <div className={styles.searchPage}>
      <section className={styles.heroSection}>
        <h1 className={styles.title}>{t("search.title")}</h1>

        <div className={styles.searchContainer}>
          <SearchForm variant="hero" />
        </div>

        {query && <h2 className={styles.queryDisplay}>“{query}”</h2>}
      </section>

      <section className={styles.resultsSection}>
        <div className={styles.grid}>
          <div className={styles.widgetWrapper}>
            <UserListWidget users={users} />
          </div>

          <div className={styles.widgetWrapper}>
            <GameListWidget games={games} />
          </div>
        </div>
      </section>
    </div>
  );
};
