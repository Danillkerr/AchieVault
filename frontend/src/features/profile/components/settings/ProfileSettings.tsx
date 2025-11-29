import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/useAuthContext";
import apiClient from "@/services/apiClient";
import styles from "./ProfileSettings.module.css";

export const ProfileSettings = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    if (logout) logout();
    navigate("/");
  };

  const handleDeleteAccount = async () => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete your account? This action is irreversible and all your data will be lost."
    );

    if (!isConfirmed) return;

    const doubleCheck = window.prompt(
      "Type 'DELETE' to confirm account deletion:"
    );

    if (doubleCheck !== "DELETE") {
      alert("Deletion cancelled.");
      return;
    }

    try {
      await apiClient.delete("/users/me");
      if (logout) logout();
      navigate("/");
      alert("Your account has been deleted.");
    } catch (error) {
      console.error("Failed to delete account", error);
      alert("Error deleting account. Please try again.");
    }
  };

  return (
    <section className={styles.settingsSection}>
      <h3 className={styles.title}>Account Settings</h3>
      <div className={styles.actions}>
        <button className={styles.logoutBtn} onClick={handleLogout}>
          Log Out
        </button>
        <button className={styles.deleteBtn} onClick={handleDeleteAccount}>
          Delete Account
        </button>
      </div>
    </section>
  );
};
