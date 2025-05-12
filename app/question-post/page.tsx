"use client";

import React, { useState, useEffect, useRef } from "react";
import { Header } from "@/app/components/Header/Header";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import styles from "./question-post.module.css";
import CreateTitle from "@/app/components/Forms/CreateTitle";
import CreateDescription from "@/app/components/Forms/CreateDescription";
import TagSelector from "@/app/components/Forms/TagSelector";
import { getLinksProfile } from "@/constants";

import { parseJwt } from "@/lib/parseJwt";
import { QuestionCard } from "@/app/components/QuestionCard/QuestionCard";
import { DescriptionCard } from "@/app/components/QuestionCard/DescriptionCard";
import { QuestionWithUserAndTags, JwtPayload } from "@/types";
import { questionSchema } from "@/schemas/qustionSchema";

import LoadingModal from "@/app/components/LoadingModal/LoadingModal";

export default function QuestionPost() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [tags, setTags] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isDrafrRef = useRef(false);

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const { user: authUser } = useAuth();
  const links = getLinksProfile(String(authUser?.userId));

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/home");
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const isDraft = isDrafrRef.current;

    const result = questionSchema.safeParse({
      title,
      description,
      tags,
    });

    if (!result.success) {
      console.error("Validation error:", result.error);
      setError(result.error.errors[0].message);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
        body: JSON.stringify({
          title,
          description,
          isDraft,
          tags: tags,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "質問の投稿に失敗しました");
      }

      // 成功時の処理
      // await router.refresh();
      // await new Promise((resolve) => setTimeout(resolve, 100));

      // router.push("/");
    } catch (error) {
      // eslint-disable-next-line no-console
      setError("エラーが発生しました");
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
      router.push("/");
    }
  };

  const [payload, setPayload] = useState<JwtPayload | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setPayload(token ? parseJwt(token) : null);
  }, []);

  const previewQuestion: QuestionWithUserAndTags = {
    id: -1,
    title,
    description,
    createdAt: new Date(),
    isDraft: false,
    userId: payload?.userId || 0,
    bestAnswerId: null,
    score: 0,
    answerCount: 0,
    upvoteCount: 0,
    user: {
      username: payload?.username || "未ログインユーザー",
      imagePath: payload?.imagePath || null,
    },
    questionTags: tags.map((tagId) => ({ questionId: -1, tagId })),
  };

  // if (typeof isAuthenticated === "undefined") {
  //   return <LoadingModal />;
  // }

  return isAuthenticated ? (
    <div>
      <Header links={links} />
      <div className={styles.container}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <h2 className={styles.title}>質問を投稿</h2>
          {error && <p className={styles.alert}>{error}</p>}
          <CreateTitle title={title} setTitle={setTitle} />
          <CreateDescription
            description={description}
            setDescription={setDescription}
          />
          <TagSelector onChange={setTags} />
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
                onClick={() => setIsPreviewOpen(true)}
              >
                preview
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
  ) : (
    <LoadingModal />
  );
}
