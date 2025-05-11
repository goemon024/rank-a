"use client";

import React from "react";
import styles from "./AnswerCard.module.css";
import { UserIconButton } from "../UserIconButton/UserIconButton";
import { BestAnswerButton } from "../Button/BestAnswerButton";
// import { Answer } from '@/prisma/client'
import { AnswerWithUser } from "@/types";
import CommentButton from "../Button/CommentButton";
import Vote from "../Vote/Vote";
import EditDeleteButton from "./EditDeleteButton";

import dayjs from "dayjs";
import { VoteSummary } from "@/types";

import { marked } from "marked";
import DOMPurify from "dompurify";

export const AnswerCard = ({
  answer,
  votes,
  commentCount,
  bestInfo,
  isBest,
  setCommentButtonClick,
  onBest,
}: {
  answer: AnswerWithUser;
  votes: VoteSummary;
  commentCount: number;
  bestInfo: {
    questionUserId: number;
    bestAnswerId: number;
  };
  isBest: boolean;
  setCommentButtonClick: () => void;
  onBest: (answerId: number | null) => void;
}) => {
  return (
    <div className={styles.answerCard}>

      <div className={styles.autherInfo}>
        <div className={styles.autherInfoContainer}>
          <UserIconButton
            userId={answer.userId}
            imagePath={answer.user.imagePath}
          />
          <div className={styles.autherInfoText}>
            <p>{answer.user.username}</p>
            <p>{dayjs(answer.createdAt).format("YYYY年MM月DD日 HH時mm分")}</p>
          </div>
        </div>
        <BestAnswerButton
          answerId={answer.id.toString()}
          questionId={answer.questionId.toString()}
          isBest={isBest}
          bestInfo={bestInfo}
          onBest={onBest}
        />

      </div>
      <div className={styles.answerContent}>
        <div
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(marked.parse(answer.content) as string),
          }}
        />
      </div>
      <div className={styles.infomationContainer}>
        <Vote
          answerId={answer.id}
          initialVote={votes.userVote}
          initialUpvotes={votes.upvotes}
          initialDownvotes={votes.downvotes}
          voteId={votes.voteId}
        />
        <div className={styles.buttonContainer}>
          <CommentButton setCommentButtonClick={setCommentButtonClick} />
          <EditDeleteButton
            answer={answer}
            votes={votes}
            commentCount={commentCount}
          />
        </div>
      </div>
    </div>
  );
};
