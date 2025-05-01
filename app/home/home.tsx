'use client'

import styles from './home.module.css'
import { Header } from '@/app/components/Header/Header'
import { QuestionArea } from '../components/QuestionArea/QuestionArea'
import SorterFilter from '../components/SorterFilter/SorterFilter'
import { Pagination } from '../components/pagination/pagination'
import PostButton from '../components/Button/PostButton'
import { LINKS_HOME } from '@/constants'

interface HomeProps {
    questions: any[]
    currentPage: number
    totalPages: number
    keyword: string
}

export default function Home({
    questions, currentPage, totalPages, keyword
}: HomeProps) {
    return (
        <div>
            <div>
                <Header links={LINKS_HOME} />
            </div>
            <div className={styles.main}>
                <QuestionArea questions={questions} />
                <SorterFilter />
            </div>
            <Pagination currentPage={currentPage} totalPages={totalPages} keyword={keyword} />
            <div>
                <PostButton />
            </div>
        </div>
    )
}