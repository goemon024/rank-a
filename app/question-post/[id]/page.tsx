"use client";

import React, { useState, useEffect } from "react";
import { Header } from "@/app/components/Header/Header";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import styles from "../question-post.module.css";
import CreateTitle from "@/app/components/Forms/CreateTitle";
import CreateDescription from "@/app/components/Forms/CreateDescription";
import TagSelector from "@/app/components/Forms/TagSelector";
import { LINKS_HOME } from "@/constants";
import { useRef } from "react";
// import PreviewModal from "@/app/components/Modal/PreviewModal";
import { TAGS } from "@/constants";
import { parseJwt } from "@/lib/parseJwt";
import { QuestionCard } from "@/app/components/QuestionCard/QuestionCard";
import { DescriptionCard } from "@/app/components/QuestionCard/DescriptionCard";
import { QuestionWithUserAndTags } from "@/types";
import { useParams } from "next/navigation";

export default function QuestionPut({ }) {
    const params = useParams();
    const questionId = params.id as string;

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

    useEffect(() => {
        if (!questionId) return;

        const fetchQuestion = async () => {
            const response = await fetch(`/api/questions/${questionId}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            const data = await response.json();
            setTitle(data.title);
            setDescription(data.description);
            setTags(data.tagIds);
        }
        fetchQuestion();
        console.log(tags)
    }, [questionId]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const isDraft = isDrafrRef.current;

        setIsLoading(true);
        try {
            const response = await fetch("/api/questions", {
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

    // const previewQuestion: QuestionWithUserAndTags = {
    //     id: parseInt(questionId),
    //     title,
    //     description,
    //     createdAt: new Date(),
    //     isDraft: false,
    //     userId: payload?.userId || 0,
    //     bestAnswerId: null,
    //     user: {
    //         username: payload?.username || "未ログインユーザー",
    //     },
    //     questionTags: tags.map((tagId) => ({ questionId: parseInt(questionId), tagId })),
    // };

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
                    <TagSelector onChange={setTags} tags={tags} />
                    <div className={styles.buttonContainer}>
                        <div className={styles.buttonSection}>
                            <button
                                className={styles.button}
                                name="action"
                                value="draft"
                                type="submit"
                                disabled={isLoading}
                                onClick={() => isDrafrRef.current = true}
                            >
                                下書き保存
                            </button>
                            <button
                                className={styles.button}
                                type="button"
                                disabled={isLoading}
                                onClick={() => setIsPreviewOpen(true)}>
                                preview
                            </button>
                        </div>

                        <button
                            className={styles.button}
                            name="action"
                            value="publish"
                            type="submit"
                            disabled={isLoading}
                            onClick={() => isDrafrRef.current = false}
                        >
                            投稿
                        </button>
                    </div>
                </form>
            </div>

            {isPreviewOpen && (
                <div className={styles.modalOverlay}
                    onClick={() => setIsPreviewOpen(false)}
                >
                    <div className={styles.previewContainer}
                        onClick={(e) => e.stopPropagation()}>
                        {/* <QuestionCard question={previewQuestion} />
                        <DescriptionCard question={previewQuestion} /> */}
                        <form onSubmit={handleSubmit}>
                            <div className={styles.buttonContainer}>
                                <div className={styles.buttonSection}>
                                    <button
                                        className={styles.button}
                                        name="action"
                                        value="draft"
                                        type="submit"
                                        disabled={isLoading}
                                        onClick={() => isDrafrRef.current = true}
                                    >
                                        下書き保存
                                    </button>
                                    <button
                                        className={styles.button}
                                        type="button"
                                        disabled={isLoading}
                                        onClick={() => setIsPreviewOpen(false)}>
                                        戻る
                                    </button>
                                </div>

                                <button
                                    className={styles.button}
                                    name="action"
                                    value="publish"
                                    type="submit"
                                    disabled={isLoading}
                                    onClick={() => isDrafrRef.current = false}
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
