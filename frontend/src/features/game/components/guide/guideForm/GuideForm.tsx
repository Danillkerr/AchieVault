import { GuideEditor } from "../GuideEditor";
import styles from "./GuideForm.module.css";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();
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
        <h3>
          {mode === "create"
            ? t("game.guides.form_title_create")
            : t("game.guides.form_title_edit")}
        </h3>
        <button className={styles.cancelBtn} onClick={onCancel}>
          {t("game.guides.back")}
        </button>
      </div>

      <div className={styles.inputGroup}>
        <input
          type="text"
          placeholder={t("game.guides.input_placeholder")}
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
            {t("game.guides.min_chars", { count: 5 })} ({titleLength})
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
            {t("game.guides.min_chars", { count: 20 })} ({contentLength})
          </span>
          <span className={isSizeValid ? styles.textSuccess : styles.textError}>
            {t("game.guides.max_size", { size: "10MB" })} (
            {totalSizeMB.toFixed(2)}MB)
          </span>
        </div>
      </div>

      <button
        className={styles.submitBtn}
        onClick={onSave}
        disabled={!isFormValid}
        title={!isFormValid ? t("game.guides.form_invalid") : ""}
      >
        {mode === "create"
          ? t("game.guides.publish")
          : t("game.guides.save_changes")}
      </button>
    </div>
  );
};
