import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/useAuthContext";
import apiClient from "@/services/apiClient";
import styles from "./ProfileSettings.module.css";
import { useTranslation } from "react-i18next";

export const ProfileSettings = () => {
  const { t } = useTranslation();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    if (logout) logout();
    navigate("/");
  };

  const handleDeleteAccount = async () => {
    const isConfirmed = window.confirm(t("profile.delete_confirm"));

    if (!isConfirmed) return;

    const doubleCheck = window.prompt(t("profile.delete_prompt"));

    if (doubleCheck !== "DELETE") {
      alert(t("profile.delete_cancelled"));
      return;
    }

    try {
      await apiClient.delete("/users/me");
      if (logout) logout();
      navigate("/");
      alert(t("profile.delete_success"));
    } catch (error) {
      console.error("Failed to delete account", error);
      alert(t("profile.delete_error"));
    }
  };

  return (
    <section className={styles.settingsSection}>
      <h3 className={styles.title}>{t("profile.settings")}</h3>
      <div className={styles.actions}>
        <button className={styles.logoutBtn} onClick={handleLogout}>
          {t("profile.logout")}
        </button>
        <button className={styles.deleteBtn} onClick={handleDeleteAccount}>
          {t("profile.delete_account")}
        </button>
      </div>
    </section>
  );
};
