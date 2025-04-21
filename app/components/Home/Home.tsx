'use client'

import Link from 'next/link'
import { Suspense } from 'react'
import styles from './Home.module.css'

// import SearchBar from './SearchBar'
// import QuestionList from './QuestionList'
// import Sidebar from './Sidebar'
// import Pagination from './Pagination'
// import FloatingButton from './FloatingButton'
import NavigationMenu from '../NavigationMenu/NavigationMenu'
import { Header } from '../Header/Header'
const items = [
    { label: '新着質問一覧', href: '/home' },
    { label: '人気質問一覧', href: '/home/popular' },
]

export default function Home() {
    return (
        <div>
            <div>
                <Header />
                <NavigationMenu items={items} />
            </div>

            <div className={styles.container}>
                <main className={styles.main}>
                    <h1 className={styles.title}>
                        プログラミング質問掲示板へようこそ！
                    </h1>

                    <p className={styles.description}>
                        プログラミングの質問や回答を共有しよう
                    </p>

                    <div className={styles.grid}>
                        <Link href="/questions" className={styles.card}>
                            <h2>質問一覧 &rarr;</h2>
                            <p>みんなの質問を見てみよう</p>
                        </Link>

                        <Link href="/questions/ask" className={styles.card}>
                            <h2>質問する &rarr;</h2>
                            <p>困っていることを質問してみよう</p>
                        </Link>

                        <Link href="/signup" className={styles.card}>
                            <h2>新規登録 &rarr;</h2>
                            <p>アカウントを作成して参加しよう</p>
                        </Link>

                        <Link href="/signin" className={styles.card}>
                            <h2>ログイン &rarr;</h2>
                            <p>既存のアカウントでログイン</p>
                        </Link>
                    </div>

                    <Suspense fallback={<p>Loading recent questions...</p>}>
                        <div className={styles.recentQuestions}>
                            <h2>最近の質問</h2>
                            {/* ここに最近の質問リストコンポーネントを追加 */}
                        </div>
                    </Suspense>
                </main>

                <footer className={styles.footer}>
                    <p>プログラミング質問掲示板 &copy; 2024</p>
                </footer>
            </div>
        </div>


    )
}