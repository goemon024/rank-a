import prisma from "@/lib/prisma";

export async function POST() {
    // 1. isDraftがfalseのquestionIDを取得
    const questionsAll = await prisma.question.findMany({
        where: { isDraft: false },
        select: {
            id: true,
        },
    });
    const questionIds = questionsAll.map((q) => q.id);

    // 2．questionに紐づくanswer件数
    const answerNewCounts = await Promise.all(
        questionIds.map((q) =>
            prisma.answer.count({
                where: { questionId: q },
            }),
        ),
    );

    // 3. 各questionのanswerNewCountをupdate
    await Promise.all(
        questionIds.map((qId, idx) =>
            prisma.question.update({
                where: { id: qId },
                data: { answerCount: answerNewCounts[idx] },
            })
        )
    );

    // 4. 各questionのupvoteCountをupdate
    for (const qId of questionIds) {
        const answers = await prisma.answer.findMany({
            where: { questionId: qId },
            select: { id: true },
        });
        const answerIds = answers.map(a => a.id);

        // 各answerごとにupvote数を集計し、合計を計算
        let totalUpvotes = 0;
        if (answerIds.length > 0) {
            // voteテーブルの構造によってはtype: 'upvote'の条件を追加
            totalUpvotes = await prisma.vote.count({
                where: {
                    answerId: { in: answerIds },
                    type: 'Upvote', // もしtypeがある場合
                },
            });
        }

        await prisma.question.update({
            where: { id: qId },
            data: { upvoteCount: totalUpvotes },
        });

        // 5. 各questionのscoreをupdate（upvoteCount + answerCount * 2）
        // answerCountはすでに更新済みなのでDBから取得
        const question = await prisma.question.findUnique({
            where: { id: qId },
            select: { upvoteCount: true, answerCount: true },
        });
        const score = (question?.upvoteCount ?? 0) + (question?.answerCount ?? 0) * 2;
        await prisma.question.update({
            where: { id: qId },
            data: {
                score: score,
            },
        });
    }


    // const commentCounts = await Promise.all(
    //     questionIds.map((q) =>
    //         prisma.comment.count({
    //             where: { questionId: q },
    //         }),
    //     ),
    // );

    //eslint-disable-next-line no-console
    // console.log(answerCounts);
    //eslint-disable-next-line no-console
    // console.log(commentCounts);

    // 合計値;
    //   console.log("################");
    //   const sum = answerCounts.reduce((acc, curr) => acc + curr, 0);
    //   const sum2 = commentCounts.reduce((acc, curr) => acc + curr, 0);
    //   console.log(commentCounts);
}
