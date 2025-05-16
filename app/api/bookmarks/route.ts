import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_key";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userIdParam = searchParams.get("userId");
    const questionIdsParam = searchParams.get("questionIds");

    if (!userIdParam || !questionIdsParam) {
      return NextResponse.json(
        { error: "userIdとquestionIdsは必須です" },
        { status: 400 },
      );
    }

    const userId = parseInt(userIdParam, 10);
    if (isNaN(userId)) {
      return NextResponse.json(
        { error: "ログインしていない、userIdが不正です" },
        { status: 400 },
      );
    }

    const questionIds = questionIdsParam
      .split(",")
      .map((id) => parseInt(id, 10))
      .filter((id) => !isNaN(id))
      .slice(0, 10);

    if (questionIds.length === 0) {
      return NextResponse.json(
        { error: "ブックマークがない、或いは、questionIdsが不正です" },
        { status: 400 },
      );
    }

    // 一括取得
    const bookmarks = await prisma.bookmark.findMany({
      where: {
        userId,
        questionId: { in: questionIds },
      },
    });

    // questionIdごとにbookmarkIdを返す
    const result = questionIds.map((qid) => {
      const found = bookmarks.find((b) => b.questionId === qid);
      return { questionId: qid, bookmarkId: found ? found.id : null };
    });

    return NextResponse.json(result, { status: 200 });
  } catch (err) {
    console.error("Error fetching bookmarks:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { questionId } = await req.json();

    const authHeader = req.headers.get("Authorization");
    const token = authHeader?.split(" ")[1];

    let userId: number | null = null;
    if (token) {
      try {
        const payload = jwt.verify(token, JWT_SECRET) as { userId: number };
        userId = payload.userId;
      } catch (err) {
        console.error("POST /vote エラー:", err);
        return NextResponse.json({ error: "Invalid token" }, { status: 401 });
      }
    }

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const existingBookmark = await prisma.bookmark.findFirst({
      where: {
        questionId,
        userId,
      },
    });

    if (existingBookmark) {
      return NextResponse.json(
        { error: "Bookmark already exists" },
        { status: 400 },
      );
    }

    const createBookmark = await prisma.bookmark.create({
      data: {
        questionId,
        userId,
      },
    });

    return NextResponse.json(
      {
        success: true,
        id: createBookmark.id,
      },
      { status: 200 },
    );
  } catch (err) {
    console.error("Error creating bookmark:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { questionId } = await req.json();

    const authHeader = req.headers.get("Authorization");
    const token = authHeader?.split(" ")[1];

    let userId: number | null = null;
    if (token) {
      try {
        const payload = jwt.verify(token, JWT_SECRET) as { userId: number };
        userId = payload.userId;
      } catch (err) {
        console.error("DELETE /bookmark エラー:", err);
        return NextResponse.json({ error: "Invalid token" }, { status: 401 });
      }
    }

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const existingBookmark = await prisma.bookmark.findFirst({
      where: { questionId, userId },
    });

    if (!existingBookmark) {
      return NextResponse.json(
        { error: "Bookmark not found" },
        { status: 404 },
      );
    }

    await prisma.bookmark.delete({ where: { id: existingBookmark.id } });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("Error deleting bookmark:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
