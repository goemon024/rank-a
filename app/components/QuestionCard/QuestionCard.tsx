'use client'

import React from 'react'
import styles from './QuestionCard.module.css'
import { Question } from '@prisma/client'
import { UserIconButton } from '../UserIconButton/UserIconButton'
import { Stack, Chip } from '@mui/material'

const TAGS = ["Python", "SQL", "React", "Next.js", "Prisma",
    "TypeScript", "CSS", "HTML",
    "Node.js", "Express", "Django", "Vue",
    "Svelte", "Ruby", "Java"]

export const QuestionCard = ({ question }:
    { question: Question }) => {
    return (
        <div className={styles.questionCard}>
            <h2>{question.title}</h2>

            {/* --- タグを表示するエリア --- */}
            {/* <Stack direction="row" spacing={1} flexWrap="wrap" marginBottom={1}>
                {question.tags.map((tagIndex) => (
                    <Chip
                        key={tagIndex}
                        label={TAGS[tagIndex]}
                        size="small"
                        sx={{
                            fontSize: '0.8rem',
                            padding: '2px 4px',
                            bgcolor: 'grey.300',
                            color: 'black',
                        }}
                    />
                ))}
            </Stack> */}
            {/* --- ここまでタグ表示エリア --- */}

            <div className={styles.autherInfo}>
                <UserIconButton userId={question.userId} />
                <div className={styles.autherInfoText}>
                    <p>{question.userId}</p>
                    <p>{question.createdAt.toLocaleString()}</p>
                </div>
            </div>
        </div>
    )
}
