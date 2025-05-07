import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const questionId = req.nextUrl.pathname.split("/").filter(Boolean)[2];
    if (!questionId || isNaN(parseInt(questionId, 10))) {
      return NextResponse.json(
        { error: "Invalid question ID" },
        { status: 404 }, //400
      );
    }

    const answers = await prisma.answer.findMany({
      where: { questionId: parseInt(questionId, 10) },
      orderBy: { createdAt: "asc" },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            imagePath: true,
          },
        },
      },
    });

    const count = await prisma.answer.count({
      where: { questionId: parseInt(questionId, 10) },
    });

    if (!answers || answers.length === 0) {
      return NextResponse.json({ error: "No answers found" }, { status: 404 });
    }

    return NextResponse.json({ answers, count }, { status: 200 });
  } catch (err) {
    console.error("GET /questions/:id/answers error:", err);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
