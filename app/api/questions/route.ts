import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
// import { getFilteredQuestions } from "@/lib/questionService";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const keyword = searchParams.get("keyword") || "";
    const tagParam = searchParams.get("tags") || "";
    const sort = searchParams.get("sort") || "newest";
    const skip = (page - 1) * limit;
    const userId = parseInt(searchParams.get("userId") || "0", 10);
    const isDraft = searchParams.get("isDraft") || "false";

    const tagIds = tagParam ? tagParam.split(",").map(id => parseInt(id, 10)).filter(id => !isNaN(id)) : [];

    const orderBy =
      sort === "oldest"
        ? { createdAt: "asc" as const } // 古い順
        : { createdAt: "desc" as const }; // 新着順

    if (page < 1 || limit < 1 || limit > 100) {
      return NextResponse.json(
        { error: "Invalid pagination parameters" },
        { status: 400 },
      );
    }

    const conditions: any[] = [];

    if (userId) {
      conditions.push({
        userId: userId,
      });
    }

    if (isDraft === "true") {
      conditions.push({
        isDraft: true,
      })
    } else {
      conditions.push({ isDraft: false });
    }

    if (keyword) {
      conditions.push({
        OR: [
          {
            title: {
              contains: keyword,
              mode: "insensitive" as const,
            },
          },
          {
            description: {
              contains: keyword,
              mode: "insensitive" as const,
            },
          },
          {
            answers: {
              some: {
                content: {
                  contains: keyword,
                  mode: "insensitive" as const,
                },
              },
            },
          },
        ],
      })
    };


    // tagIds がある場合の条件
    if (tagIds.length > 0) {
      const allTagsConditions = tagIds.map((tagId) => ({
        questionTags: {
          some: {
            tagId: tagId,
          },
        },
      }));
      conditions.push(...allTagsConditions);
    }

    console.log("userId", userId);
    console.log(conditions);
    const whereClause = conditions.length > 0 ? { AND: conditions } : {};

    const [questions, totalCount] = await Promise.all([
      prisma.question.findMany({
        where: whereClause,
        include: {
          user: {
            select: {
              username: true,
            },
          },
          answers: true,
          questionTags: true,
        },
        skip,
        take: limit,
        orderBy,
      }),
      prisma.question.count({
        where: whereClause,
      }),
    ]);

    return NextResponse.json({ questions, totalCount }, { status: 200 });
  } catch (err) {
    console.error("Error fetching questions:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}






const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_key"; // .envで設定しておく

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = authHeader.split(" ")[1];

  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET) as { userId: number };
  } catch (err: unknown) {
    // eslint-disable-next-line no-console
    console.error("Token verification failed:", err);
    return NextResponse.json({ error: "Invalid token" }, { status: 403 });
  }

  const body = await req.json();
  const { title, description, isDraft, tags } = body;

  if (!title || !description) {
    return NextResponse.json(
      { error: "title and description are required" },
      { status: 400 },
    );
  }

  try {
    const question = await prisma.question.create({
      data: {
        title,
        description,
        userId: payload.userId,
        isDraft,
      },
    });

    const result = await prisma.questionTag.createMany({
      data: tags.map((tagId: number) => ({
        questionId: question.id,
        tagId: tagId,
      })),
    });

    // eslint-disable-next-line no-console
    console.log("QuestionTag insert result:", result);
    return NextResponse.json({ success: true, question, result }, { status: 201 });
  } catch (error: unknown) {
    // eslint-disable-next-line no-console
    console.error("DB error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}




