"use client";
import { useState } from "react";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import { IconButton, Stack, Typography } from "@mui/material";
import { useAuth } from "@/contexts/AuthContext";
import styles from "./Vote.module.css";
import { VoteSummary } from "@/types";

type Props = {
  answerId: number;
  answerUserId: number;
  votes?: VoteSummary;
  setVotes: (votes: VoteSummary) => void;
  // initialVote: "Upvote" | "Downvote" | null;
  // initialUpvotes: number;
  // initialDownvotes: number;
  // voteId: number | undefined;
};

export default function UpvoteDownvote({
  answerId,
  answerUserId,
  votes,
  setVotes,
}: Props) {
  const [vote, setVote] = useState<"Upvote" | "Downvote" | null>(votes?.userVote || null,
  );
  const [upvotes, setUpvotes] = useState(votes?.upvotes || 0);
  const [downvotes, setDownvotes] = useState(votes?.downvotes || 0);
  const [isVoteId, setIsVoteId] = useState<number | undefined>(votes?.voteId);
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
        setVotes({
          ...votes,
          voteId: parseInt(result.id, 10),
          userVote: type,
          upvotes: type === "Upvote" ? upvotes + 1 : upvotes,
          downvotes: type === "Downvote" ? downvotes + 1 : downvotes,
        });
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
        setVotes({
          ...votes,
          voteId: undefined,
          userVote: null,
          upvotes: type === "Upvote" ? upvotes - 1 : upvotes,
          downvotes: type === "Downvote" ? downvotes - 1 : downvotes,
        });
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

        let newUpvotes = upvotes;
        let newDownvotes = downvotes;

        if (type === "Upvote") {
          if (vote === "Downvote") newDownvotes -= 1;
          newUpvotes += 1;
        } else if (type === "Downvote") {
          if (vote === "Upvote") newUpvotes -= 1;
          newDownvotes += 1;
        }

        setVotes({
          ...votes,
          userVote: type,
          upvotes: newUpvotes,
          downvotes: newDownvotes,
        });
      }
      // Toggle処理
      if (vote === type) {
        // 同じ投票→キャンセル
        setVote(null);
        if (type === "Upvote") setUpvotes((prev: number) => prev - 1);
        else setDownvotes((prev: number) => prev - 1);
      } else {
        // 切り替えまたは新規投票
        if (type === "Upvote") {
          setUpvotes((prev: number) => prev + 1);
          if (vote === "Downvote") setDownvotes((prev: number) => prev - 1);
        } else {
          setDownvotes((prev: number) => prev + 1);
          if (vote === "Upvote") setUpvotes((prev: number) => prev - 1);
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
