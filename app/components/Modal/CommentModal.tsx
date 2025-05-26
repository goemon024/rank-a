"use client";

import React, { useState, useRef } from "react";
import styles from "./modal.module.css";
import { commentSchema } from "@/schemas/commentSchema";
import { MarkdownToolbar } from "../Button/MarkdownToolbar";
import LoadingModal from "../LoadingModal/LoadingModal";

const CommentModal = ({
  setOpen,
  questionId,
  answerId,
  onSuccess,
}: {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  questionId: string;
  answerId?: string | null;
  onSuccess?: () => void;
}) => {
  const [content, setContent] = useState("");
  const token = localStorage.getItem("token");
  const [errorComment, setErrorComment] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = async () => {
    const result = commentSchema.safeParse({
      content,
    });

    if (!result.success) {
      setErrorComment(result.error.errors[0].message);
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          questionId: parseInt(questionId, 10),
          answerId: answerId ? parseInt(answerId, 10) : null,
          content: content,
        }),
      });
      if (!res.ok) {
        throw new Error("投稿に失敗しました");
      }

      if (onSuccess) onSuccess();
      setOpen(false);

    } catch (error) {
      setIsLoading(false);
      setErrorComment("投稿エラー：もう一度お試しください");
      console.error(error);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      {isLoading && <LoadingModal />}
      <div className={styles.commentModal} onClick={(e) => e.stopPropagation()}>
        <div>
          <h2>コメントを投稿</h2>
          {errorComment ? (
            <p className={styles.alert}>{errorComment}</p>
          ) : (
            <p></p>
          )}
        </div>
        <div>
          <MarkdownToolbar
            content={content}
            setContent={setContent}
            textareaRef={textareaRef}
          />
          <textarea
            className={styles.textarea}
            placeholder="ここにコメントを入力..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            ref={textareaRef}
          />
        </div>
        <div className={styles.buttonArea}>
          <button onClick={handleSubmit} className={styles.button}>
            投稿
          </button>
          <button onClick={() => setOpen(false)} className={styles.button}>
            戻る
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommentModal;
