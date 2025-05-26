"use client";

import React, { useEffect, useState } from "react";
import styles from "./question-detail.module.css";
import { Header } from "@/app/components/Header/Header";
import { QuestionCard } from "@/app/components/QuestionCard/QuestionCard";
import { DescriptionCard } from "@/app/components/QuestionCard/DescriptionCard";
import {
  QuestionWithUserAndTags,
  AnswerWithUser,
  CommentWithUser,
  VoteMap,
} from "@/types";
// import { LINKS_HOME } from "@/constants";
import { useParams } from "next/navigation";
import { AnswerTop } from "@/app/components/AnswerCard/AnswerTop";
import AnswerModal from "@/app/components/Modal/AnswerModal";
import { AnswerCard } from "@/app/components/AnswerCard/AnswerCard";
import CommentModal from "@/app/components/Modal/CommentModal";
import { CommentCard } from "@/app/components/CommentCard/CommentCard";
import LoadingModal from "@/app/components/LoadingModal/LoadingModal";
import { useRouter, useSearchParams } from "next/navigation";
import { getLinkQuestionDetail, BreadDetailpage } from "@/constants";

import Breadcrumbs from "@/app/components/BreadCrumb/BreadCrumbs";

// import { AuthProvider } from "@/contexts/AuthContext";
export default function QuestionDetail() {
  const params = useParams();
  const { questionId } = params as { questionId: string };

  const [question, setQuestion] = useState<QuestionWithUserAndTags | null>(
    null,
  );
  const [answers, setAnswers] = useState<AnswerWithUser[]>([]);
  const [comments, setComments] = useState<CommentWithUser[]>([]);
  const [votes, setVotes] = useState<VoteMap>({});
  const [votesQuestion, setVotesQuestion] = useState<VoteMap>({});

  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAnswerModalOpen, setIsAnswerModalOpen] = useState(false);
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);

  // コメントモーダルで選択された回答のIDを保持する
  const [selectedAnswerId, setSelectedAnswerId] = useState<number | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  // ベスト回答のIDを保持する
  const [bestAnswerId, setBestAnswerId] = useState<number | null>(null);
  const router = useRouter();

  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const res = await fetch(`/api/questions/${questionId}`);
        const question = (await res.json()) as QuestionWithUserAndTags;
        setQuestion(question);
        setBestAnswerId(question.bestAnswerId ?? null);

        const answersRes = await fetch(`/api/questions/${questionId}/answers`);
        const { answers: answerList, count } = (await answersRes.json()) as {
          answers: AnswerWithUser[];
          count: number;
        };
        setAnswers(answerList);
        setCount(count ?? 0);

        // answerの投票数を取得
        const votesRes = await fetch(`/api/votes?questionId=${questionId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          },
        });
        const voteMap = (await votesRes.json()) as VoteMap;
        setVotes(voteMap);

        // questionの投票数を取得
        const votesQuestionRes = await fetch(
          `/api/votesQuestion?questionId=${questionId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
            },
          },
        );
        const voteMapQuestion = (await votesQuestionRes.json()) as VoteMap;
        setVotesQuestion(voteMapQuestion);

        // comment取得
        const commentsRes = await fetch(
          `/api/questions/${questionId}/comments`,
        );
        const { comments: commentList } = (await commentsRes.json()) as {
          comments: CommentWithUser[];
        };
        setComments(commentList);
        setIsLoading(false);
      } catch (error) {
        setError(error as string);
        router.push("/");
      }
    };
    fetchQuestion();
  }, [questionId, reloadKey]);

  if (error) return null;
  if (!question) return null;

  return isLoading ? (
    <LoadingModal />
  ) : (
    <div>
      <Header links={getLinkQuestionDetail(searchParams)} />
      <Breadcrumbs hierarchy={BreadDetailpage()} pageCategory="detail" />

      <div className={styles.container}>
        <QuestionCard
          question={question}
          linkDisabled={true}
          bestAnswerId={bestAnswerId}
          questionVoteDisplay={true}
          votes={votesQuestion}
          setVotes={setVotesQuestion}
        />
        <DescriptionCard question={question} />

        {Array.isArray(comments) &&
          comments
            .filter((comment) => !comment.answerId)
            .map((comment) => (
              <CommentCard
                key={comment.id}
                comment={comment}
                onSuccess={() => setReloadKey(reloadKey + 1)}
              />
            ))}

        <AnswerTop
          setOpen={setIsAnswerModalOpen}
          count={count}
          isUser={question.userId}
          isDraft={question.isDraft}
          setCommentButtonClick={() => {
            setSelectedAnswerId(null);
            setIsCommentModalOpen(true);
          }}
        />
        {Array.isArray(answers) &&
          [...answers]
            .sort((a, b) => {
              if (a.id === bestAnswerId) return -1;
              if (b.id === bestAnswerId) return 1;

              const aVotes = votes[a.id]?.upvotes || 0;
              const bVotes = votes[b.id]?.upvotes || 0;
              return bVotes - aVotes;
            })
            .map((answer) => {
              const answerComments = Array.isArray(comments)
                ? comments.filter((comment) => comment.answerId === answer.id)
                : [];
              return (
                <div key={answer.id}>
                  <AnswerCard
                    key={answer.id}
                    answer={answer}
                    // votes={votes[answer.id]}
                    votes={votes}
                    setVotes={setVotes}
                    onBest={setBestAnswerId}
                    isBest={bestAnswerId === answer.id}
                    bestInfo={{
                      questionUserId: question.userId,
                      bestAnswerId: question.bestAnswerId ?? 0,
                    }}
                    commentCount={answerComments.length}
                    setCommentButtonClick={() => {
                      setSelectedAnswerId(answer.id);
                      setIsCommentModalOpen(true);
                    }}
                    onSuccessEdit={() => setReloadKey(reloadKey + 1)}
                    onSuccessDelete={() => setReloadKey(reloadKey + 1)}
                  />
                  {answerComments.map((comment) => (
                    <CommentCard
                      key={comment.id}
                      comment={comment}
                      onSuccess={() => setReloadKey(reloadKey + 1)}
                    />
                  ))}
                </div>
              );
            })}
      </div>
      {isAnswerModalOpen && (
        <AnswerModal
          setOpen={setIsAnswerModalOpen}
          questionId={questionId}
          onSuccess={() => setReloadKey(reloadKey + 1)}
        />
      )}
      {isCommentModalOpen && (
        <CommentModal
          setOpen={setIsCommentModalOpen}
          questionId={questionId}
          answerId={selectedAnswerId?.toString()}
          onSuccess={() => setReloadKey(reloadKey + 1)}
        />
      )}
    </div>
  );
}
