import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import styles from "./GuideComponents.module.css";
import { useTranslation } from "react-i18next";

interface Props {
  value: string;
  onChange: (content: string) => void;
}

export const GuideEditor = ({ value, onChange }: Props) => {
  const { t } = useTranslation();

  const modules = {
    toolbar: [
      [{ header: [2, 3, false] }],
      ["bold", "italic", "underline", "blockquote"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image", "video"],
      ["clean"],
    ],
  };

  return (
    <div className={styles.editorWrapper}>
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        className={styles.quill}
        placeholder={t("game.guides.form_description")}
      />
    </div>
  );
};
