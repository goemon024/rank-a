'use client'

import React from 'react'
import styles from './PostButton.module.css'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'

const PostButton = () => {
    const { isAuthenticated } = useAuth()
    return (
        <div className={styles.postButton}>
            <Link href="/question-post">
                <button className={styles.postButton}
                    disabled={!isAuthenticated}>質問を投稿する</button>
            </Link>
        </div>
    )
}

export default PostButton

