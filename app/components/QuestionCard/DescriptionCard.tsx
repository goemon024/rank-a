"use client";

import React, { useState, useEffect } from "react";
import styles from "./QuestionCard.module.css";
import { QuestionWithUserAndTags } from "@/types";
import { marked } from "marked";
import DOMPurify from "dompurify";

export const DescriptionCard = ({
  question,
}: {
  question: QuestionWithUserAndTags;
}) => {
  const [rawHtml, setRawHtml] = useState("");

  useEffect(() => {
    const parseMarkdown = async () => {
      const html = await marked.parse(question.description);
      setRawHtml(DOMPurify.sanitize(html));
    };
    parseMarkdown();
  }, [question.description]);

  return (
    <div className={styles.descriptionCard}>
      <div dangerouslySetInnerHTML={{ __html: rawHtml }} />
    </div>
  );
};
