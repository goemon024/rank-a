// import { notFound } from 'next/navigation'
// import { getUserById } from '@/lib/api'
// import { Header } from '@/app/components/Header/Header'
// interface PageProps {
//   params: Promise<{
//     id: string
//   }>
// }

// const ProfilePage = async ({ params }: PageProps) => {
//   // paramsを非同期で扱う(非推奨な手法)
//   const id = (await params).id

//   // UUID形式の簡易チェック（安全強化）
//   const isValidUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(id)
//   if (!isValidUuid) return notFound()

//   const user = await getUserById(id)
//   if (!user) return notFound()

'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Header } from '@/app/components/Header/Header'
import { User } from '@prisma/client'

// type User = {
//   id: string
//   username: string
//   email: string
//   imagePath: string
//   createdAt: string
// }

const items = [
  { label: '投稿質問一覧', href: '/home' },
  { label: '投稿回答一覧', href: '/home/popular' },
]

export default function ProfilePage() {
  const params = useParams()
  const userId = params.id as string
  const [user, setUser] = useState<User | null>(null)

  // const [loading, setLoading] = useState(true)
  // const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token')
        const res = await fetch(`/api/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!res.ok) {
          const data = await res.json()
          throw new Error(data.error || 'ユーザー情報の取得に失敗しました')
        }

        const data = await res.json()
        setUser(data)
      } catch (err: any) {
        // setError(err.message)
      } finally {
        // setLoading(false)
      }
    }

    fetchUser()
  }, [userId])


  return (
    <div>
      <Header items={items} />
      <div style={{ padding: '1rem' }}>
        <h1>{user?.username} さんのプロフィール</h1>
        <p>Email: {user?.email}</p>
        {user?.imagePath && (
          <img
            src={user?.imagePath}
            alt={`${user?.username}のプロフィール画像`}
            style={{ width: '120px', borderRadius: '50%' }}
          />
        )}
        {user?.createdAt && (
          <p>登録日: {new Date(user.createdAt).toLocaleDateString()}</p>
        )}
      </div>
    </div>
  )
}




// <div>
//   <main className={styles.container}>
//   <div className={styles.profileContainer}>
//     <h1 className={styles.profileTitle}>Profile</h1>
//     <div className={`${styles.profileContainer} ${styles.flexContainer}`}>
//       {/* <ProfileImage userName={userProfile?.username ?? ""} presetImage={userProfile?.image_path ?? null} /> */}

//       <div className={styles.profileInfo}>
//         <p>{userProfile?.username}</p>
//         <p>{userProfile?.email ?? ""}</p>
//       </div>
//     </div>
//   </div>
// </div>
