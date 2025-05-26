"use client";

import React, { useState } from "react";
import styles from "./modal.module.css";

import {
  AnswerWithUser,
  QuestionWithUserAndTags,
  CommentWithUser,
} from "@/types";
import LoadingModal from "../LoadingModal/LoadingModal";

type DeleteModalProps = {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  question?: QuestionWithUserAndTags;
  answer?: AnswerWithUser;
  comment?: CommentWithUser;
  onSuccess?: () => void;
};

const DeleteModal = ({
  setOpen,
  question,
  answer,
  comment,
  onSuccess,
}: DeleteModalProps) => {
  if (!question && !answer && !comment) {
    throw new Error("question または answer または comment が必要です");
  }

  const [errorDelete, setErrorDelete] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const token = localStorage.getItem("token");

  const handleSubmit = async () => {
    setErrorDelete(null);
    setIsLoading(true);
    try {
      let res;
      if (answer?.id) {
        res = await fetch(`/api/answers/${answer?.id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
      } else if (comment?.id) {
        res = await fetch(`/api/comments/${comment?.id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
      } else if (question?.id) {
        res = await fetch(`/api/questions/${question?.id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
      }

      if (!res?.ok) {
        throw new Error("削除に失敗しました");
      }

      if (onSuccess) onSuccess();
      setOpen(false);
    } catch (error) {
      setIsLoading(false);
      console.error(error);
      setErrorDelete("削除に失敗しました");
    }
  };
  return (
    <div className={styles.modalOverlay} onClick={() => setOpen(false)}>
      {isLoading && <LoadingModal />}
      <div className={styles.answerModal} onClick={(e) => e.stopPropagation()}>
        <div>
          <h3>本当に削除しますか？</h3>
          {errorDelete ? (
            <p className={styles.alert}>{errorDelete}</p>
          ) : (
            <p></p>
          )}
        </div>
        <div className={styles.buttonArea}>
          <button onClick={handleSubmit} className={styles.button}>
            削除
          </button>
          <button onClick={() => setOpen(false)} className={styles.button}>
            戻る
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
