import styles from './home.module.css'

import { Header } from '@/app/components/Header/Header'
import { QuestionArea } from '../components/QuestionArea/QuestionArea'
import SorterFilter from '../components/SorterFilter/SorterFilter'
import { Pagination } from '../components/pagination/pagination'
import { headers } from 'next/headers'
import PostButton from '../components/PostButton/PostButton'

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000'

const items = [
    { label: '新着質問一覧', href: '/home' },
    { label: '人気質問一覧', href: '/home/popular' },
]

interface PageProps {
    searchParams: {
        page?: string
        limit?: string
        keyword?: string
    }
}

export default async function Home({ searchParams = {} }: PageProps) {

    const queryParams = new URLSearchParams({
        page: searchParams.page || '1',
        limit: searchParams.limit || '10',
        keyword: searchParams.keyword || ''
    }).toString()

    const res = await fetch(
        `${BASE_URL}/api/questions?${queryParams}`,
        {
            cache: 'no-store',
            headers: await headers(),
        }
    )

    if (!res.ok) {
        throw new Error('質問データの取得に失敗しました')
    }

    const data = await res.json()
    const questions = data.questions
    const totalCount = data.totalCount

    return (
        <div>
            <div>
                <Header items={items} />
            </div>
            <div className={styles.main}>
                <QuestionArea questions={questions} />
                <SorterFilter />
            </div>
            <Pagination currentPage={1} totalPages={Math.ceil(totalCount / 10)} />
            <div>
                <PostButton />
            </div>
        </div>
    )
}