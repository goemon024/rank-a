// POST /api/register
import prisma from '@/app/lib/prisma'
import bcrypt from 'bcrypt'
import { verifyCaptcha } from '@/app/utils/verifyCaptcha'
import { sanitizeInput } from '@/app/utils/sanitize'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {

    try {
        const { username, email, password } = await req.json()
        const sanitizedUsername = sanitizeInput(username)
        const sanitizedEmail = sanitizeInput(email)
        const recaptchaToken = req.headers.get('x-recaptcha-token')

        //zodスキーマを使う
        if (!sanitizedUsername || !sanitizedEmail || !password) {
            return NextResponse.json(
                { error: '全ての項目を入力してください' }, { status: 400 }
            )
        }

        if (!recaptchaToken) {
            return NextResponse.json(
                { error: 'reCAPTCHAトークンが提供されていません' }, { status: 400 }
            )
        }

        const isHuman = await verifyCaptcha(recaptchaToken)
        if (!isHuman) {
            return NextResponse.json(
                { error: 'ロボット判定されました（サイトを更新してください）' },
                { status: 400 }
            )
        }

        // すでに登録されていないか確認
        const existingEmail = await prisma.user.findUnique({
            where: { email: sanitizedEmail },
        })
        if (existingEmail) {
            return NextResponse.json(
                { error: 'Emailが既に存在しています' }, { status: 400 }
            )
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await prisma.user.create({
            data: {
                username: sanitizedUsername,
                email: sanitizedEmail,
                passwordHash: hashedPassword,
            },
        })

        return NextResponse.json({ success: true, user }, { status: 201 })

    } catch (error: any) {
        console.error('Register error:', error)
        return NextResponse.json(
            { error: 'ユーザー登録に失敗しました', message: error?.message },
            { status: 500 })
    }
}