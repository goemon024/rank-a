"use client";

import React from "react";
import styles from "./Button.module.css";
import { useAuth } from "@/contexts/AuthContext";

const CommentButton = ({
  setCommentButtonClick,
}: {
  setCommentButtonClick: () => void;
}) => {
  const { isAuthenticated } = useAuth();

  const handleClick = () => {
    setCommentButtonClick();
  };
  return (
    <div>
      <button
        onClick={() => handleClick()}
        className={
          !isAuthenticated ? styles.commentDisabledButton : styles.commentButton
        }
        disabled={!isAuthenticated}
      >
        コメントを投稿
      </button>
    </div>
  );
};

export default CommentButton;
