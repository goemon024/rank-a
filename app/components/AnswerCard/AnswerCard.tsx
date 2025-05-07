"use client";

import React from "react";
import styles from "./AnswerCard.module.css";
import { UserIconButton } from "../UserIconButton/UserIconButton";
// import { Answer } from '@/prisma/client'
import { AnswerWithUser } from "@/types";
import CommentButton from "../Button/CommentButton";
import Vote from "../Vote/Vote";

import dayjs from "dayjs";
import { VoteSummary } from "@/types";

export const AnswerCard = ({
  answer,
  votes,
  setCommentButtonClick,
}: {
  answer: AnswerWithUser;
  votes: VoteSummary;
  setCommentButtonClick: () => void;
}) => {
  return (
    <div className={styles.answerCard}>
      <div className={styles.autherInfo}>
        <UserIconButton
          userId={answer.userId}
          imagePath={answer.user.imagePath}
        />
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
      <div>
        <Vote
          answerId={answer.id}
          initialVote={votes.userVote}
          initialUpvotes={votes.upvotes}
          initialDownvotes={votes.downvotes}
          voteId={votes.voteId}
        />
      </div>
    </div>
  );
};
