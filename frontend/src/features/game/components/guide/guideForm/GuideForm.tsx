import { GuideEditor } from "../GuideEditor";
import styles from "./GuideForm.module.css";

interface Props {
  mode: "create" | "edit";
  title: string;
  content: string;
  setTitle: (val: string) => void;
  setContent: (val: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

export const GuideForm = ({
  mode,
  title,
  content,
  setTitle,
  setContent,
  onSave,
  onCancel,
}: Props) => {
  const titleLength = title.trim().length;
  const isTitleValid = titleLength >= 5;

  const cleanContent = content.replace(/<[^>]+>/g, "").trim();
  const contentLength = cleanContent.length;
  const isContentValid = contentLength >= 20;

  const totalSizeBytes = new Blob([title, content]).size;
  const totalSizeMB = totalSizeBytes / (1024 * 1024);
  const isSizeValid = totalSizeMB <= 10;

  const isFormValid = isTitleValid && isContentValid && isSizeValid;

  return (
    <div className={styles.createForm}>
      <div className={styles.formHeader}>
        <h3>{mode === "create" ? "Write a new Guide" : "Edit Guide"}</h3>
        <button className={styles.cancelBtn} onClick={onCancel}>
          Cancel
        </button>
      </div>

      <div className={styles.inputGroup}>
        <input
          type="text"
          placeholder="Guide Title"
          className={`${styles.titleInput} ${
            title.length > 0 && !isTitleValid ? styles.invalidInput : ""
          }`}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <div className={styles.validationRow}>
          <span
            className={isTitleValid ? styles.textSuccess : styles.textError}
          >
            Min 5 chars ({titleLength})
          </span>
        </div>
      </div>

      <div className={styles.inputGroup}>
        <div
          className={
            content.length > 0 && !isContentValid ? styles.editorInvalid : ""
          }
        >
          <GuideEditor value={content} onChange={setContent} />
        </div>

        <div className={styles.validationRow}>
          <span
            className={isContentValid ? styles.textSuccess : styles.textError}
          >
            Min 20 chars ({contentLength})
          </span>
          <span className={isSizeValid ? styles.textSuccess : styles.textError}>
            Size: {totalSizeMB.toFixed(2)}MB / 10MB
          </span>
        </div>
      </div>

      <button
        className={styles.submitBtn}
        onClick={onSave}
        disabled={!isFormValid}
        title={!isFormValid ? "Please fix errors above" : ""}
      >
        {mode === "create" ? "Publish Guide" : "Save Changes"}
      </button>
    </div>
  );
};
