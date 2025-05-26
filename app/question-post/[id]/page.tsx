"use client";

import React, { useState, useEffect } from "react";
import { Header } from "@/app/components/Header/Header";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import styles from "../question-post.module.css";
import CreateTitle from "@/app/components/Forms/CreateTitle";
import CreateDescription from "@/app/components/Forms/CreateDescription";
import TagSelector from "@/app/components/Forms/TagSelector";
import { getLinksProfile } from "@/constants";
import { useRef } from "react";

import DeleteQuestionModal from "@/app/components/Modal/DeleteQuestionModal";
// import PreviewModal from "@/app/components/Modal/PreviewModal";

import { parseJwt } from "@/lib/parseJwt";
import { QuestionCard } from "@/app/components/QuestionCard/QuestionCard";
import { DescriptionCard } from "@/app/components/QuestionCard/DescriptionCard";
import { QuestionWithUserAndTags } from "@/types";
import { useParams } from "next/navigation";
import { questionSchema } from "@/schemas/qustionSchema";
import LoadingModal from "@/app/components/LoadingModal/LoadingModal";

import Breadcrumbs from "@/app/components/BreadCrumb/BreadCrumbs";
import { BreadDraftpage } from "@/constants";

export default function QuestionPut({ }) {
  const params = useParams();
  const questionId = params.id as string;

  const router = useRouter();
  const [question, setQuestion] = useState<QuestionWithUserAndTags | null>(
    null,
  );
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [tags, setTags] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const isDrafrRef = useRef(false);

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { user: authUser } = useAuth();
  const links = getLinksProfile(String(authUser?.userId));

  const [payload, setPayload] = useState<{
    userId: number;
    username: string;
    imagePath?: string | null;
  } | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setPayload(token ? parseJwt(token) : null);
  }, []);

  useEffect(() => {
    if (!questionId) return;

    const fetchQuestion = async () => {
      const response = await fetch(`/api/questions/${questionId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();

      if (String(data.userId) === String(authUser?.userId)) {
        setQuestion(data);
        setTitle(data.title);
        setDescription(data.description);
        setTags(data.questionTags.map((t: { tagId: number }) => t.tagId));
        setIsLoading(false);
      } else {
        router.push("/home");
      }
    };
    fetchQuestion();
    console.log(tags);
  }, [questionId]);

  useEffect(() => {
    if (!question) return;
    // 1. ログインユーザーのuserId取得
    const loginUserId = payload?.userId;

    // 2. 質問データの投稿者userId（例: question.userId）
    // questionはAPI等から取得済みと仮定
    if (!loginUserId || loginUserId !== question.userId) {
      router.push("/home");
    }
  }, [question, router, payload]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const isDraft = isDrafrRef.current;

    const result = questionSchema.safeParse({
      title,
      description,
      tags,
    });

    if (!result.success) {
      setError(result.error.errors[0].message);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/questions/${questionId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
        body: JSON.stringify({
          id: questionId,
          title,
          description,
          isDraft,
          tags: tags,
          createdAt: new Date(),
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "質問の投稿に失敗しました");
      }

      if (isDraft) {
        router.push("/profile/" + payload?.userId + "/drafts");
        return;
      } else {
        router.push(`/question-detail/${data.question.id}`);
        return;
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Error:", error);
      setError("エラーが発生しました");
    }
  };

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/questions/${questionId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
      });
      if (!response.ok) {
        const data = await response.json();
        setError(data.error || "削除に失敗しました");
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
      setIsDeleteOpen(false);
      router.push("/profile/" + payload?.userId + "/drafts");
    }
  };

  const previewQuestion: QuestionWithUserAndTags = {
    id: parseInt(questionId),
    title,
    description,
    createdAt: new Date(),
    isDraft: false,
    userId: question?.userId || 0,
    bestAnswerId: null,
    score: 0,
    answerCount: 0,
    answerCountDirect: 0,
    upvoteCount: 0,
    user: {
      username: payload?.username || "未ログインユーザー",
      imagePath: payload?.imagePath || null,
    },
    questionTags: tags.map((tagId) => ({
      questionId: parseInt(questionId),
      tagId,
    })),
  };

  return isLoading ? (
    <LoadingModal />
  ) : (
    <div>
      <Header links={links} />
      <Breadcrumbs
        hierarchy={BreadDraftpage(String(payload?.userId))}
        pageCategory="overview" />
      <div className={styles.container}>

        <h2 className={styles.title}>質問を投稿</h2>

        <form className={styles.form} onSubmit={handleSubmit}>
          {error && <p className={styles.alert}>{error}</p>}
          <CreateTitle title={title} setTitle={setTitle} />
          <CreateDescription
            description={description}
            setDescription={setDescription}
          />
          <TagSelector onChange={setTags} tags={tags} />
          <div className={styles.buttonContainer}>
            <div className={styles.buttonSection}>
              <button
                className={styles.button}
                type="submit"
                disabled={isLoading}
                onClick={() => (isDrafrRef.current = true)}
              >
                下書き保存
              </button>
              <button
                className={styles.button}
                type="button"
                disabled={isLoading}
                onClick={() => setIsPreviewOpen(true)}
              >
                preview
              </button>
              <button
                className={styles.deleteButton}
                type="button"
                disabled={isLoading}
                onClick={() => setIsDeleteOpen(true)}
              >
                削除
              </button>
              <DeleteQuestionModal
                open={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                onDelete={handleDelete}
                targetLabel="質問"
                loading={isLoading}
              >
                {error && <p className={styles.error}>{error}</p>}
              </DeleteQuestionModal>
            </div>

            <button
              className={styles.button}
              type="submit"
              disabled={isLoading}
              onClick={() => (isDrafrRef.current = false)}
            >
              投稿
            </button>
          </div>
        </form>
      </div>

      {isPreviewOpen && (
        <div
          className={styles.modalOverlay}
          onClick={() => setIsPreviewOpen(false)}
        >
          <div
            className={styles.previewContainer}
            onClick={(e) => e.stopPropagation()}
          >
            <QuestionCard question={previewQuestion} />
            <DescriptionCard question={previewQuestion} />
            <form onSubmit={handleSubmit}>
              <div className={styles.buttonContainer}>
                <div className={styles.buttonSection}>
                  <button
                    className={styles.button}
                    name="action"
                    value="draft"
                    type="submit"
                    disabled={isLoading}
                    onClick={() => (isDrafrRef.current = true)}
                  >
                    下書き保存
                  </button>
                  <button
                    className={styles.button}
                    type="button"
                    disabled={isLoading}
                    onClick={() => setIsPreviewOpen(false)}
                  >
                    戻る
                  </button>
                </div>

                <button
                  className={styles.button}
                  name="action"
                  value="publish"
                  type="submit"
                  disabled={isLoading}
                  onClick={() => (isDrafrRef.current = false)}
                >
                  投稿
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
