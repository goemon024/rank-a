import prisma from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'


export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url)

        const page = parseInt(searchParams.get('page') || '1', 10)
        const limit = parseInt(searchParams.get('limit') || '10', 10)
        const keyword = searchParams.get('keyword') || ''

        if (page < 1 || limit < 1 || limit > 100) {
            return NextResponse.json(
                { error: 'Invalid pagination parameters' },
                { status: 400 }
            )
        }

        const skip = (page - 1) * limit

        const whereClause = keyword
            ? {
                title: {
                    contains: keyword,
                    mode: 'insensitive' as const,
                },
            }
            : {}

        const [questions, totalCount] = await Promise.all([
            prisma.question.findMany({
                where: whereClause,
                include: {
                    user: true,
                    tags: true,
                },
                skip,
                take: limit,
                orderBy: {
                    createdAt: 'desc',
                },
            }),
            prisma.question.count({
                where: whereClause,
            })
        ])

        return NextResponse.json({ questions, totalCount }, { status: 200 })
    } catch (err) {
        console.error('Error fetching questions:', err)
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        )
    }
}




const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_key' // .envで設定しておく

export async function POST(req: NextRequest) {
    const authHeader = req.headers.get('authorization')

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.split(' ')[1]

    let payload
    try {
        payload = jwt.verify(token, JWT_SECRET) as { userId: string }
    } catch (err) {
        return NextResponse.json({ error: 'Invalid token' }, { status: 400 }) // 403
    }

    const body = await req.json()
    const { title, description, isDraft, tags } = body

    if (!title || !description) {
        return NextResponse.json({ error: 'title and description are required' }, { status: 400 })
    }

    try {
        const question = await prisma.question.create({
            data: {
                title,
                description,
                userId: payload.userId,
                isDraft,
                tags: {
                    connect: tags.map((tagId: number) => ({ id: tagId })),
                },
            },
            include: { tags: true },
        })

        return NextResponse.json({ success: true, question }, { status: 201 })
    } catch (error) {
        console.error('DB error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}