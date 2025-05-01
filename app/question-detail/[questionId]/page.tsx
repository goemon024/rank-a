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
} from "@/types";
import { LINKS_HOME } from "@/constants";
import { useParams } from "next/navigation";
import { AnswerTop } from "@/app/components/AnswerCard/AnswerTop";
import AnswerModal from "@/app/components/Modal/AnswerModal";
import { AnswerCard } from "@/app/components/AnswerCard/AnswerCard";
import CommentModal from "@/app/components/Modal/CommentModal";
import { CommentCard } from "@/app/components/CommentCard/CommentCard";

export default function QuestionDetail() {
  const params = useParams();
  const { questionId } = params as { questionId: string };

  const [question, setQuestion] = useState<QuestionWithUserAndTags | null>(
    null,
  );
  const [answers, setAnswers] = useState<AnswerWithUser[]>([]);
  const [comments, setComments] = useState<CommentWithUser[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isAnswerModalOpen, setIsAnswerModalOpen] = useState(false);
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);

  // コメントモーダルで選択された回答のIDを保持する
  const [selectedAnswerId, setSelectedAnswerId] = useState<number | null>(null);

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const res = await fetch(`/api/questions/${questionId}`);
        const question = (await res.json()) as QuestionWithUserAndTags;
        setQuestion(question);

        const answersRes = await fetch(`/api/questions/${questionId}/answers`);
        const { answers: answerList, count } = (await answersRes.json()) as {
          answers: AnswerWithUser[];
          count: number;
        };
        setAnswers(answerList);
        setCount(count);

        const commentsRes = await fetch(
          `/api/questions/${questionId}/comments`,
        );
        const { comments: commentList } = (await commentsRes.json()) as {
          comments: CommentWithUser[];
        };
        setComments(commentList);
      } catch (error) {
        setError(error as string);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestion();
    console.log(answers);
  }, [questionId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!question) return <div>Question not found</div>;

  return (
    <div>
      <Header links={LINKS_HOME} />
      <div className={styles.container}>
        <QuestionCard question={question} />
        <DescriptionCard question={question} />

        {comments
          .filter((comment) => !comment.answerId)
          .map((comment) => (
            <CommentCard key={comment.id} comment={comment} />
          ))}

        <AnswerTop
          setOpen={setIsAnswerModalOpen}
          count={count}
          isUser={question.userId}
          setCommentButtonClick={() => {
            setSelectedAnswerId(null);
            setIsCommentModalOpen(true);
          }}
        />
        {answers.map((answer) => (
          <div key={answer.id}>
            <AnswerCard
              key={answer.id}
              answer={answer}
              setCommentButtonClick={() => {
                setSelectedAnswerId(answer.id);
                setIsCommentModalOpen(true);
              }}
            />
            {comments
              .filter((comment) => comment.answerId === answer.id)
              .map((comment) => (
                <CommentCard key={comment.id} comment={comment} />
              ))}
          </div>
        ))}
      </div>
      {isAnswerModalOpen && (
        <AnswerModal setOpen={setIsAnswerModalOpen} questionId={questionId} />
      )}
      {isCommentModalOpen && (
        <CommentModal
          setOpen={setIsCommentModalOpen}
          questionId={questionId}
          answerId={selectedAnswerId?.toString()}
        />
      )}
    </div>
  );
}
