"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import styles from "./Header.module.css";

export const ProfileWindow = () => {
  const auth = useAuth();
  const router = useRouter();

  const signOut = async () => {
    await fetch("/api/users/logout", {
      method: "POST",
    }).then(() => {
      auth.logout();
      router.push("/");
    });
  };

  return (
    <div className={styles.profileWindow}>
      <p>{auth.user?.username}</p>

      <button type="button" className={styles.logoutButton} onClick={signOut}>
        Logout
      </button>
    </div>
  );
};
