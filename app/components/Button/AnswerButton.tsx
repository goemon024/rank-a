"use client";

import React from "react";
import styles from "./Button.module.css";
import { useAuth } from "@/contexts/AuthContext";

const AnswerButton = ({
  setOpen,
  isUser,
}: {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isUser: number;
}) => {
  const { isAuthenticated, user } = useAuth();

  const handleClick = () => {
    setOpen(true);
  };
  return (
    <div>
      <button
        onClick={() => handleClick()}
        className={
          !isAuthenticated || isUser === Number(user?.userId)
            ? styles.answerDisabledButton
            : styles.answerButton
        }
        disabled={!isAuthenticated || isUser === Number(user?.userId)}
      >
        回答を投稿
      </button>
    </div>
  );
};

export default AnswerButton;
