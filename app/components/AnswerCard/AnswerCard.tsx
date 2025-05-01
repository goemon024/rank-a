"use client";

import React from "react";
import styles from "./AnswerCard.module.css";
import { UserIconButton } from "../UserIconButton/UserIconButton";
// import { Answer } from '@/prisma/client'
import { AnswerWithUser } from "@/types";
import CommentButton from "../Button/CommentButton";

import dayjs from "dayjs";

export const AnswerCard = ({
  answer,
  setCommentButtonClick,
}: {
  answer: AnswerWithUser;
  setCommentButtonClick: () => void;
}) => {
  return (
    <div className={styles.answerCard}>
      <div className={styles.autherInfo}>
        <UserIconButton userId={answer.userId} />
        <div className={styles.autherInfoText}>
          <p>{answer.user.username}</p>
          <p>{dayjs(answer.createdAt).format("YYYY年MM月DD日 HH時mm分")}</p>
        </div>
      </div>
      <div className={styles.answerContent}>
        <p>{answer.content}</p>
      </div>
      <div>
        <CommentButton setCommentButtonClick={setCommentButtonClick} />
      </div>
    </div>
  );
};
