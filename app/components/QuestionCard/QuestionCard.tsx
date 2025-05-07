"use client";

import React from "react";
import styles from "./QuestionCard.module.css";
import { UserIconButton } from "../UserIconButton/UserIconButton";
import { Stack, Chip } from "@mui/material";
import Link from "next/link";
import { QuestionWithUserAndTags } from "@/types";
import dayjs from "dayjs";

// APIを介さずにタグ表示。
import { TAGS } from "@/constants";

export const QuestionCard = ({
  question,
}: {
  question: QuestionWithUserAndTags;
}) => {
  return (
    <div className={styles.questionCard}>
      <Link href={`/question-detail/${question.id}`}>
        <h2>{question.title}</h2>

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
      </Link>
      <div className={styles.autherInfo}>
        <UserIconButton
          userId={question.userId}
          imagePath={question.user.imagePath}
        />
        <div className={styles.autherInfoText}>
          <p>{question.user.username}</p>
          <p>{dayjs(question.createdAt).format("YYYY年MM月DD日 HH時mm分")}</p>
        </div>
      </div>
    </div>
  );
};
