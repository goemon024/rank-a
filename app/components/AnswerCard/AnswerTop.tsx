import React from "react";
import styles from "./AnswerCard.module.css";
import AnswerButton from "../Button/AnswerButton";
import CommentButton from "../Button/CommentButton";

export const AnswerTop = ({
  setOpen,
  count,
  isUser,
  isDraft,
  setCommentButtonClick,
}: {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  count: number;
  isUser: number;
  isDraft: boolean;
  setCommentButtonClick: () => void;
}) => {
  return (
    <div className={styles.answerTop}>
      <div>回答 {count}件</div>
      <div>
        <AnswerButton setOpen={setOpen} isUser={isUser} />
      </div>
      <div>
        <CommentButton setCommentButtonClick={setCommentButtonClick}
          isDraft={isDraft} />
      </div>
    </div>
  );
};
