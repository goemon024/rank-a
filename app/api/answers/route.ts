import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { answerSchema } from "@/schemas/answerSchema";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_key";

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
  const { questionId, content } = body;

  if (!questionId || !content) {
    return NextResponse.json({ error: "Answer not found" }, { status: 404 });
  }

  const result = answerSchema.safeParse({ content });
  if (!result.success) {
    return NextResponse.json(
      { error: result.error.errors[0].message },
      { status: 400 },
    );
  }

  try {
    // 質問を取得して質問者のIDを特定
    const question = await prisma.question.findUnique({
      where: { id: parseInt(questionId, 10) },
      select: { userId: true },
    });

    if (!question) {
      return NextResponse.json(
        { error: "Question not found" },
        { status: 404 },
      );
    }

    // 回答を作成
    const answer = await prisma.answer.create({
      data: {
        questionId: parseInt(questionId, 10),
        userId: payload.userId,
        content: content,
      },
    });

    // 回答を作成したユーザーに通知を作成
    if (question.userId !== payload.userId) {
      await prisma.notification.create({
        data: {
          userId: question.userId,
          type: "answer",
          entityId: answer.id,
          questionId: parseInt(questionId, 10),
        },
      });
    }

    return NextResponse.json(answer, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 });
  }

  try {
    const answer = await prisma.answer.findMany({
      where: {
        userId: parseInt(userId || "0", 10),
      },
      include: {
        user: {
          select: {
            username: true,
            imagePath: true,
          },
        },
        question: {
          select: {
            title: true,
          },
        },
      },
    });
    return NextResponse.json(
      { success: true, answer: answer },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
