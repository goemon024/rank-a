"use client";

import React from "react";
import styles from "./QuestionCard.module.css";
import { UserIconButton } from "../UserIconButton/UserIconButton";
import { Stack, Chip } from "@mui/material";
import Link from "next/link";
import { QuestionWithUserAndTags } from "@/types";
import Vote from "../Vote/Vote";

import dayjs from "dayjs";
import { VoteMap } from "@/types";

import DOMPurify from "isomorphic-dompurify";
import { marked } from "marked";
import { TAGS } from "@/constants";

export const QuestionCard = ({
  question,
  linkDisabled = false,
  query,
  bestAnswerId,
  answerCountDisplay = false,
  questionVoteDisplay = false,
  votes,
  setVotes,
}: {
  question: QuestionWithUserAndTags;
  linkDisabled?: boolean;
  query?: URLSearchParams;
  bestAnswerId?: number | null;
  answerCountDisplay?: boolean;
  questionVoteDisplay?: boolean;
  votes?: VoteMap;
  setVotes?: (votes: VoteMap) => void;
}) => {

  const queryParams = query ? Object.fromEntries(query.entries()) : {};

  const QuestionCardContent = ({ question, linkDisabled, }:
    { question: QuestionWithUserAndTags; linkDisabled: boolean; }) => {
    return (
      <div
        className={[
          linkDisabled ? styles.LinkDisabledQuestionCard : styles.questionCard,
          bestAnswerId ? styles.bestAnswer : ""
        ].filter(Boolean).join(" ")}
      >
        {question.isDraft && (
          <div className={styles.draftBadge}>
            <h2>- DRAFT -</h2>
          </div>
        )}

        {bestAnswerId && (
          <div className={styles.solvedBadge}>
            <h4>-- 解決済み --</h4>
          </div>
        )}

        <h2
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(
              marked.parseInline(question.title) as string,
            ),
          }}
        />

        <Stack direction="row" spacing={1} flexWrap="wrap" marginBottom={1}>
          {question.questionTags.map((qt) => (
            <Chip
              key={qt.tagId}
              label={TAGS[qt.tagId]}
              size="small"
              sx={{
                fontSize: "0.8rem",
                padding: "2px 4px",
                bgcolor: "primary.main",
                color: "white",
              }}
            />
          ))}
        </Stack>

        <div className={styles.autherInfo}>
          <UserIconButton
            userId={question.userId}
            imagePath={question.user.imagePath}
          />
          <div className={styles.autherInfoText}>
            <p>{question.user.username}</p>
            <p>{dayjs(question.createdAt).format("YYYY年MM月DD日 HH時mm分")}</p>
          </div>
          {answerCountDisplay && (
            <div className={styles.answerCount}>
              <p>回答数：{question.answerCountDirect}件</p>
            </div>
          )}
          {questionVoteDisplay && (
            <div className={styles.voteContainer}>
              <Vote
                targetId={question.id}
                targetUserId={question.userId}
                votes={votes}
                setVotes={setVotes}
                isQuestion={true}
              />
            </div>
          )}

        </div>
      </div>
    );
  };

  return linkDisabled ? (
    <QuestionCardContent question={question} linkDisabled={true} />
  ) : (
    <Link
      href={{
        pathname: `/question-detail/${question.id}`,
        query: queryParams,
      }}
    >
      <QuestionCardContent question={question} linkDisabled={false} />
    </Link>
  );
};
