import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

export async function POST(req: NextRequest) {

    const questionsAll = await prisma.question.findMany({
        where: { isDraft: false },
        select: { id: true },
    });
    const questionIds = questionsAll.map(q => q.id);

    // 全questionに紐づくanswerの合計
    const answerCounts = await Promise.all(
        questionIds.map(q => prisma.answer.count({
            where: { questionId: q },
        })
        ))

    const commentCounts = await Promise.all(
        questionIds.map(q => prisma.comment.count({
            where: { questionId: q },
        })
        ))

    // 合計値;
    console.log("################")
    const sum = answerCounts.reduce((acc, curr) => acc + curr, 0);
    const sum2 = commentCounts.reduce((acc, curr) => acc + curr, 0);
    console.log(commentCounts);
}

