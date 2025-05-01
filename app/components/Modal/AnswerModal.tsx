"use client";

import React, { useState } from "react";
import styles from "./modal.module.css";

const AnswerModal = ({
  setOpen,
  questionId,
}: {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  questionId: string;
}) => {
  const [content, setContent] = useState("");

  const token = localStorage.getItem("token");

  const handleSubmit = async () => {
    try {
      const res = await fetch("/api/answers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          questionId: questionId,
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
      <div className={styles.answerModal} onClick={(e) => e.stopPropagation()}>
        <div>
          <h2>回答を投稿</h2>
        </div>
        <div>
          <textarea
            className={styles.textarea}
            placeholder="ここにMarkdownで回答を入力..."
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

export default AnswerModal;
