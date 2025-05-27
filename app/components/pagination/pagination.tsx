// components/Pagination.tsx
"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./pagination.module.css";
import { AiOutlineArrowRight, AiOutlineArrowLeft } from "react-icons/ai";
import LoadingModal from "@/app/components/LoadingModal/LoadingModal";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  keyword?: string;
}

export const Pagination = ({
  currentPage,
  totalPages,
  keyword = "",
}: PaginationProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);

  const goToPage = (page: number) => {
    setIsLoading(true);
    setTimeout(async () => {
      try {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", page.toString());
        if (keyword) params.set("keyword", keyword);
        await router.push(`/home?${params.toString()}`);
      } catch (error) {
        console.error("ページ遷移に失敗しました:", error);
      } finally {
        setIsLoading(false);
      }
    }, 30);
  };

  if (totalPages <= 1) return null;

  return (
    <>
      {isLoading && <LoadingModal />}

      <div className={styles.pagination}>
        <button
          className={
            currentPage === 1
              ? styles.disabledPreviousButton
              : styles.previousButton
          }
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <AiOutlineArrowLeft className={styles.arrowIcon} />
          <span className={styles.spanStyle}></span>
          Previous Page
        </button>

        <div className={styles.buttonsContainer}>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              className={
                page === currentPage ? styles.currentButton : styles.pagiButton
              }
              onClick={() => goToPage(page)}
              style={{ fontWeight: page === currentPage ? "bold" : "normal" }}
            >
              {page}
            </button>
          ))}
        </div>

        <button
          className={
            currentPage === totalPages
              ? styles.disabledNextButton
              : styles.nextButton
          }
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          // style={{ background: "inherit" }}
        >
          Next Page
          <span className={styles.spanStyle}></span>
          <AiOutlineArrowRight className={styles.arrowIcon} />
        </button>
      </div>
    </>
  );
};
