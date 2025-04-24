'use client'

import React from 'react'
import styles from './QuestionCard.module.css'
import { Question } from '@prisma/client'
import { UserIconButton } from '../UserIconButton/UserIconButton'

// const dummyData = {
//     title: "タイトル",
//     userId: "userName",
//     createdAt: "2021-01-01",
//     tags: ["tag1", "tag2", "tag3"]
// }

export const QuestionCard = ({ question }: { question: Question }) => {
    return (
        <div className={styles.questionCard}>
            <h2>{question.title}</h2>
            <div className={styles.autherInfo}>
                <UserIconButton userId={question.userId} />
                <div className={styles.autherInfoText}>
                    <p>{question.userId}</p>
                    <p>{question.createdAt.toLocaleString()}</p>
                </div>
            </div>
            {/* <p>{question.tags}</p> */}
        </div>
    )
}
