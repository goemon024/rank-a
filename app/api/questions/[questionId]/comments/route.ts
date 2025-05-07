import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  // context: { params: { questionId: string } },
) {
  try {
    // const { questionId } = await Promise.resolve(context.params);
    const questionId = req.nextUrl.pathname.split("/").filter(Boolean)[2];

    if (isNaN(parseInt(questionId, 10))) {
      return NextResponse.json(
        { error: "Invalid question ID" },
        { status: 404 },
      ); //400
    }

    const comments = await prisma.comment.findMany({
      where: { questionId: parseInt(questionId, 10) },
      orderBy: { createdAt: "asc" },
      include: {
        user: {
          select: { id: true, username: true, imagePath: true },
        },
      },
    });

    if (!comments || comments.length === 0) {
      return NextResponse.json({ error: "No comments found" }, { status: 404 });
    }

    return NextResponse.json({ comments }, { status: 200 });
  } catch (err) {
    console.error("GET /questions/:id/answers error:", err);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
