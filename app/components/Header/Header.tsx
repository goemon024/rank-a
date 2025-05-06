"use client";
import React, { useState } from "react";
import styles from "./Header.module.css";
import Link from "next/link";
import NavigationMenu from "./NavigationMenu";

import { UserIconButton } from "../UserIconButton/UserIconButton";
import { SignupSignin } from "./SignupSignin";

import { useAuth } from "@/contexts/AuthContext";
import { ProfileWindow } from "./ProfileWindow";
import { NavLinks } from "@/types";

import { useRouter, useSearchParams } from "next/navigation";

export const Header = ({ links }: { links: NavLinks[] }) => {
  const { user, isAuthenticated } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const params = new URLSearchParams(searchParams.toString());
    params.set("keyword", searchTerm);
    params.set("page", "1"); // 検索時にページをリセット

    router.push(`?${params.toString()}`);
  };

  try {
    return (
      <header className={styles.header}>
        <div className={styles.inner}>
          <Link href="/">
            <img src="/favicon.ico" alt="Blog Logo" className={styles.logo} />
          </Link>

          <form className={styles.searchForm} onSubmit={handleSearch}>
            <button type="submit" className={styles.searchIconButton}>
              🔍
            </button>
            <input
              className={styles.searchWrapper}
              type="text"
              placeholder="検索"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </form>

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
