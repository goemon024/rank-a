"use client";

import React, { useState, useRef } from "react";
import styles from "./modal.module.css";
import { answerSchema } from "@/schemas/answerSchema";
import { AnswerWithUser } from "@/types";

import { MarkdownToolbar } from "../Button/MarkdownToolbar";
import LoadingModal from "../LoadingModal/LoadingModal";

// POSTとPUTに対応させている。
type AnswerModalProps = {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  questionId?: string;
  answer?: AnswerWithUser;
  onSuccess?: () => void;
};

const AnswerModal = ({
  setOpen,
  questionId,
  answer,
  onSuccess,
}: AnswerModalProps) => {
  if (!questionId && !answer) {
    throw new Error("questionId または answer が必要です");
  }

  const [content, setContent] = useState(answer?.content || "");
  const [errorAnswer, setErrorAnswer] = useState<string | null>(null);
  const token = localStorage.getItem("token");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    // Zodバリデーションを追加
    const result = answerSchema.safeParse({ content });
    if (!result.success) {
      setErrorAnswer(result.error.errors[0].message);
      return;
    }

    setErrorAnswer(null);
    setIsLoading(true);
    try {
      let res;
      if (questionId) {
        res = await fetch("/api/answers", {
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
      } else {
        res = await fetch(`/api/answers/${answer?.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            answerId: answer?.id,
            content: content,
            userId: answer?.userId,
          }),
        });
      }

      if (!res.ok) {
        throw new Error("投稿に失敗しました");
      }

      if (onSuccess) onSuccess();
      setOpen(false);

      // 必要ならページをリロードしたり、回答リストを更新したりもできる
      // location.reload()
    } catch (error) {
      console.error(error);
      setIsLoading(false);
      setErrorAnswer("投稿エラー：もう一度お試しください");
    }
  };

  return (
    <div className={styles.modalOverlay}>
      {isLoading && <LoadingModal />}
      <div className={styles.answerModal} onClick={(e) => e.stopPropagation()}>
        <div>
          <h3>回答を投稿</h3>
          {errorAnswer ? (
            <p className={styles.alert}>{errorAnswer}</p>
          ) : (
            <p>(2000文字以内 markdown形式)</p>
          )}
        </div>
        <div>
          <MarkdownToolbar
            content={content}
            setContent={setContent}
            textareaRef={textareaRef}
          />
        </div>
        <div>
          <textarea
            className={styles.textarea}
            placeholder="ここに回答を入力..."
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

export default AnswerModal;
