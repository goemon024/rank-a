// // /app/api/auth/[...nextauth]/route.ts

// import NextAuth from 'next-auth'
// import { SessionStrategy } from 'next-auth'
// import CredentialsProvider from 'next-auth/providers/credentials'
// import { PrismaAdapter } from '@next-auth/prisma-adapter'
// import prisma from '@/lib/prisma'
// import bcrypt from 'bcrypt'
// import { sanitizeInput } from '@/utils/sanitize'

// // ログイン試行回数を追跡するための簡易的なメモリストア
// const loginAttempts = new Map<string, { count: number; lastAttempt: number }>()

// // ログイン試行をチェックする関数
// async function checkLoginAttempts(identifier: string): Promise<boolean> {
//     const now = Date.now()
//     const attempt = loginAttempts.get(identifier)

//     // 15秒でリセット
//     if (attempt && now - attempt.lastAttempt > 15 * 1000) {
//         loginAttempts.delete(identifier)
//         return true
//     }

//     // 3回以上の試行でブロック
//     if (attempt && attempt.count >= 3) {
//         return false
//     }

//     // 試行回数を更新
//     loginAttempts.set(identifier, {
//         count: (attempt?.count || 0) + 1,
//         lastAttempt: now
//     })

//     return true
// }

// export const authOptions = {
//     adapter: PrismaAdapter(prisma),
//     session: {
//         strategy: 'jwt' as SessionStrategy,
//         maxAge: 24 * 60 * 60, // 24時間でセッション期限切れ
//     },
//     providers: [
//         CredentialsProvider({
//             name: 'Credentials',
//             credentials: {
//                 identifier: { label: 'Username or Email', type: 'text' },
//                 password: { label: 'Password', type: 'password' },
//             },
//             async authorize(credentials: { identifier: string, password: string } | undefined) {
//                 if (!credentials) throw new Error('入力値がありません')

//                 // ログイン試行をチェック
//                 const canAttempt = await checkLoginAttempts(credentials.identifier)
//                 if (!canAttempt) {
//                     throw new Error('ログイン試行回数が制限を超えました。15秒後に再試行してください。')
//                 }

//                 const sanitizedIdentifier = sanitizeInput(credentials.identifier)

//                 const user = await prisma.user.findFirst({
//                     where: {
//                         OR: [
//                             { email: sanitizedIdentifier },
//                             { username: sanitizedIdentifier }
//                         ]
//                     }
//                 })

//                 if (!user || !user.passwordHash) {
//                     throw new Error('ユーザーが見つかりません')
//                 }

//                 const isValid = await bcrypt.compare(credentials.password, user.passwordHash)
//                 if (!isValid) {
//                     throw new Error('パスワードが違います')
//                 }

//                 // ログイン成功時に試行回数をリセット
//                 loginAttempts.delete(credentials.identifier)

//                 return user
//             }
//         })
//     ],
//     pages: {
//         signIn: '/signin',
//         error: '/auth/error',
//     },
//     secret: process.env.NEXTAUTH_SECRET,
// }

// const handler = NextAuth(authOptions)
// export { handler as GET, handler as POST }