import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import styles from "./Button.module.css";

interface BestAnswerButtonProps {
  answerId: string;
  bestInfo: {
    questionUserId: number;
    bestAnswerId: number | null;
  };
  questionId: string;
  isBest: boolean;
  onBest: (answerId: number | null) => void;
}

export const BestAnswerButton = ({
  answerId,
  bestInfo,
  questionId,
  isBest,
  onBest,
}: BestAnswerButtonProps) => {
  const { isAuthenticated, user: authUser } = useAuth();
  const token = localStorage.getItem("token");

  const handleBestAnswer = async () => {
    // optimistic UI
    if (!isBest) {
      onBest(parseInt(answerId));
    } else {
      onBest(null);
    }

    try {
      let response;
      if (isBest === false) {
        response = await fetch(
          `/api/questions/${String(questionId)}/best-answer`,
          {
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              bestAnswerId: answerId,
            }),
          },
        );
      } else {
        response = await fetch(
          `/api/questions/${String(questionId)}/best-answer`,
          {
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              bestAnswerId: null,
            }),
          },
        );
      }
      // optimistic UI rollback
      if (!response.ok) {
        onBest(isBest ? parseInt(answerId) : null);
      }
    } catch (error) {
      console.error("Error selecting best answer:", error);
    }
  };

  return (
    <div>
      {String(authUser?.userId) === String(bestInfo.questionUserId) ? (
        <p
          onClick={() => {
            handleBestAnswer();
          }}
          className={
            isBest
              ? styles.selectedBestAnswerButton
              : styles.unselectedBestAnswerButton
          }
        >
          {isBest ? "★★Best Answer★★" : "Best Answerに選択する"}
        </p>
      ) : (
        <p className={styles.selectedBestAnswerButton}>
          {isBest ? "★★Best Answer★★" : ""}
        </p>
      )}
    </div>
  );
};
