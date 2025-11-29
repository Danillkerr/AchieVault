import styles from "./RoadmapNameInput.module.css";
import { useTranslation } from "react-i18next";

interface Props {
  value: string;
  onChange: (val: string) => void;
}

export const RoadmapNameInput = ({ value, onChange }: Props) => {
  const { t } = useTranslation();
  const isValid = value.trim().length > 0;

  return (
    <div className={styles.section}>
      <label className={styles.label}>
        {t("roadmap.roadmap_name")} <span className={styles.required}>*</span>
      </label>
      <input
        type="text"
        className={`${styles.input} ${
          value.length > 0 && !isValid ? styles.inputError : ""
        }`}
        placeholder={t("roadmap.example_name")}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};
