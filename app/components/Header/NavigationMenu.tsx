"use client";

import Link from "next/link";
import styles from "./Header.module.css";
import { NavLinks } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { usePathname } from "next/navigation";
import { parse } from "url";

export default function NavigationMenu({ links }: { links: NavLinks[] }) {
  const { isAuthenticated, user: authUser } = useAuth();
  const pathname = usePathname();

  return (
    <nav className={styles.NavigationMenu}>
      {links.map(({ label, href, query }) => {
        const queryObj = query
          ? Object.fromEntries(query.entries())
          : undefined;
        return (
          <Link
            key={href}
            href={queryObj ? { pathname: href, query: queryObj } : href}
          >
            {label}
          </Link>
        );
      })}
      {isAuthenticated &&
        (pathname === "/home" || pathname.startsWith("/question-detail")) && (
          <Link
            href={`/profile/${authUser?.userId}`}
            className={styles.profileLink}
          >
            プロフィール
          </Link>
        )}
    </nav>
  );
}
