"use client";
import { useState } from "react";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import { IconButton, Stack, Typography } from "@mui/material";

type Props = {
  answerId: number;
  initialVote: "Upvote" | "Downvote" | null;
  initialUpvotes: number;
  initialDownvotes: number;
  voteId: number | undefined;
};

export default function UpvoteDownvote({
  answerId,
  initialVote,
  initialUpvotes,
  initialDownvotes,
  voteId,
}: Props) {
  const [vote, setVote] = useState<"Upvote" | "Downvote" | null>(initialVote);
  const [upvotes, setUpvotes] = useState(initialUpvotes);
  const [downvotes, setDownvotes] = useState(initialDownvotes);
  const [isVoteId, setIsVoteId] = useState<number | undefined>(voteId);

  const token = localStorage.getItem("token");

  const handleVote = async (type: "Upvote" | "Downvote") => {
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

      // // // ❗ ロールバック処理
      // if (vote === type) {
      //     // UIではvote削除してたので戻す
      //     setVote(type);
      //     if (type === "Upvote") setUpvotes((prev) => prev + 1);
      //     else setDownvotes((prev) => prev + 1);
      // } else {
      //     setVote(vote); // 前のvoteに戻す
      //     if (type === "Upvote") {
      //         setUpvotes((prev) => prev - 1);
      //         if (vote === "Downvote") setDownvotes((prev) => prev + 1);
      //     } else {
      //         setDownvotes((prev) => prev - 1);
      //         if (vote === "Upvote") setUpvotes((prev) => prev + 1);
      //     }
      // }
    }
  };

  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <IconButton
        onClick={() => handleVote("Upvote")}
        color={vote === "Upvote" ? "primary" : "default"}
      >
        <ThumbUpIcon />
      </IconButton>
      <Typography variant="body2">{upvotes}</Typography>

      <IconButton
        onClick={() => handleVote("Downvote")}
        color={vote === "Downvote" ? "error" : "default"}
      >
        <ThumbDownIcon />
      </IconButton>
      <Typography variant="body2">{downvotes}</Typography>
    </Stack>
  );
}
