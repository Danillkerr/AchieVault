import styles from "./SearchPage.module.css";
import { SearchForm } from "../../components/feedback/SearchForm/SearchForm";

export const SearchPage = () => {
  return (
    <div className={styles.searchPage}>
      <section className={styles.searchSection}>
        <h1 className={styles.mainTitle}>Search result</h1>
        <SearchForm variant="hero" />
        <p className={styles.resultText}>“Search result”</p>
      </section>

      <section className={styles.resultsSection}>
        <div className={styles.widget}>
          <h2>Users</h2>
          <div className={styles.stubList}>[User List Placeholder]</div>
        </div>
        <div className={styles.widget}>
          <h2>Games</h2>
          <div className={styles.stubList}>[Game List Placeholder]</div>
        </div>
      </section>
    </div>
  );
};
