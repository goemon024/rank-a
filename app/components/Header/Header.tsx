"use client";
import React, { useEffect, useRef, useState } from "react";
import styles from "./Header.module.css";

// import Link from "next/link";
// import EditIcon from "@mui/icons-material/Edit";

import { UserIconButton } from "../UserIconButton/UserIconButton";
import { SignupSignin } from "./SignupSignin";

// import { useSession, signOut } from "next-auth/react";

import { useAuth } from "@/contexts/AuthContext";
import { ProfileWindow } from "./ProfileWindow";

export const Header = () => {
  const { user, isAuthenticated } = useAuth()
  console.log(user)

  // モーダルの開閉状態を管理
  const [isOpen, setIsOpen] = useState(false);

  // モーダルのDOM要素への参照を保持
  const modalRef = useRef<HTMLDivElement | null>(null);

  // モーダル外クリック時にモーダルを閉じる処理
  const handleClickOutside = (event: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  // モーダルが開いている間だけ、クリックイベントを監視してモーダル外クリックを検知
  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        {/* <div className={styles.logo}>Blog</div> */}
        <img src="/favicon.ico" alt="Blog Logo" className={styles.logo} />
        <nav className={styles.nav}>

          {isAuthenticated ? (
            <>
              <UserIconButton />
              <ProfileWindow />
            </>
          ) : (
            <SignupSignin />
          )}

        </nav>
      </div>
    </header>
  );
};
