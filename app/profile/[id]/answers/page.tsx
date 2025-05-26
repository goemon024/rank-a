"use client";

import React, { useEffect, useState } from "react";

import { useParams } from "next/navigation";
import { Header } from "@/app/components/Header/Header";
import { getLinksProfile } from "@/constants/index";
import styles from "./UserAnswers.module.css";
import Link from "next/link";
import { AnswerWithUserAndQuestion } from "@/types";
import dayjs from "dayjs";
import LoadingModal from "@/app/components/LoadingModal/LoadingModal";
import { useAuth } from "@/contexts/AuthContext";

import Breadcrumbs from "@/app/components/BreadCrumb/BreadCrumbs";
import { BreadProfilepage } from "@/constants/index";

export default function UserAnswersPage() {
  const params = useParams();
  const userId = parseInt(params.id as string);
  const [answers, setAnswers] = useState<AnswerWithUserAndQuestion[]>([]);
  const [username, setUsername] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const { user: authUser } = useAuth();
  const links = getLinksProfile(
    String(userId),
    String(authUser?.userId) === String(userId),
  );

  useEffect(() => {
    const fetchComments = async () => {
      const res = await fetch(`/api/answers?userId=${userId}`, {
        headers: {
          // Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      setAnswers(data.answer);
      setUsername(data.answer[0]?.user?.username || authUser?.username);
      setIsLoading(false);
    };
    fetchComments();
  }, []);

  return isLoading ? (
    <LoadingModal />
  ) : (
    <div>
      <div>
        <Header links={links} />
        <Breadcrumbs
          hierarchy={BreadProfilepage("回答履歴", String(userId))}
          pageCategory="overview"
        />
      </div>
      <div className={styles.questionArea}>
        <h2>{username} さんの回答履歴</h2>
        {isLoading ? (
          <p>読み込み中...</p>
        ) : answers.length === 0 ? (
          <p>回答の投稿はありません。</p>
        ) : (
          answers.map((a: AnswerWithUserAndQuestion) => (
            <Link key={a.id} href={`/question-detail/${a.questionId}`}>
              <div key={a.id} className={styles.answerCard}>
                <p className={styles.answerQuestionTitle}>
                  （{a.question.title}）
                </p>
                <p className={styles.answerContent}>{a.content}</p>
                <p className={styles.answerTime}>
                  {dayjs(a.createdAt).format("YYYY/MM/DD HH:mm")}
                </p>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
