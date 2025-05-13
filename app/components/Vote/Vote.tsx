"use client";
import { useState } from "react";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import { IconButton, Stack, Typography } from "@mui/material";
import { useAuth } from "@/contexts/AuthContext";
import styles from "./Vote.module.css";

type Props = {
  answerId: number;
  answerUserId: number;
  initialVote: "Upvote" | "Downvote" | null;
  initialUpvotes: number;
  initialDownvotes: number;
  voteId: number | undefined;
};

export default function UpvoteDownvote({
  answerId,
  answerUserId,
  initialVote,
  initialUpvotes,
  initialDownvotes,
  voteId,
}: Props) {
  const [vote, setVote] = useState<"Upvote" | "Downvote" | null>(initialVote);
  const [upvotes, setUpvotes] = useState(initialUpvotes);
  const [downvotes, setDownvotes] = useState(initialDownvotes);
  const [isVoteId, setIsVoteId] = useState<number | undefined>(voteId);
  const [isLoading, setIsLoading] = useState(false);
  const { user: authUser } = useAuth();

  const token = localStorage.getItem("token");

  const handleVote = async (type: "Upvote" | "Downvote") => {
    console.log(authUser?.userId, answerUserId);
    console.log(String(authUser?.userId) === String(answerUserId));

    if (String(authUser?.userId) === String(answerUserId)) {
      // 自分の回答には投票できないようにする。
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      if (!vote) {
        // まだ投票していない → 新規作成
        const res = await fetch("/api/votes", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ answerId, type }),
        });

        if (!res.ok) throw new Error("投票に失敗しました");
        const result = await res.json();

        setIsVoteId(parseInt(result.id, 10));
      } else if (vote === type) {
        // 同じ投票をもう一度押した → 取消（DELETE）
        const res = await fetch(`/api/votes/${isVoteId}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error("投票の取り消しに失敗しました");
        setIsVoteId(undefined);
      } else {
        // 異なる投票に切り替え（PUT）
        const res = await fetch(`/api/votes/${isVoteId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ type }),
        });
        if (!res.ok) throw new Error("投票の更新に失敗しました");
      }
      // Toggle処理
      if (vote === type) {
        // 同じ投票→キャンセル
        setVote(null);
        if (type === "Upvote") setUpvotes((prev) => prev - 1);
        else setDownvotes((prev) => prev - 1);
      } else {
        // 切り替えまたは新規投票
        if (type === "Upvote") {
          setUpvotes((prev) => prev + 1);
          if (vote === "Downvote") setDownvotes((prev) => prev - 1);
        } else {
          setDownvotes((prev) => prev + 1);
          if (vote === "Upvote") setUpvotes((prev) => prev - 1);
        }
        setVote(type);
      }
    } catch (err) {
      console.error("投票エラー:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <IconButton
        onClick={() => handleVote("Upvote")}
        color={vote === "Upvote" ? "primary" : "default"}
        disabled={isLoading}
        className={
          String(authUser?.userId) === String(answerUserId)
            ? styles.disabled
            : ""
        }
      >
        <ThumbUpIcon />
      </IconButton>
      <Typography variant="body2">{upvotes}</Typography>

      <IconButton
        onClick={() => handleVote("Downvote")}
        color={vote === "Downvote" ? "error" : "default"}
        disabled={isLoading}
        className={
          String(authUser?.userId) === String(answerUserId)
            ? styles.disabled
            : ""
        }
      >
        <ThumbDownIcon />
      </IconButton>
      <Typography variant="body2">{downvotes}</Typography>
    </Stack>
  );
}
