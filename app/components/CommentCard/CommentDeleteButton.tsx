"use client";
import React, { useState } from "react";
import styles from "./CommentCard.module.css";
import { useAuth } from "@/contexts/AuthContext";
import { CommentWithUser } from "@/types";

import DeleteModal from "../Modal/DeleteModal";

export default function CommentDeleteButton({
  comment,
}: {
  comment: CommentWithUser;
}) {
  const { user: authUser } = useAuth();
  const isAuther = Number(authUser?.userId) === comment.userId;
  const [deleteModal, setDeleteModal] = useState<boolean>(false);

  return (
    <>
      {isAuther ? (
        <button
          className={styles.deleteButton}
          onClick={() => setDeleteModal(true)}
          disabled={!isAuther}
        >
          削除
        </button>
      ) : (
        <div className={styles.deleteButton}></div>
      )}
      {deleteModal && (
        <DeleteModal setOpen={setDeleteModal} comment={comment} />
      )}
    </>
  );
}
