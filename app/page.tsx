// import { Suspense } from 'react'
// import Link from 'next/link'
// import styles from './page.module.css'

// import { useRouter } from 'next/navigation'

// export default function Page() {
//   const router = useRouter()
//   router.push('/home')
//   return (
//     <div>
//       <h1>Hello</h1>
//     </div>
//   )
// }

// // app/page.tsx
import { redirect } from 'next/navigation'

export default function RootRedirect() {
  redirect('/home') // ← これだけでOK！
}