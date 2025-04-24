// import { Suspense } from 'react'
// import Link from 'next/link'
// import styles from './page.module.css'

import Home from './home'

export default async function Page(
    { searchParams }:
        {
            searchParams: {
                page?: string,
                limit?: string,
                keyword?: string
            }
        }
) {
    const params = await searchParams
    const page = params.page ?? '1'
    const limit = params.limit ?? '10'
    const keyword = params.keyword ?? ''

    return (
        <Home searchParams={{ page, limit, keyword }} />
    )
}