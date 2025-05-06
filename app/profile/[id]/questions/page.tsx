"use client";

import React, { useEffect, useState } from 'react'

import { parseJwt } from '@/lib/parseJwt';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { Header } from '@/app/components/Header/Header';
import { getLinksProfile } from '@/constants/index';
import styles from './UserQuestions.module.css';
import Link from 'next/link';
import { QuestionWithUserAndTags } from '@/types';
import dayjs from 'dayjs';

export default function UserCommentsPage() {
    const params = useParams();
    const userId = parseInt(params.id as string);
    const [questions, setQuestions] = useState<QuestionWithUserAndTags[]>([]);
    const router = useRouter();
    const [username, setUsername] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const links = getLinksProfile(params.id as string);

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
            setIsLoading(true);
            const res = await fetch(`/api/questions?userId=${userId}&limit=50`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            const data = await res.json();
            setQuestions(data.questions);
            setIsLoading(false);
        };
        fetchQuestions();
    }, []);

    return (
        <div>
            <div>
                <Header links={links} />
            </div>
            <div className={styles.questionArea}>
                <h2>{username} さんの質問履歴（直近100件までの表示）</h2>
                {isLoading ? (
                    <p>読み込み中...</p>
                ) : questions.length === 0 ? (
                    <p>コメントはありません。</p>
                ) : (
                    questions.map((q: QuestionWithUserAndTags) => (
                        <Link key={q.id} href={`/question-detail/${q.id}`}>
                            <div key={q.id} className={styles.questionCard}>
                                <p className={styles.questionTitle}>{q.title}</p>
                                <p className={styles.questionDescription}>{q.description}</p>
                                <p className={styles.questionTime}>{dayjs(q.createdAt).format('YYYY/MM/DD HH:mm')}</p>
                            </div>
                        </Link>
                    ))
                )}
            </div>
        </div>
    );
}
