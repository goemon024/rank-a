"use client";

import React, { useState, useEffect } from "react";
import { Header } from "@/app/components/Header/Header";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import styles from "./question-post.module.css";
import CreateTitle from "@/app/components/Forms/CreateTitle";
import CreateDescription from "@/app/components/Forms/CreateDescription";
import TagSelector from "@/app/components/Forms/TagSelector";
import { LINKS_HOME } from "@/constants";
import { useRef } from "react";

import { parseJwt } from "@/lib/parseJwt";
import { QuestionCard } from "@/app/components/QuestionCard/QuestionCard";
import { DescriptionCard } from "@/app/components/QuestionCard/DescriptionCard";
import { QuestionWithUserAndTags } from "@/types";

export default function QuestionPost() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [tags, setTags] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const isDrafrRef = useRef(false);

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/home");
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const isDraft = isDrafrRef.current;
    console.log("isDraft:", isDraft);

    console.log(tags);

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
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const token = localStorage.getItem("token");
  const payload = token ? parseJwt(token) : null;

  const previewQuestion: QuestionWithUserAndTags = {
    id: -1,
    title,
    description,
    createdAt: new Date(),
    isDraft: false,
    userId: payload?.userId || 0,
    bestAnswerId: null,
    user: {
      username: payload?.username || "未ログインユーザー",
      imagePath: payload?.imagePath || null,
    },
    questionTags: tags.map((tagId) => ({ questionId: -1, tagId })),
  };

  return (
    <div>
      <Header links={LINKS_HOME} />
      <div className={styles.container}>
        <h2 className={styles.title}>質問を投稿</h2>
        <form className={styles.form} onSubmit={handleSubmit}>
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
  );
}
