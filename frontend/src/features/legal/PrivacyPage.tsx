import styles from "./LegalPage.module.css";
import { Link } from "react-router-dom";

export const PrivacyPage = () => {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.document}>
          <h1 className={styles.title}>Privacy Policy</h1>
          <span className={styles.lastUpdated}>
            Last Updated: November 27, 2025
          </span>

          <div className={styles.section}>
            <h2>1. Information We Collect</h2>
            <p>
              AchieVault collects minimal data necessary to provide our
              achievement tracking service:
            </p>
            <ul>
              <li>
                <strong>Steam Information:</strong> When you sign in via Steam,
                we receive your Steam ID, Display Name, and Avatar. We also
                access your public game library and achievement stats via the
                Steam Web API.
              </li>
              <li>
                <strong>Usage Data:</strong> We may collect information on how
                the Service is accessed and used (e.g. page views, roadmaps
                created).
              </li>
            </ul>
          </div>

          <div className={styles.section}>
            <h2>2. How We Use Your Data</h2>
            <p>We use the collected data for the following purposes:</p>
            <ul>
              <li>
                To provide and maintain our Service (tracking your progress).
              </li>
              <li>
                To allow you to participate in interactive features
                (Leaderboards, Friend Comparisons).
              </li>
              <li>To generate personalized Roadmaps and recommendations.</li>
            </ul>
          </div>

          <div className={styles.section}>
            <h2>3. Third-Party Services</h2>
            <p>
              We use third-party services to function. Please review their
              privacy policies:
            </p>
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
            <h2>4. Data Retention & Deletion</h2>
            <p>
              We retain your data only as long as your account is active. You
              have the right to delete your account at any time via the{" "}
              <strong>Profile Settings</strong>.
            </p>
            <p>
              Upon deletion, all your personal data stored on our servers
              (including roadmaps and ranking history) will be permanently
              removed. Note that we cannot delete data stored on Steam's
              servers.
            </p>
          </div>

          <div className={styles.section}>
            <h2>5. Cookies</h2>
            <p>
              We use cookies and similar tracking technologies to track the
              activity on our Service and hold certain information (e.g. keeping
              you logged in).
            </p>
          </div>

          <div className={styles.section}>
            <p>
              <Link to="/" className={styles.link}>
                &larr; Back to Home
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
