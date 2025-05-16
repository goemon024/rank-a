import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_key"; // あらかじめ.envで管理

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const questionIdsParam = searchParams.get("questionIds");

  // Authorizationヘッダーの取得とJWT解析
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : null;

  if (!token) {
    return NextResponse.json({ error: "Missing token" }, { status: 401 });
  }

  // トークンからユーザーIDを取得（念のため）
  let userId: number;
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
    userId = decoded.userId;
  } catch (err) {
    console.log(err);
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  // クエリパラメータから questionIds を取得
  if (!questionIdsParam) {
    return NextResponse.json({ error: "Missing questionIds" }, { status: 400 });
  }

  const questionIds = questionIdsParam
    .split(",")
    .map((id) => parseInt(id.trim(), 10))
    .filter((id) => !isNaN(id));

  if (questionIds.length === 0) {
    return NextResponse.json([], { status: 200 });
  }

  // 通知の取得
  try {
    const notifications = await prisma.notification.findMany({
      where: {
        questionId: {
          in: questionIds,
        },
        userId: userId,
      },
      select: {
        id: true,
        userId: true,
        questionId: true,
        type: true,
        isRead: true,
      },
    });

    return NextResponse.json(notifications, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch notifications:", error);
    return NextResponse.json(
      { error: "Failed to fetch notifications" },
      { status: 500 },
    );
  }
}
