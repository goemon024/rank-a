"use client";
import React, { useState } from "react";
import styles from "./QuestionCard.module.css";
import { useAuth } from "@/contexts/AuthContext";
import { QuestionWithUserAndTags } from "@/types"; //voteSummaryは今回省略
// import AnswerModal from "../Modal/AnswerModal";
import DeleteModal from "../Modal/DeleteModal"; // DeleteQuesionModalではなく今回はこちらを使う。

export default function EditDeleteButton({
  question,
  // votes,
  // commentCount,
}: {
  question: QuestionWithUserAndTags;
  // votes?: VoteSummary;
  // commentCount: number;
}) {
  const { user: authUser } = useAuth();
  const isAuther = Number(authUser?.userId) === question.userId;
  // const [editModal, setEditModal] = useState<boolean>(false);
  const [deleteModal, setDeleteModal] = useState<boolean>(false);

  // const isDisabled = commentCount > 0 || question.answerCountDirect > 0;
  // commentCount > 0 || (votes?.upvotes ?? 0) > 0 ||
  // (votes?.downvotes ?? 0) > 0 || ;

  // useEffect(() => {
  //   console.log("votes", votes);
  // }, [votes]);

  return (
    <>
      {isAuther && (
        // <div className={styles.editDeleteButton}>
        //   <button
        //     className={!isDisabled ? styles.editButton : styles.disabledButton}
        //     onClick={() => setEditModal(true)}
        //     disabled={isDisabled}
        //   >
        //     編集
        //   </button>
        <button
          className={
            // !isDisabled ? styles.deleteButton : styles.disabledButton
            styles.deleteButton
          }
          onClick={() => setDeleteModal(true)}
          // disabled={isDisabled}
        >
          削除
        </button>
        // </div>
      )}
      {deleteModal && (
        <DeleteModal setOpen={setDeleteModal} question={question} />
      )}
    </>
  );
}
