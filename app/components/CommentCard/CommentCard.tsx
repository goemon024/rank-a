"use client";

import React from "react";
import styles from "./CommentCard.module.css";
import { UserIconButton } from "../UserIconButton/UserIconButton";
import CommentDeleteButton from "./CommentDeleteButton";
// import { Answer } from '@/prisma/client'
import { CommentWithUser } from "@/types";
import dayjs from "dayjs";

export const CommentCard = ({ comment }: { comment: CommentWithUser }) => {
  return (
    <div className={styles.commentCard}>
      <div className={styles.artherSection}>
        <div className={styles.autherInfo}>
          <UserIconButton
            userId={comment.userId}
            imagePath={comment.user.imagePath}
          />
          <div className={styles.autherInfoText}>
            <p>{comment.user.username}</p>
            <p>{dayjs(comment.createdAt).format("YYYY年MM月DD日 HH時mm分")}</p>
          </div>
          <CommentDeleteButton comment={comment} />
        </div>
      </div>
      <div className={styles.commentContent}>
        <p>{comment.content}</p>
      </div>
    </div>
  );
};
