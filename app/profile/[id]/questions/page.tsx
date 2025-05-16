"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Header } from "@/app/components/Header/Header";
import { getLinksProfile } from "@/constants/index";
import styles from "./UserQuestions.module.css";

import { QuestionWithUserAndTags, Notification } from "@/types";
import dayjs from "dayjs";
import { UserIconButton } from "@/app/components/UserIconButton/UserIconButton";
import LoadingModal from "@/app/components/LoadingModal/LoadingModal";
import { useAuth } from "@/contexts/AuthContext";

export default function UserQuestionsPage() {
  const params = useParams();
  const userId = parseInt(params.id as string);
  const [questions, setQuestions] = useState<QuestionWithUserAndTags[]>([]);
  const [username, setUsername] = useState<string | null>(null);
  const [userImagePath, setUserImagePath] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { user: authUser } = useAuth();
  const router = useRouter();

  const links = getLinksProfile(
    String(userId),
    String(authUser?.userId) === String(userId),
  );

  useEffect(() => {
    const fetchQuestions = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/questions?userId=${userId}&limit=100`, {
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await res.json();
        setQuestions(data.questions);
        const questionIds = data.questions.map((question: QuestionWithUserAndTags) => question.id);

        if (questionIds.length > 0) {
          const params = new URLSearchParams({
            questionIds: questionIds.join(","),
          });
          const res = await fetch(`/api/notifications?${params.toString()}`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`, // 認証が必要なら追加
            },
          });

          const notifications = await res.json();
          setNotifications(notifications);

          console.log("#########");
          console.log(notifications);
          console.log("#########");

          setUserImagePath(
            data.questions[0]?.user?.imagePath || authUser?.imagePath,
          );
          setUsername(data.questions[0]?.user?.username || authUser?.username);
          setIsLoading(false);
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchQuestions();
  }, []);

  const handleCardClick = async (question: QuestionWithUserAndTags) => {
    try {
      await fetch(`/api/notifications/${question.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`, // 認証が必要なら追加
        },
      });
    } catch (err) {
      console.log(err);
    } finally {
      router.push(`/question-detail/${question.id}`);
    }
  };

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
          questions.map((q: QuestionWithUserAndTags) => {

            const isUnread = notifications.some(
              (n) => String(q.id) === String(n.questionId) && !n.isRead
            );

            return (
              <div
                key={q.id}
                className={isUnread ? styles.unreadQuestionCard : styles.questionCard}
                onClick={() => handleCardClick(q)}
                style={{ cursor: "pointer" }}
              >
                <div className={styles.questionHeader}>
                  {isUnread && (
                    <span className={styles.unreadBadge}>
                      --新規回答・コメントあり--
                    </span>
                  )}
                  <p className={styles.questionTitle}>
                    {q.title}
                  </p>
                </div>
                <p className={styles.questionTime}>
                  {dayjs(q.createdAt).format("YYYY/MM/DD")}
                </p>
                <p className={styles.questionDescription}>{q.description}</p>
              </div>
            );
          })
        )}



        {/* <div
            key={q.id}
            className={styles.questionCard}
            onClick={() => handleCardClick(q)}
            style={{ cursor: "pointer" }}
          >
            <p className={styles.questionTitle}>{q.title}</p>
            <p className={styles.questionDescription}>{q.description}</p>
            <p className={styles.questionTime}>
              {dayjs(q.createdAt).format("YYYY/MM/DD HH:mm")}
            </p>
          </div>

            // <Link key={q.id} href={`/question-detail/${q.id}`}>
            //   <div key={q.id} className={styles.questionCard}>
            //     <p className={styles.questionTitle}>{q.title}</p>
            //     <p className={styles.questionDescription}>{q.description}</p>
            //     <p className={styles.questionTime}>
            //       {dayjs(q.createdAt).format("YYYY/MM/DD HH:mm")}
            //     </p>
            //   </div>
            // </Link>
          ))
        )} */}
      </div>
    </div>
  );
}
