"use client";

import React from "react";
import styles from "./Button.module.css";
import { useAuth } from "@/contexts/AuthContext";

const CommentButton = ({
  setCommentButtonClick,
  isDraft = false,
}: {
  setCommentButtonClick: () => void;
  isDraft?: boolean;
}) => {
  const { isAuthenticated } = useAuth();

  const handleClick = () => {
    setCommentButtonClick();
  };
  return (
    <button
      onClick={() => handleClick()}
      className={
        !isAuthenticated
          ? styles.commentDisabledButton
          : isDraft
            ? styles.commentDisabledButton
            : styles.commentButton
      }
      disabled={!isAuthenticated || isDraft}
    >
      コメントを投稿
    </button>
  );
};

export default CommentButton;
