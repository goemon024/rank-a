'use client'

import React from 'react'
import styles from './QuestionArea.module.css'
import { QuestionCard } from '@/app/components/QuestionCard/QuestionCard'
import { Question, QuestionTag } from '@prisma/client'


export const QuestionArea = ({ questions, questionTags }:
    { questions: Question[], questionTags: QuestionTag[] }) => {
    return (
        <div className={styles.questionArea}>
            {questions.map(question => (
                <QuestionCard key={question.id} question={question} />
            ))}
        </div>
    )
}

