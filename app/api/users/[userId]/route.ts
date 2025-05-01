// app/api/users/[userId]/route.ts
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { verifyToken } from "@/utils/auth"; // JWT検証ユーティリティ

export const GET = async (
  req: Request,
  { params }: { params: { userId: string } },
) => {
  try {
    const authHeader = req.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 404 }); //401
    }

    const token = authHeader.split(" ")[1];
    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Invalid token" }, { status: 404 }); //401
    }

    const { userId } = await Promise.resolve(params);
    // DBからユーザー取得
    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId, 10) },
      select: {
        id: true,
        username: true,
        email: true,
        passwordHash: true,
        role: true,
        imagePath: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
};
