// components/LoadingModal.tsx
import styles from "./LoadingModal.module.css";

export default function LoadingModal() {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.spinner}></div>
        <p className={styles.message}>now loading</p>
      </div>
    </div>
  );
}
