import { notFound } from 'next/navigation'
import { getUserById } from '@/lib/api' // ↓次に定義する関数

interface PageProps {
  params: {
    id: string
  }
}

const ProfilePage = async ({ params }: PageProps) => {
  const id = params.id

  // UUID形式の簡易チェック（安全強化）
  const isValidUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(id)
  if (!isValidUuid) return notFound()

  const user = await getUserById(id)
  if (!user) return notFound()

  return (
    <div style={{ padding: '1rem' }}>
      <h1>{user.username} さんのプロフィール</h1>
      <p>Email: {user.email}</p>
      {user.imagePath && (
        <img
          src={user.imagePath}
          alt={`${user.username}のプロフィール画像`}
          style={{ width: '120px', borderRadius: '50%' }}
        />
      )}
      <p>登録日: {new Date(user.createdAt).toLocaleDateString()}</p>
    </div>
  )
}

export default ProfilePage




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
