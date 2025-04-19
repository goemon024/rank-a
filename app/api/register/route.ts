// POST /api/register
import prisma from '@/app/lib/prisma'
import bcrypt from 'bcrypt'

export async function POST(req: Request) {
    console.log('Register API called')
    try {
        console.log('Request received')
        const { username, email, password } = await req.json()

        if (!username || !email || !password) {
            return new Response(JSON.stringify({ error: '全ての項目を入力してください' }), { status: 400 })
        }

        const hashedPassword = await bcrypt.hash(password, 10)


        const user = await prisma.user.create({
            data: {
                username,
                email,
                passwordHash: hashedPassword,
            },
        })

        return new Response(JSON.stringify({ success: true, user }), { status: 201 })
    } catch (error: any) {
        console.error('Register error:', error)
        return new Response(JSON.stringify({
            error: 'ユーザー登録に失敗しました',
            message: error?.message
        }), {
            status: 500
        })
    }
}