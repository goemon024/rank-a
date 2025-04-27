'use client'

import React, { useEffect, useState } from 'react'
import styles from './question-detail.module.css'
import { Header } from '@/app/components/Header/Header'
import { QuestionCard } from '@/app/components/QuestionCard/QuestionCard'
import { QuestionWithUserAndTags } from '@/types'
import { LINKS_HOME } from '@/constants'
import { useParams } from 'next/navigation'

export default function QuestionDetail() {
    const params = useParams()
    const { questionId } = params as { questionId: string }

    const [question, setQuestion] = useState<QuestionWithUserAndTags | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchQuestion = async () => {
            try {
                const res = await fetch(`/api/questions/${questionId}`)
                const question = await res.json() as QuestionWithUserAndTags
                setQuestion(question)
            } catch (error) {
                setError(error as string)
            } finally {
                setLoading(false)
            }
        }
        fetchQuestion()
    }, [questionId])

    if (loading) return <div>Loading...</div>
    if (error) return <div>Error: {error}</div>
    if (!question) return <div>Question not found</div>

    return (
        <div>
            <Header links={LINKS_HOME} />
            <div className={styles.container}>

                <QuestionCard question={question} />
                <p>{question.description}</p>
            </div>
        </div>
    )
}