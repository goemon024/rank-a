import prisma from "@/lib/prisma";

export async function POST() {
    const questionsAll = await prisma.question.findMany({
        where: { isDraft: false },
        select: { id: true },
    });
    const questionIds = questionsAll.map((q) => q.id);

    // 全questionに紐づくanswerの合計
    const answerCounts = await Promise.all(
        questionIds.map((q) =>
            prisma.answer.count({
                where: { questionId: q },
            }),
        ),
    );

    const commentCounts = await Promise.all(
        questionIds.map((q) =>
            prisma.comment.count({
                where: { questionId: q },
            }),
        ),
    );

    //eslint-disable-next-line no-console
    console.log(answerCounts);
    //eslint-disable-next-line no-console
    console.log(commentCounts);

    // 合計値;
    //   console.log("################");
    //   const sum = answerCounts.reduce((acc, curr) => acc + curr, 0);
    //   const sum2 = commentCounts.reduce((acc, curr) => acc + curr, 0);
    //   console.log(commentCounts);
}
