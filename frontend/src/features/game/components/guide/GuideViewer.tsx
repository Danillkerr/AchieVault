import DOMPurify from "dompurify";
import styles from "./GuideComponents.module.css";

interface Props {
  content: string;
}

export const GuideViewer = ({ content }: Props) => {
  const cleanHTML = DOMPurify.sanitize(content, {
    ADD_TAGS: ["iframe"],
    ADD_ATTR: ["allow", "allowfullscreen", "frameborder", "scrolling", "src"],
  });

  return (
    <div
      className={`${styles.viewer} ql-editor`}
      dangerouslySetInnerHTML={{ __html: cleanHTML }}
    />
  );
};
