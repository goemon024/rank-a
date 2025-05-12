"use client";

import React, { useState, useRef } from "react";
import styles from "./modal.module.css";
import { useRouter } from "next/navigation";
import { commentSchema } from "@/schemas/commentSchema";
import { MarkdownToolbar } from "../Button/MarkdownToolbar";

const CommentModal = ({
  setOpen,
  questionId,
  answerId,
}: {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  questionId: string;
  answerId?: string | null;
}) => {
  const [content, setContent] = useState("");
  const router = useRouter();
  const token = localStorage.getItem("token");
  const [errorComment, setErrorComment] = useState<string | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = async () => {
    try {
      const result = commentSchema.safeParse({
        content,
      });

      if (!result.success) {
        setErrorComment(result.error.errors[0].message);
        return;
      }

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

      router.push("/");
    } catch (error) {
      setErrorComment("投稿エラー：もう一度お試しください");
      console.error(error);
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={() => setOpen(false)}>
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
        <div>
          <button onClick={handleSubmit} className={styles.button}>
            投稿
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommentModal;
