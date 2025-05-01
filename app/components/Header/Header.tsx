"use client";
import React from "react";
import styles from "./Header.module.css";
import Link from "next/link";
import NavigationMenu from "./NavigationMenu";

// import Link from "next/link";
// import EditIcon from "@mui/icons-material/Edit";

import { UserIconButton } from "../UserIconButton/UserIconButton";
import { SignupSignin } from "./SignupSignin";

// import { useSession, signOut } from "next-auth/react";

import { useAuth } from "@/contexts/AuthContext";
import { ProfileWindow } from "./ProfileWindow";
import { NavLinks } from "@/types";

export const Header = ({ links }: { links: NavLinks[] }) => {
  const { user, isAuthenticated } = useAuth();

  try {
    return (
      <header className={styles.header}>
        <div className={styles.inner}>
          <Link href="/">
            <img src="/favicon.ico" alt="Blog Logo" className={styles.logo} />
          </Link>
          <nav className={styles.nav}>
            {isAuthenticated ? (
              <>
                <UserIconButton
                  userId={user?.userId ? parseInt(user.userId, 10) : undefined}
                />
                <ProfileWindow />
              </>
            ) : (
              <SignupSignin />
            )}
          </nav>
        </div>

        <NavigationMenu links={links} />
      </header>
    );
  } catch (error) {
    console.error("Auth context error:", error);
    return null; // または適切なフォールバックUI
  }
};
