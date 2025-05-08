"use client";

import React, { useState } from "react";
import styles from "./modal.module.css";
import {
  AnswerWithUser,
  QuestionWithUserAndTags,
  CommentWithUser,
} from "@/types";

type DeleteModalProps = {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  question?: QuestionWithUserAndTags;
  answer?: AnswerWithUser;
  comment?: CommentWithUser;
};

const DeleteModal = ({
  setOpen,
  question,
  answer,
  comment,
}: DeleteModalProps) => {
  if (!question && !answer && !comment) {
    throw new Error("question または answer または comment が必要です");
  }

  const [errorDelete, setErrorDelete] = useState<string | null>(null);

  const token = localStorage.getItem("token");

  const handleSubmit = async () => {
    setErrorDelete(null);
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

      // 投稿成功したらモーダルを閉じる
      setOpen(false);
      // 必要ならページをリロードしたり、回答リストを更新したりもできる
      // location.reload()
    } catch (error) {
      console.error(error);
      setErrorDelete("削除に失敗しました");
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={() => setOpen(false)}>
      <div className={styles.answerModal} onClick={(e) => e.stopPropagation()}>
        <div>
          <h3>本当に削除しますか？</h3>
          {errorDelete ? (
            <p className={styles.alert}>{errorDelete}</p>
          ) : (
            <p></p>
          )}
        </div>
        <div className={styles.DeleteButtonContainer}>
          <button onClick={handleSubmit} className={styles.DeleteButton}>
            削除
          </button>
          <button
            onClick={() => setOpen(false)}
            className={styles.DeleteButton}
          >
            キャンセル
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;

// // components/DeleteDialog.tsx
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
// } from "@mui/material";

// type Props = {
//   open: boolean;
//   onClose: () => void;
//   onDelete: () => void;
//   targetLabel: string;
//   loading?: boolean;
//   children?: React.ReactNode;
// };

// export default function DeleteModal({
//   open,
//   onClose,
//   onDelete,
//   targetLabel,
//   loading,
//   children,
// }: Props) {
//   return (
//     <Dialog open={open} onClose={onClose}>
//       <DialogTitle>{targetLabel}の削除</DialogTitle>
//       <DialogContent>
//         本当にこの{targetLabel}を削除しますか？この操作は取り消せません。
//       </DialogContent>
//       {children}
//       <DialogActions>
//         <Button onClick={onClose} disabled={loading}>
//           キャンセル
//         </Button>
//         <Button onClick={onDelete} color="error" disabled={loading}>
//           削除する
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// }
