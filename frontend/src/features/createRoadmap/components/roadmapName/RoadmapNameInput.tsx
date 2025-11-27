import styles from "./RoadmapNameInput.module.css";

interface Props {
  value: string;
  onChange: (val: string) => void;
}

export const RoadmapNameInput = ({ value, onChange }: Props) => {
  const isValid = value.trim().length > 0;

  return (
    <div className={styles.section}>
      <label className={styles.label}>
        Roadmap Name <span className={styles.required}>*</span>
      </label>
      <input
        type="text"
        className={`${styles.input} ${
          value.length > 0 && !isValid ? styles.inputError : ""
        }`}
        placeholder="e.g. Soulslike Marathon"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};
