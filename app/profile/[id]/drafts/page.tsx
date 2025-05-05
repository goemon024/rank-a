"use client";

import React, { useEffect, useState } from 'react'
import { QuestionCard } from '@/app/components/QuestionCard/QuestionCard';
import { QuestionWithUserAndTags } from '@/types';
import { parseJwt } from '@/lib/parseJwt';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { Header } from '@/app/components/Header/Header';
import { LINKS_HOME } from '@/constants/index';
import styles from './drafts.module.css';
import Link from 'next/link';

export default function DraftPage() {
    const params = useParams();
    const userId = parseInt(params.id as string);
    const [questions, setQuestions] = useState<QuestionWithUserAndTags[]>([]);
    const router = useRouter();
    const [username, setUsername] = useState<string | null>(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const payload = token ? parseJwt(token) : null;
        const userIdFromToken = payload?.userId;
        // const username = payload?.username;
        setUsername(payload?.username);

        console.log("userIdFromToken", userIdFromToken);
        console.log(userIdFromToken, userId);

        if (userIdFromToken !== userId) {
            alert("不正なアクセスです");
            router.push("/");
            return;
        }

        const fetchQuestions = async () => {
            const res = await fetch(`/api/questions?isDraft=true&userId=${userId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            const data = await res.json();
            setQuestions(data.questions);
        };
        fetchQuestions();
    }, []);

    return (
        <div>
            <div>
                <Header links={LINKS_HOME} />
            </div>
            <div className={styles.questionArea}>
                <h2>{username} さんの下書き一覧</h2>
                {questions.length === 0 ? (
                    <p>下書きはまだありません。</p>
                ) : (
                    questions.map((q: QuestionWithUserAndTags) => (
                        <Link key={q.id} href={`/question-post/${q.id}`}>
                            <div key={q.id} className={styles.questionCard}>
                                <p>タイトル:{q.title}</p>
                                <p>内容:{q.description}</p>
                            </div>
                        </Link>
                    ))
                )}
            </div>
        </div>
    );
}
