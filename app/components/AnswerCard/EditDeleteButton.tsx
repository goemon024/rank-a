"use client";
import React, { useState, useEffect } from "react";
import styles from "./AnswerCard.module.css";
import { useAuth } from "@/contexts/AuthContext";
import { AnswerWithUser, VoteMap } from "@/types";
import AnswerModal from "../Modal/AnswerModal";
import DeleteModal from "../Modal/DeleteModal";

export default function EditDeleteButton({
  answer,
  votes,
  commentCount,
  onSuccessEdit,
  onSuccessDelete,
}: {
  answer: AnswerWithUser;
  votes?: VoteMap;
  commentCount: number;
  onSuccessEdit?: () => void;
  onSuccessDelete?: () => void;
}) {
  const { user: authUser } = useAuth();
  const isAuther = Number(authUser?.userId) === answer.userId;
  const [editModal, setEditModal] = useState<boolean>(false);
  const [deleteModal, setDeleteModal] = useState<boolean>(false);

  const isDisabled =
    commentCount > 0 ||
    (votes?.[answer.id]?.upvotes ?? 0) > 0 ||
    (votes?.[answer.id]?.downvotes ?? 0) > 0;

  useEffect(() => {
    console.log("votes", votes);
  }, [votes]);

  return (
    <>
      {isAuther && (
        <div className={styles.editDeleteButton}>
          <button
            className={!isDisabled ? styles.editButton : styles.disabledButton}
            onClick={() => setEditModal(true)}
            disabled={isDisabled}
          >
            編集
          </button>
          <button
            className={
              !isDisabled ? styles.deleteButton : styles.disabledButton
            }
            onClick={() => setDeleteModal(true)}
            disabled={isDisabled}
          >
            削除
          </button>
        </div>
      )}
      {editModal &&
        <AnswerModal
          setOpen={setEditModal}
          answer={answer}
          onSuccess={onSuccessEdit}
        />}
      {deleteModal && (
        <DeleteModal
          setOpen={setDeleteModal}
          answer={answer}
          onSuccess={onSuccessDelete}
        />
      )}
    </>
  );
}
