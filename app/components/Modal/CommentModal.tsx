"use client";

import React, { useState } from "react";
import styles from "./modal.module.css";

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

  const token = localStorage.getItem("token");

  const handleSubmit = async () => {
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

      // 投稿成功したらモーダルを閉じる
      setOpen(false);
      // 必要ならページをリロードしたり、回答リストを更新したりもできる
      // location.reload()
    } catch (error) {
      console.error(error);
      alert("投稿エラー：もう一度お試しください");
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={() => setOpen(false)}>
      <div className={styles.commentModal} onClick={(e) => e.stopPropagation()}>
        <div>
          <h2>コメントを投稿</h2>
          <p>{answerId}</p>
          <p>{questionId}</p>
        </div>
        <div>
          <textarea
            className={styles.textarea}
            placeholder="ここにMarkdownでコメントを入力..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
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
