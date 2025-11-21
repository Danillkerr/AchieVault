import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./SearchForm.module.css";

type SearchVariant = "header" | "hero";

interface Props {
  variant: SearchVariant;
}

export const SearchForm = ({ variant }: Props) => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/search?q=${query}`);
  };

  useEffect(() => {
    setQuery("");
  }, [location.pathname]);

  const formClass = `${styles.searchForm} ${styles[variant]}`;

  return (
    <form onSubmit={handleSearch} className={formClass}>
      <input
        type="search"
        placeholder="Search..."
        className={styles.searchBar}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {variant === "hero" ? (
        <button type="submit" className={styles.searchButton}>
          Search
        </button>
      ) : (
        <button type="submit" className={styles.hiddenSubmit}>
          Search
        </button>
      )}
    </form>
  );
};
