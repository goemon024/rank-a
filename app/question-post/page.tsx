'use client'

import React, { useState, useEffect } from 'react'
import { Header } from '@/app/components/Header/Header'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import styles from './question-post.module.css'
import CreateTitle from '@/app/components/Forms/CreateTitle'
import CreateDescription from '@/app/components/Forms/CreateDescription'
import TagSelector from '@/app/components/Forms/TagSelector'

export default function QuestionPost() {
    const { user, isAuthenticated } = useAuth()
    const router = useRouter()

    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [tags, setTags] = useState<number[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/home')
        }
    }, [isAuthenticated, router])

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(tags);

        setIsLoading(true);
        try {
            const response = await fetch("/api/questions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('token') || ""}`
                },
                body: JSON.stringify({
                    title,
                    description,
                    isDraft: false,
                    tags
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



    return (

        <div>
            <Header items={[]} />
            <div className={styles.container}>
                <h2 className={styles.title}>質問を投稿</h2>
                <form className={styles.form} onSubmit={handleSubmit}>
                    <CreateTitle title={title} setTitle={setTitle} />
                    <CreateDescription description={description} setDescription={setDescription} />
                    <TagSelector onChange={setTags} />
                    <div className={styles.buttonContainer}>
                        <button className={styles.button} type="submit" disabled={isLoading}>
                            投稿
                        </button>
                    </div>
                </form>
            </div>
        </div>

    )
}
