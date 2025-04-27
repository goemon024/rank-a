'use client'

import React from 'react'
import styles from './QuestionArea.module.css'
import { QuestionCard } from '@/app/components/QuestionCard/QuestionCard'
import { QuestionWithUserAndTags } from '@/types'


export const QuestionArea = ({ questions }:
    { questions: QuestionWithUserAndTags[] }) => {
    return (
        <div className={styles.questionArea}>
            {questions.map(question => (
                <QuestionCard key={question.id} question={question} />
            ))}
        </div>
    )
}

