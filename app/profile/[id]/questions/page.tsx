"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Header } from "@/app/components/Header/Header";
import { getLinksProfile } from "@/constants/index";
import styles from "./UserQuestions.module.css";
import Link from "next/link";
import { QuestionWithUserAndTags } from "@/types";
import dayjs from "dayjs";
import { UserIconButton } from "@/app/components/UserIconButton/UserIconButton";
import LoadingModal from "@/app/components/LoadingModal/LoadingModal";
import { useAuth } from "@/contexts/AuthContext";

export default function UserCommentsPage() {
  const params = useParams();
  const userId = parseInt(params.id as string);
  const [questions, setQuestions] = useState<QuestionWithUserAndTags[]>([]);
  const [username, setUsername] = useState<string | null>(null);
  const [userImagePath, setUserImagePath] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user: authUser } = useAuth();
  const links = getLinksProfile(
    String(userId),
    String(authUser?.userId) === String(userId),
  );

  useEffect(() => {
    const fetchQuestions = async () => {
      setIsLoading(true);
      const res = await fetch(`/api/questions?userId=${userId}&limit=50`, {
        headers: {
          // Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      setQuestions(data.questions);
      setUserImagePath(data.questions[0].user.imagePath);
      setUsername(data.questions[0].user.username);
      setIsLoading(false);
    };
    fetchQuestions();
  }, []);

  return isLoading ? (
    <LoadingModal />
  ) : (
    <div>
      <div>
        <Header links={links} />
      </div>
      <div className={styles.questionArea}>
        <div className={styles.userIconButtonContainer}>
          <UserIconButton userId={userId} imagePath={userImagePath} />
          <h3>{username} さんの質問履歴（直近100件までの表示）</h3>
        </div>
        {questions.length === 0 ? (
          <p>質問の投稿はありません。</p>
        ) : (
          questions.map((q: QuestionWithUserAndTags) => (
            <Link key={q.id} href={`/question-detail/${q.id}`}>
              <div key={q.id} className={styles.questionCard}>
                <p className={styles.questionTitle}>{q.title}</p>
                <p className={styles.questionDescription}>{q.description}</p>
                <p className={styles.questionTime}>
                  {dayjs(q.createdAt).format("YYYY/MM/DD HH:mm")}
                </p>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
