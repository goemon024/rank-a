import { NextResponse, NextRequest } from "next/server"
import prisma from "@/lib/prisma"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_key' // .envで設定しておく

export async function POST(req: NextRequest) {
    const authHeader = req.headers.get('authorization')

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 400 }) //401
    }

    const token = authHeader.split(' ')[1]

    let payload
    try {
        payload = jwt.verify(token, JWT_SECRET) as { userId: number }
    } catch (err) {
        return NextResponse.json({ error: 'Invalid token' }, { status: 400 }) // 403
    }

    const body = await req.json()
    const { questionId, answerId, content } = body

    if (!questionId || !content) {
        return NextResponse.json({ error: "Answer not found" }, { status: 404 })
    }

    try {
        const comment = await prisma.comment.create({
            data: {
                questionId: parseInt(questionId, 10),
                answerId: answerId ? parseInt(answerId, 10) : null,
                userId: payload.userId,
                content: content,
            },
        })
        return NextResponse.json(comment, { status: 201 })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
