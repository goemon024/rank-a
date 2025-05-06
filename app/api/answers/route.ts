import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_key"; // .envで設定しておく

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 400 }); //401
  }

  const token = authHeader.split(" ")[1];

  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET) as { userId: number };
  } catch (err: unknown) {
    // eslint-disable-next-line no-console
    console.error("Token verification failed:", err);
    return NextResponse.json({ error: "Invalid token" }, { status: 400 }); // 403
  }

  const body = await req.json();
  const { questionId, content } = body;

  if (!questionId || !content) {
    return NextResponse.json({ error: "Answer not found" }, { status: 404 });
  }

  try {
    const answer = await prisma.answer.create({
      data: {
        questionId: parseInt(questionId, 10),
        userId: payload.userId,
        content: content,
      },
    });
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

  const authHeader = req.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = authHeader.split(" ")[1];
  const payload = jwt.verify(token, JWT_SECRET) as { userId: number };

  if (!userId || payload.userId !== parseInt(userId, 10)) {
    console.log("payload.userId", payload.userId);
    console.log("userId", userId);
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const answer = await prisma.answer.findMany({
      where: {
        userId: parseInt(userId, 10),
      },
      include: {
        user: {
          select: {
            username: true,
          },
        },
        question: {
          select: {
            title: true,
          },
        },
      },
    });
    return NextResponse.json({ success: true, answer: answer }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
