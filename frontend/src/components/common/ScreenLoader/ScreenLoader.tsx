import styles from "./ScreenLoader.module.css";

interface Props {
  text?: string;
}

export const ScreenLoader = ({ text = "Loading..." }: Props) => {
  return (
    <div className={styles.loadingOverlay}>
      <div className={styles.spinner}></div>
      <span>{text}</span>
    </div>
  );
};
