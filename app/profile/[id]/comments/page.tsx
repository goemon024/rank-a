"use client";

import React, { useEffect, useState } from 'react'

import { parseJwt } from '@/lib/parseJwt';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { Header } from '@/app/components/Header/Header';
import { getLinksProfile } from '@/constants/index';
import styles from './UserComments.module.css';
import Link from 'next/link';
import { CommentWithUser } from '@/types';
import dayjs from 'dayjs';

export default function UserCommentsPage() {
    const params = useParams();
    const userId = parseInt(params.id as string);
    const [comments, setComments] = useState<CommentWithUser[]>([]);
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

        if (userIdFromToken !== userId) {
            alert("不正なアクセスです");
            router.push("/");
            return;
        }

        const fetchComments = async () => {
            setIsLoading(true);
            const res = await fetch(`/api/comments?userId=${userId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            const data = await res.json();
            setComments(data.comment);
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
                <h2>{username} さんのコメント履歴</h2>
                {isLoading ? (
                    <p>読み込み中...</p>
                ) : comments.length === 0 ? (
                    <p>コメントはありません。</p>
                ) : (
                    comments.map((c: CommentWithUser) => (
                        <Link key={c.id} href={`/question-detail/${c.questionId}`}>
                            <div key={c.id} className={styles.commentCard}>
                                <p className={styles.commentTime}>{dayjs(c.createdAt).format('YYYY/MM/DD HH:mm')}</p>
                                <p className={styles.commentContent}>{c.content}</p>
                            </div>
                        </Link>
                    ))
                )}
            </div>
        </div>
    );
}
