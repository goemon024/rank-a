"use client";

import React from "react";
import styles from "./QuestionArea.module.css";
import { QuestionCard } from "@/app/components/QuestionCard/QuestionCard";
import { QuestionWithUserAndTags } from "@/types";
import { useSearchParams } from "next/navigation";

export const QuestionArea = ({
  questions,
}: {
  questions: QuestionWithUserAndTags[];
}) => {
  const searchParams = useSearchParams();

  return (
    <div className={styles.questionArea}>
      {questions.map((question) => (
        <QuestionCard
          key={question.id}
          question={question}
          linkDisabled={false}
          query={searchParams}
          bestAnswerId={question.bestAnswerId}
        />
      ))}
    </div>
  );
};
