"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./SorterFilter.module.css";
import TagSelector from "./TagSelector";
import { useAuth } from "@/contexts/AuthContext";

export default function SorterFilter() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const searchParams = useSearchParams();
  const [sort, setSort] = useState(searchParams.get("sort") || "newer");
  const [filter, setFilter] = useState(searchParams.get("filter") || "");

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSort = e.target.value;
    setSort(newSort);
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", newSort);
    params.set("page", "1"); // ページもリセット
    router.push(`?${params.toString()}`);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newFilter = e.target.value;
    setFilter(newFilter);
    const params = new URLSearchParams(searchParams.toString());
    params.set("filter", newFilter);
    params.set("page", "1"); // ページもリセット
    router.push(`?${params.toString()}`);
  };

  const handleTagChange = (indexes: number[]) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tags", indexes.join(","));
    params.set("page", "1");
    router.push(`?${params.toString()}`);
  };

  return (
    <div className={styles.sorterFilter}>
      <h3>ソート</h3>
      <select
        className={styles.selectSorter}
        onChange={handleSortChange}
        value={sort}
      >
        <option value="">-- 選択してください --</option>
        <option value="newer">新着順</option>
        <option value="older">古い順</option>
        <option value="score">人気スコア順</option>
        <option value="upvote">いいね数順</option>
        <option value="answerCount">回答数順</option>
      </select>
      <h3>フィルター</h3>
      <p>ステータス</p>
      <select className={styles.selectFilter}
        onChange={handleFilterChange}
        value={filter}
      >
        <option value="">-- 選択してください --</option>
        <option value="oneWeek">１週間以内の質問</option>
        <option value="havingAnswer">回答ありの質問</option>
        {isAuthenticated && <option value="notHavingAnswer">回答無しの質問</option>}
      </select>
      <p>タグ</p>
      <TagSelector onChange={handleTagChange} />
    </div>
  );
}
