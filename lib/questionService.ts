import prisma from "@/lib/prisma";

export async function getFilteredQuestions(params: {
    keyword?: string;
    tagIds?: number[];
    skip: number;
    take: number;
    orderBy: any;
}) {
    const { keyword, tagIds, skip, take, orderBy } = params;

    const whereClause: any = {};
    if (keyword) {
        whereClause.OR = [
            { title: { contains: keyword, mode: "insensitive" } },
            { description: { contains: keyword, mode: "insensitive" } },
        ];
    }

    if (tagIds?.length) {
        whereClause.questionTags = {
            some: {
                tagId: { in: tagIds },
            },
        };
    }

    const [questions, totalCount] = await Promise.all([
        prisma.question.findMany({
            where: whereClause,
            include: {
                user: { select: { username: true } },
                questionTags: { include: { tag: true } },
            },
            skip,
            take,
            orderBy,
        }),
        prisma.question.count({ where: whereClause }),
    ]);

    return { questions, totalCount };
}
