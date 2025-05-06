"use client";

import React, { useEffect, useState } from 'react'

import { parseJwt } from '@/lib/parseJwt';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { Header } from '@/app/components/Header/Header';
import { getLinksProfile } from '@/constants/index';
import styles from './UserAnswers.module.css';
import Link from 'next/link';
import { AnswerWithUserAndQuestion } from '@/types';
import dayjs from 'dayjs';

export default function UserCommentsPage() {
    const params = useParams();
    const userId = parseInt(params.id as string);
    const [answers, setAnswers] = useState<AnswerWithUserAndQuestion[]>([]);
    const router = useRouter();
    const [username, setUsername] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const links = getLinksProfile(params.id as string);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const payload = token ? parseJwt(token) : null;
        const userIdFromToken = payload?.userId;
        setUsername(payload?.username);


        if (userIdFromToken !== userId) {
            alert("不正なアクセスです");
            router.push("/");
            return;
        }

        const fetchComments = async () => {
            setIsLoading(true);
            const res = await fetch(`/api/answers?userId=${userId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            const data = await res.json();
            setAnswers(data.answer);
            setIsLoading(false);
        };
        fetchComments();
    }, []);

    return (
        <div>
            <div>
                <Header links={links} />
            </div>
            <div className={styles.questionArea}>
                <h2>{username} さんの回答履歴</h2>
                {isLoading ? (
                    <p>読み込み中...</p>
                ) : answers.length === 0 ? (
                    <p>回答はありません。</p>
                ) : (
                    answers.map((a: AnswerWithUserAndQuestion) => (
                        <Link key={a.id} href={`/question-detail/${a.questionId}`}>
                            <div key={a.id} className={styles.answerCard}>
                                <p className={styles.answerQuestionTitle}>（{a.question.title}）</p>
                                <p className={styles.answerContent}>{a.content}</p>
                                <p className={styles.answerTime}>{dayjs(a.createdAt).format('YYYY/MM/DD HH:mm')}</p>

                            </div>
                        </Link>
                    ))
                )}
            </div>
        </div>
    );
}
