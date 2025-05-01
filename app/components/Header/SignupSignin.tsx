import Link from "next/link";
import styles from "./Header.module.css";

export const SignupSignin = () => {
  return (
    <div className={styles.navButtonSection}>
      <Link href="/signup" passHref>
        <button className={styles.navButton}>Sign Up</button>
      </Link>
      <Link href="/signin" passHref>
        <button className={styles.navButton}>Sign In</button>
      </Link>
    </div>
  );
};
