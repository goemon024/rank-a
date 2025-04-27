import prisma from "@/lib/prisma"
import { NextResponse, NextRequest } from "next/server"

export async function GET(
    request: Request,
    { params }: { params: { questionId: string } }
) {
    try {
        // const { params } = await contextPromise
        const { questionId } = await Promise.resolve(params)
        // parseInt(params.questionId, 10)

        if (isNaN(parseInt(questionId, 10))) {
            return NextResponse.json({ error: "Invalid question ID" }, { status: 404 })
        }

        const question = await prisma.question.findUnique({
            where: {
                id: parseInt(questionId, 10),
            },
            include: {
                user: {
                    select: {
                        username: true,
                    },
                },
                questionTags: true,
            },
        })

        if (!question) {
            return NextResponse.json({ error: "Question not found" }, { status: 404 })
        }

        return NextResponse.json(question, { status: 200 })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
