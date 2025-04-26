"use client";
import React, { useEffect, useRef, useState } from "react";
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


interface NavItem {
  label: string
  href: string
}

interface NavigationMenuProps {
  items: NavItem[]
}


export const Header = ({ items }: NavigationMenuProps) => {
  try {
    const { user, isAuthenticated } = useAuth()

    return (
      <header className={styles.header}>
        <div className={styles.inner}>
          <Link href="/">
            <img src="/favicon.ico" alt="Blog Logo" className={styles.logo} />
          </Link>
          <nav className={styles.nav}>

            {isAuthenticated ? (
              <>
                <UserIconButton userId={user?.userId} />
                <ProfileWindow />
              </>
            ) : (
              <SignupSignin />
            )}

          </nav>
        </div>

        <NavigationMenu items={items} />

      </header>
    );
  } catch (error) {
    console.error('Auth context error:', error);
    return null; // または適切なフォールバックUI
  }
};
