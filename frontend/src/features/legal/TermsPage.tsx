import styles from "./LegalPage.module.css";
import { Link } from "react-router-dom";

export const TermsPage = () => {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.document}>
          <h1 className={styles.title}>Terms of Use</h1>
          <span className={styles.lastUpdated}>
            Last Updated: November 27, 2025
          </span>

          <div className={styles.section}>
            <h2>1. Introduction</h2>
            <p>
              Welcome to <strong>AchieVault</strong>. By accessing or using our
              website, you agree to be bound by these Terms of Use and our
              Privacy Policy. If you do not agree with any part of these terms,
              you must not use our service.
            </p>
          </div>

          <div className={styles.section}>
            <h2>2. Steam Integration</h2>
            <p>
              AchieVault utilizes the Steam Web API to retrieve game and
              achievement data. By using our service, you acknowledge that:
            </p>
            <ul>
              <li>
                We are not affiliated, associated, authorized, endorsed by, or
                in any way officially connected with Valve Corporation or Steam.
              </li>
              <li>
                Your Steam profile data must be set to "Public" for our service
                to track your progress effectively.
              </li>
              <li>
                All game images, logos, and titles are property of their
                respective owners.
              </li>
            </ul>
          </div>

          <div className={styles.section}>
            <h2>3. User Accounts</h2>
            <p>
              When you create an account with us, you must provide accurate and
              complete information. You are solely responsible for the activity
              that occurs on your account.
            </p>
            <p>
              We reserve the right to terminate or suspend your account
              immediately, without prior notice or liability, for any reason
              whatsoever, including without limitation if you breach the Terms.
            </p>
          </div>

          <div className={styles.section}>
            <h2>4. Intellectual Property</h2>
            <p>
              The AchieVault platform, including its original content, features,
              and functionality, is and will remain the exclusive property of
              AchieVault and its licensors.
            </p>
            <p>
              Game content and materials are trademarks and copyrights of their
              respective publishers and its licensors.
            </p>
          </div>

          <div className={styles.section}>
            <h2>5. Limitation of Liability</h2>
            <p>
              In no event shall AchieVault, nor its directors, employees,
              partners, agents, suppliers, or affiliates, be liable for any
              indirect, incidental, special, consequential or punitive damages,
              including without limitation, loss of profits, data, use,
              goodwill, or other intangible losses.
            </p>
          </div>

          {/* <div className={styles.section}>
            <h2>6. Contact Us</h2>
            <p>
              If you have any questions about these Terms, please contact us at{" "}
              <a href="mailto:support@achievault.com" className={styles.link}>
                support@achievault.com
              </a>
              .
            </p>
          </div> */}

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
