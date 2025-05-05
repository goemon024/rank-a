"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./SorterFilter.module.css";
import TagSelector from "./TagSelector";

export default function SorterFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [sort, setSort] = useState(searchParams.get("sort") || "newest");

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSort = e.target.value;
    setSort(newSort);

    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", newSort);
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
      <select className={styles.selectSorter} onChange={handleChange} value={sort}>
        <option value="">-- 選択してください --</option>
        <option value="newest">新着順</option>
        <option value="oldest">古い順</option>
      </select>
      <h3>フィルター</h3>
      <p>ステータス</p>
      <select className={styles.selectFilter}>
        <option value="">-- 選択してください --</option>
        <option value="newest">新着順</option>
        <option value="popular">人気順</option>
      </select>
      <p>タグ</p>
      <TagSelector onChange={handleTagChange} />


    </div>



  );
}
