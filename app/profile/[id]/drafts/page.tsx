"use client";

import React, { useEffect, useState } from "react";

import { QuestionWithUserAndTags } from "@/types";
import { parseJwt } from "@/lib/parseJwt";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { Header } from "@/app/components/Header/Header";
import { getLinksProfile } from "@/constants/index";
import styles from "./drafts.module.css";
import Link from "next/link";
import dayjs from "dayjs";
import LoadingModal from "@/app/components/LoadingModal/LoadingModal";
import { useAuth } from "@/contexts/AuthContext";
import Breadcrumbs from "@/app/components/BreadCrumb/BreadCrumbs";
import { BreadProfilepage } from "@/constants/index";

export default function DraftPage() {
  const params = useParams();
  const userId = parseInt(params.id as string);
  const [questions, setQuestions] = useState<QuestionWithUserAndTags[]>([]);
  const router = useRouter();
  const [username, setUsername] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const { user: authUser } = useAuth();

  const links = getLinksProfile(
    String(userId),
    String(authUser?.userId) === String(userId),
  );

  useEffect(() => {
    const token = localStorage.getItem("token");
    const payload = token ? parseJwt(token) : null;
    const userIdFromToken = payload?.userId;
    // const username = payload?.username;
    setUsername(payload?.username);

    console.log("userIdFromToken", userIdFromToken);
    console.log(userIdFromToken, userId);

    const fetchQuestions = async () => {
      const res = await fetch(
        `/api/questions?isDraft=true&userId=${userId}&limit=100`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );
      const data = await res.json();
      setQuestions(data.questions);
      setIsLoading(false);
    };

    if (userIdFromToken !== userId) {
      router.push("/");
      return;
    } else {
      fetchQuestions();
    }
  }, []);

  return isLoading ? (
    <LoadingModal />
  ) : (
    <div>
      <div>
        <Header links={links} />
        <Breadcrumbs
          hierarchy={BreadProfilepage("下書き一覧", String(userId))}
          pageCategory="overview"
        />
      </div>
      <div className={styles.questionArea}>
        <h2>{username} さんの下書き一覧</h2>
        {isLoading ? (
          <p>読み込み中...</p>
        ) : questions.length === 0 ? (
          <p>下書きはありません。</p>
        ) : (
          questions.map((q: QuestionWithUserAndTags) => (
            <Link key={q.id} href={`/question-post/${q.id}`}>
              <div key={q.id} className={styles.questionCard}>
                <p className={styles.questionTitle}>{q.title}</p>
                <p className={styles.questionDescription}>{q.description}</p>
                <p className={styles.questionCreatedAt}>
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
