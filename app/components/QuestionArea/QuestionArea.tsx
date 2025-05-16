"use client";

import React, { useEffect, useState } from "react";
import styles from "./QuestionArea.module.css";
import { QuestionCard } from "@/app/components/QuestionCard/QuestionCard";
import { QuestionWithUserAndTags } from "@/types";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { UserBookmarks } from "@/types";

export const QuestionArea = ({
  questions,
}: {
  questions: QuestionWithUserAndTags[];
}) => {
  const searchParams = useSearchParams();
  const { user: authUser } = useAuth();
  const [userBookmarks, setUserBookmarks] = useState<UserBookmarks[]>([]);

  useEffect(() => {
    if (!authUser?.userId) return;

    const questionIds = questions.map((question) => question.id);
    const questionIdsString = questionIds.join(",");
    const params = new URLSearchParams({
      questionIds: questionIdsString,
      userId: authUser?.userId || "",
    });
    const url = `/api/bookmarks?${params.toString()}`;

    const fetchUserBookmarks = async () => {
      try {
        const res = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          },
        });

        if (!res.ok) {
          throw new Error("ブックマークデータの取得に失敗しました");
        }
        const data = await res.json();
        setUserBookmarks(data);
      } catch (error) {
        console.error("Error fetching cookies:", error);
      }
    };
    fetchUserBookmarks();
  }, [questions]);

  return (
    <div className={styles.questionArea}>
      {questions.length === 0 ? (
        <div>検索された質問がありません</div>
      ) : (
        questions.map((question) => (
          <QuestionCard
            key={question.id}
            question={question}
            linkDisabled={false}
            query={searchParams}
            bestAnswerId={question.bestAnswerId}
            answerCountDisplay={true}
            bookmark={userBookmarks.find(
              (bookmark) => bookmark.questionId === question.id,
            )}
            // 一致するものがあれば{qeusionId,bookmarkId}を返す。なければundefiendかnullが返る。
          />
        ))
      )}
    </div>
  );
};
