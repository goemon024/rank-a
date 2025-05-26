"use client";

import React, { useEffect, useState } from "react";

import { useParams } from "next/navigation";
import { Header } from "@/app/components/Header/Header";
import { getLinksProfile } from "@/constants/index";
import styles from "./UserComments.module.css";
import Link from "next/link";
import { CommentWithUser } from "@/types";
import dayjs from "dayjs";
import { UserIconButton } from "@/app/components/UserIconButton/UserIconButton";
import LoadingModal from "@/app/components/LoadingModal/LoadingModal";
import { useAuth } from "@/contexts/AuthContext";
import Breadcrumbs from "@/app/components/BreadCrumb/BreadCrumbs";
import { BreadProfilepage } from "@/constants/index";

export default function UserCommentsPage() {
  const params = useParams();
  const userId = parseInt(params.id as string);
  const [comments, setComments] = useState<CommentWithUser[]>([]);
  const [username, setUsername] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userImagePath, setUserImagePath] = useState<string | null>(null);
  const { user: authUser } = useAuth();

  const links = getLinksProfile(
    String(userId),
    String(authUser?.userId) === String(userId),
  );

  useEffect(() => {
    const fetchComments = async () => {
      setIsLoading(true);
      const res = await fetch(`/api/comments?userId=${userId}`, {
        headers: {
          // Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      setComments(data.comment);
      setUsername(data.comment[0]?.user?.username || authUser?.username);
      setUserImagePath(data.comment[0]?.user?.imagePath || authUser?.imagePath);
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
          hierarchy={BreadProfilepage("コメント履歴", String(userId))}
          pageCategory="overview"
        />
      </div>
      <div className={styles.questionArea}>
        <div className={styles.userIconButtonContainer}>
          <UserIconButton userId={userId} imagePath={userImagePath} />
          <h2>{username} さんのコメント履歴</h2>
        </div>

        {comments.length === 0 ? (
          <p>コメントの投稿はありません。</p>
        ) : (
          comments.map((c: CommentWithUser) => (
            <Link key={c.id} href={`/question-detail/${c.questionId}`}>
              <div key={c.id} className={styles.commentCard}>
                <p className={styles.commentTime}>
                  {dayjs(c.createdAt).format("YYYY/MM/DD HH:mm")}
                </p>
                <p className={styles.commentContent}>{c.content}</p>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
