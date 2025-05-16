'use client';

import { useState, useEffect } from 'react';
import styles from './Button.module.css';
import { UserBookmarks } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

type Props = {
    questionId: number;
    bookmark?: UserBookmarks;
};

export default function BookmarkButton({ questionId, bookmark }: Props) {
    const [isBookmarked, setIsBookmarked] = useState<boolean>(bookmark?.bookmarkId ? true : false);
    const [loading, setLoading] = useState(false);
    const { user: authUser } = useAuth();

    useEffect(() => {
        console.log("bookmark", bookmark)
    }, [])

    const toggleBookmark = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setLoading(true);

        try {
            setIsBookmarked(!isBookmarked);
            const res = await fetch('/api/bookmarks', {
                method: isBookmarked ? 'DELETE' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
                },
                body: JSON.stringify({
                    questionId: questionId,
                    userId: authUser?.userId
                }),
            });

            if (!res.ok) {
                setIsBookmarked(isBookmarked);
                throw new Error('ブックマーク処理に失敗しました');
            }

            // setIsBookmarked(!isBookmarked);
        } catch (err) {
            console.error(err);
            // eslint-disable-next-line no-alert
            console.log('ブックマークに失敗しました');
            setIsBookmarked(isBookmarked);
        } finally {
            setLoading(false);
        }
    };

    // ログインしていない場合はボタンを表示しない
    if (!authUser) return null;

    return (
        <button onClick={toggleBookmark}
            disabled={loading} aria-label="ブックマーク"
            className={isBookmarked ? styles.bookmark : styles.unbookmark}>
            {isBookmarked ? '★ ブックマーク済み' : 'ブックマーク'}
        </button >
    );
}
