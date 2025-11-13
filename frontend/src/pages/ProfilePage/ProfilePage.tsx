import styles from "./ProfilePage.module.css";

export const ProfilePage = () => {
  return (
    <div className={styles.profilePage}>
      <section className={styles.topSection}>
        <div className={styles.profileHeader}>
          <div className={styles.avatarStub}></div>
          <div className={styles.profileInfo}>
            <h2>Profile name</h2>
            <p>Profile info</p>
            <p>Profile info</p>
            <p>Profile info</p>
          </div>
        </div>

        <div className={styles.friendRating}>
          <h3>Friend rating</h3>
          <div className={styles.stubList}>[Friend List Placeholder]</div>
          <button className={styles.moreButton}>More</button>
        </div>
      </section>

      <section className={styles.roadmap}>
        <h3>Roadmap</h3>
        <div className={styles.stubCard}>[Roadmap Details Placeholder]</div>
      </section>

      <section className={styles.library}>
        <h3>Library games</h3>
        <div className={styles.gameGrid}>
          <div className={styles.stubCard}>[Game Card Placeholder]</div>
          <div className={styles.stubCard}>[Game Card Placeholder]</div>
          <div className={styles.stubCard}>[Game Card Placeholder]</div>
          <div className={styles.stubCard}>[Game Card Placeholder]</div>
        </div>
        <button className={styles.moreButton}>More</button>
      </section>
    </div>
  );
};
