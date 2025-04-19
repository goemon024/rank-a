// /app/api/auth/[...nextauth]/route.ts

import NextAuth from 'next-auth'
import { SessionStrategy } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import prisma from '@/app/lib/prisma'
import bcrypt from 'bcrypt'

export const authOptions = {
    adapter: PrismaAdapter(prisma),
    session: {
        strategy: 'jwt' as SessionStrategy,
    },
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                identifier: { label: 'Username or Email', type: 'text' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials: { identifier: string, password: string } | undefined) {
                if (!credentials) throw new Error('入力値がありません')

                const user = await prisma.user.findFirst({
                    where: {
                        OR: [
                            { email: credentials.identifier },
                            { username: credentials.identifier }
                        ]
                    }
                })

                if (!user || !user.passwordHash) throw new Error('ユーザーが見つかりません')

                const isValid = await bcrypt.compare(credentials.password, user.passwordHash)
                if (!isValid) throw new Error('パスワードが違います')

                return user
            }
        })
    ],
    secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }