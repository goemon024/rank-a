"use client";

import styles from "./QuestionCard.module.css";
import { QuestionWithUserAndTags } from "@/types";
import { marked } from "marked";
import DOMPurify from "dompurify";

export const DescriptionCard = ({
  question,
}: {
  question: QuestionWithUserAndTags;
}) => {

  return (
    <div className={styles.descriptionCard}>
      <div
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(
            marked.parse(question.description) as string,
          ),
        }}
      />
    </div>
  );
};
