// components/Pagination.tsx
'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import styles from './pagination.module.css'
interface PaginationProps {
    currentPage: number
    totalPages: number
    keyword?: string
}

export const Pagination = ({ currentPage, totalPages, keyword = '' }: PaginationProps) => {
    const router = useRouter()
    const searchParams = useSearchParams()

    const goToPage = (page: number) => {
        const params = new URLSearchParams(searchParams.toString())
        params.set('page', page.toString())
        if (keyword) params.set('keyword', keyword)
        router.push(`/home?${params.toString()}`)
    }

    if (totalPages <= 1) return null

    return (
        <div className={styles.pagination}>
            <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
            >
                前へ
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                    key={page}
                    onClick={() => goToPage(page)}
                    style={{ fontWeight: page === currentPage ? 'bold' : 'normal' }}
                >
                    {page}
                </button>
            ))}

            <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
            >
                次へ
            </button>
        </div>
    )
}
