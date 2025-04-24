// 'use client'

// import Link from 'next/link'
// import { Suspense } from 'react'
// import styles from './Home.module.css'

// // import SearchBar from './SearchBar'
// // import QuestionList from './QuestionList'
// // import Sidebar from './Sidebar'
// // import Pagination from './Pagination'
// // import FloatingButton from './FloatingButton'
// import NavigationMenu from '../NavigationMenu/NavigationMenu'
// import { Header } from '../Header/Header'
// import { QuestionArea } from '@/app/components/QuestionArea/QuestionArea'
// import SorterFilter from '@/app/components/SorterFilter/SorterFilter'

// const items = [
//     { label: '新着質問一覧', href: '/home' },
//     { label: '人気質問一覧', href: '/home/popular' },
// ]

// export default function Home() {
//     return (
//         <div>
//             <div>
//                 <Header items={items} />
//                 <NavigationMenu items={items} />
//             </div>
//             <div>
//                 <QuestionArea />
//                 <SorterFilter />

//             </div>



//             <footer className={styles.footer}>
//                 <p>プログラミング質問掲示板 &copy; 2024</p>
//             </footer>
//         </div>


//     )
// }