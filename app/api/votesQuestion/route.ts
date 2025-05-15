import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_key";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const questionIdParam = searchParams.get("questionId");

    if (!questionIdParam) {
      return NextResponse.json(
        { error: "Missing questionId" },
        { status: 400 },
      );
    }

    const questionId = parseInt(questionIdParam, 10);
    if (isNaN(questionId)) {
      return NextResponse.json(
        { error: "Invalid questionId" },
        { status: 400 },
      );
    }

    //認証トークンがある場合のみ userId を取得
    let userId: number | null = null;

    const authHeader = req.headers.get("authorization");
    const token = authHeader?.startsWith("Bearer")
      ? authHeader.split(" ")[1]
      : null;

    // console.log("token", token);

    if (token) {
      try {
        const payload = jwt.verify(token, JWT_SECRET) as { userId: number };
        userId = payload.userId;
        // console.log("✅ JWT payload:", payload);
      } catch (err) {
        console.log("❌ JWT payload:", err);
        // console.warn("Invalid token, proceeding as guest");
      }
    }

    // 対象の質問＋投票を取得
    const question = await prisma.question.findUnique({
      where: { id: questionId },
      include: { voteQuestion: true },
    });

    const voteMapQuestion: {
      [questionId: number]: {
        upvotes: number;
        downvotes: number;
        userVote: "Upvote" | "Downvote" | null;
        voteId?: number;
      };
    } = {};

    const upvotes = question?.voteQuestion.filter(
      (v) => v.type === "Upvote",
    ).length;
    const downvotes = question?.voteQuestion.filter(
      (v) => v.type === "Downvote",
    ).length;

    let userVote: "Upvote" | "Downvote" | null = null;
    let voteId: number | undefined = undefined;

    if (userId !== null) {
      const userVoteObj = question?.voteQuestion.find(
        (v) => v.userId === userId,
      );
      if (userVoteObj) {
        userVote = userVoteObj.type as "Upvote" | "Downvote";
        voteId = userVoteObj.id;
      }
    }

    // console.log("userVote", userVote);
    // console.log("voteId", voteId);

    voteMapQuestion[questionId] = {
      upvotes: upvotes || 0,
      downvotes: downvotes || 0,
      userVote: userVote as "Upvote" | "Downvote" | null,
      voteId: voteId || undefined,
    };

    return NextResponse.json(voteMapQuestion, { status: 200 });
  } catch (err) {
    console.error("Error fetching votes:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { targetId, type } = await req.json();

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

    const existingVote = await prisma.voteQuestion.findFirst({
      where: {
        questionId: targetId,
        userId,
      },
    });

    if (existingVote) {
      return NextResponse.json(
        { error: "Vote already exists" },
        { status: 400 },
      );
    }

    const createVote = await prisma.voteQuestion.create({
      data: {
        questionId: targetId,
        userId,
        type,
      },
    });

    return NextResponse.json(
      {
        success: true,
        id: createVote.id,
      },
      { status: 200 },
    );
  } catch (err) {
    console.error("Error creating vote:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
