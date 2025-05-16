"use client";
import React, { useState, useCallback, useRef } from "react";
import styles from "./Header.module.css";
import Link from "next/link";
import NavigationMenu from "./NavigationMenu";

import { UserIconButton } from "../UserIconButton/UserIconButton";
import { SignupSignin } from "./SignupSignin";

import { useAuth } from "@/contexts/AuthContext";
import { ProfileWindow } from "./ProfileWindow";
import { NavLinks } from "@/types";

import { useRouter, useSearchParams } from "next/navigation";
import { usePathname } from "next/navigation";
import LoadingModal from "../LoadingModal/LoadingModal";

export const Header = ({ links }: { links: NavLinks[] }) => {
  const { isAuthenticated, user: authUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {

    e.preventDefault();
    setIsLoading(true);
    const keyword = inputRef.current?.value || "";
    const params = new URLSearchParams(searchParams.toString());
    params.set("keyword", keyword);
    params.set("page", "1");
    router.push(`?${params.toString()}`);
    setIsLoading(false);
  };

  try {
    return (
      <>
        {isLoading && <LoadingModal />}
        <header className={styles.header}>
          <div className={styles.mobileInner}>
            <div className={styles.inner}>
              <Link href="/">
                <img src="/favicon.ico" alt="Blog Logo" className={styles.logo} />
              </Link>

              {pathname === "/home" && (
                <form className={styles.searchForm1} onSubmit={handleSearch}>
                  <button type="submit" className={styles.searchIconButton1}>
                    🔍
                  </button>
                  <input
                    className={styles.searchWrapper1}
                    type="text"
                    placeholder="検索"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    ref={inputRef}
                  />
                </form>
              )}

              <nav className={styles.nav}>
                {isAuthenticated ? (
                  <>
                    <UserIconButton
                      userId={
                        authUser?.userId
                          ? parseInt(authUser.userId, 10)
                          : undefined
                      }
                      imagePath={authUser?.imagePath || null}
                    />
                    <ProfileWindow />
                  </>
                ) : (
                  <SignupSignin />
                )}
              </nav>
            </div>

            {/* モバイル用の検索フォーム 配置を変えるためのもの*/}
            {pathname === "/home" && (
              <form className={styles.searchForm2} onSubmit={handleSearch}>
                <button type="submit" className={styles.searchIconButton2}>
                  ボタン
                </button>
                <input
                  className={styles.searchWrapper2}
                  type="text"
                  placeholder="検索"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </form>
            )}
          </div>

          <NavigationMenu links={links} />
        </header>
      </>
    );
  } catch (error) {
    console.error("Auth context error:", error);
    return null; // または適切なフォールバックUI
  }
};
