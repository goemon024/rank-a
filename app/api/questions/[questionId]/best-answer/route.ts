import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_key"; // .envで設定しておく

export async function PATCH(req: NextRequest) {
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

  const questionId = parseInt(
    req.nextUrl.pathname.split("/").filter(Boolean)[2],
    10,
  );
  console.log("questionId", questionId);

  try {
    if (isNaN(questionId)) {
      return NextResponse.json(
        { error: "Invalid questionId" },
        { status: 400 },
      );
    }

    const body = await req.json();
    const bestAnswerId =
      body.bestAnswerId === null ? null : parseInt(body.bestAnswerId, 10);

    if (bestAnswerId !== null && typeof bestAnswerId !== "number") {
      return NextResponse.json(
        { error: "Invalid bestAnswerId" },
        { status: 400 },
      );
    }

    // ベスト回答又は質問の存在確認
    let question;
    if (bestAnswerId !== null) {
      question = await prisma.question.findUnique({
        where: {
          id: questionId,
          userId: payload.userId,
          answers: {
            some: {
              id: bestAnswerId,
            },
          },
        },
      });
    } else {
      question = await prisma.question.findUnique({
        where: {
          id: questionId,
          userId: payload.userId,
        },
      });
    }

    if (!question) {
      return NextResponse.json(
        { error: "Question not found" },
        { status: 404 },
      );
    }

    // update bestAnswerId
    if (bestAnswerId !== null) {
      await prisma.question.update({
        where: {
          id: questionId,
          answers: {
            some: {
              id: bestAnswerId,
            },
          },
        },
        data: { bestAnswerId: bestAnswerId },
      });
    } else {
      await prisma.question.update({
        where: { id: questionId },
        data: { bestAnswerId: null },
      });
    }

    return NextResponse.json(
      { message: "Best answer has been set successfully." },
      { status: 200 },
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
