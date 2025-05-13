import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_key";

export async function DELETE(req: NextRequest) {
  // 認証処理
  const commentId = req.nextUrl.pathname.split("/").pop() || "";

  const authHeader = req.headers.get("authorization");
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : null;
  if (!token) {
    return NextResponse.json(
      { error: "認証トークンが必要です" },
      { status: 401 },
    );
  }

  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET) as { userId: number };
  } catch (err: unknown) {
    console.error("Token verification failed:", err);
    return NextResponse.json({ error: "Invalid token" }, { status: 403 });
  }

  try {
    const deletedComment = await prisma.comment.delete({
      where: {
        id: parseInt(commentId, 10),
        userId: payload.userId,
      },
    });

    if (!deletedComment) {
      return NextResponse.json(
        { error: "回答が見つかりません" },
        { status: 404 },
      );
    }

    return NextResponse.json(deletedComment, { status: 200 });
  } catch (error) {
    console.error("Error deleting comment:", error);
    return NextResponse.json(
      { error: "コメントの削除に失敗しました" },
      { status: 500 },
    );
  }
}
