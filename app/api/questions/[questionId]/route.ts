import prisma from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { questionSchema } from "@/schemas/qustionSchema";

export async function GET(req: NextRequest) {
  try {
    const questionId = req.nextUrl.pathname.split("/").filter(Boolean)[2];

    if (isNaN(parseInt(questionId, 10))) {
      return NextResponse.json(
        { error: "Invalid question ID" },
        { status: 404 },
      );
    }

    const question = await prisma.question.findUnique({
      where: {
        id: parseInt(questionId, 10),
      },
      include: {
        user: {
          select: {
            username: true,
            imagePath: true,
          },
        },
        questionTags: true,
      },
    });

    if (!question) {
      return NextResponse.json(
        { error: "Question not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(question, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_key"; // .envで設定しておく

export async function PUT(req: NextRequest) {
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
  const { title, description, isDraft, tags, id } = body;

  const result = questionSchema.safeParse({
    title,
    description,
    tags,
  });

  if (!result.success) {
    return NextResponse.json(
      { error: result.error.errors[0].message },
      { status: 400 },
    );
  }

  if (!title || !description) {
    return NextResponse.json(
      { error: "title and description are required" },
      { status: 400 },
    );
  }

  try {
    const question = await prisma.question.update({
      where: { id: parseInt(id), userId: payload.userId },
      data: {
        title,
        description,
        isDraft,
        createdAt: new Date(),
      },
    });

    const deleteResult = await prisma.questionTag.deleteMany({
      where: { questionId: parseInt(id) },
    });

    const updateResult = await prisma.questionTag.createMany({
      data: tags.map((tagId: number) => ({
        questionId: parseInt(id),
        tagId: tagId,
      })),
    });

    // eslint-disable-next-line no-console
    console.log("QuestionTag insert result:", updateResult);
    return NextResponse.json(
      { success: true, question, deleteResult, updateResult },
      { status: 200 },
    );
  } catch (error: unknown) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code?: string }).code === "P2025"
    ) {
      return NextResponse.json(
        { error: "Question not found" },
        { status: 404 },
      );
    }
    // eslint-disable-next-line no-console
    console.error("DB error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function DELETE(req: NextRequest) {
  const authHeader = req.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = authHeader.split(" ")[1];

  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET) as { userId: number };
  } catch (err: unknown) {
    console.error("Token verification failed:", err);
    return NextResponse.json({ error: "Invalid token" }, { status: 403 });
  }

  const questionId = req.nextUrl.pathname.split("/").filter(Boolean)[2];

  try {
    const result = await prisma.question.delete({
      where: { id: parseInt(questionId, 10), userId: payload.userId },
    });
    return NextResponse.json({ success: true, result }, { status: 200 });
  } catch (error: unknown) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code?: string }).code === "P2025"
    ) {
      return NextResponse.json(
        { error: "Question not found" },
        { status: 404 },
      );
    }
    console.error("DB error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
