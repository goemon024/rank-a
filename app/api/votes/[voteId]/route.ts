import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function DELETE(req: NextRequest) {
  const voteIdStr = req.nextUrl.pathname.split("/").pop();
  const voteId = parseInt(voteIdStr || "", 10);

  try {
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.split(" ")[1];

    if (!token) {
      return NextResponse.json({ error: "Token missing" }, { status: 401 });
    }

    let userId: number;
    try {
      const payload = jwt.verify(token, JWT_SECRET) as { userId: number };
      userId = payload.userId;
    } catch (err) {
      console.error("DELETE /vote/[voteId] エラー:", err);
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    console.log("DELETE voteId", voteId);

    const existingVote = await prisma.vote.findUnique({
      where: { id: voteId },
    });

    if (!existingVote) {
      return NextResponse.json({ error: "Vote not found" }, { status: 404 });
    }

    if (existingVote.userId !== userId) {
      return NextResponse.json(
        { error: "Not authorized to delete this vote" },
        { status: 403 },
      );
    }

    await prisma.vote.delete({ where: { id: voteId } });

    return NextResponse.json(
      { message: "Vote deleted successfully" },
      { status: 200 },
    );
  } catch (err) {
    console.error("🔥 DELETE /vote/[voteId] エラー:", err);
    return NextResponse.json(
      {
        error: "Server Error",
        detail: err instanceof Error ? err.message : String(err),
      },
      { status: 500 },
    );
  }
}

export async function PUT(req: NextRequest) {
  const voteIdStr = req.nextUrl.pathname.split("/").pop();
  const voteId = parseInt(voteIdStr || "", 10);

  try {
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.split(" ")[1];

    if (!token) {
      return NextResponse.json({ error: "Token missing" }, { status: 401 });
    }

    let userId: number;
    try {
      const payload = jwt.verify(token, JWT_SECRET) as { userId: number };
      userId = payload.userId;
    } catch (err) {
      console.error("PUT /vote/[voteId] エラー:", err);
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const existingVote = await prisma.vote.findUnique({
      where: { id: voteId },
    });

    if (!existingVote) {
      return NextResponse.json({ error: "Vote not found" }, { status: 404 });
    }

    if (existingVote.userId !== userId) {
      return NextResponse.json(
        { error: "Not authorized to delete this vote" },
        { status: 403 },
      );
    }

    let newtype: "Upvote" | "Downvote";
    const { type: typeFromRequest } = await req.json();
    if (typeFromRequest === "Upvote") {
      newtype = "Upvote";
    } else if (typeFromRequest === "Downvote") {
      newtype = "Downvote";
    } else {
      return NextResponse.json({ error: "Invalid vote type" }, { status: 400 });
    }

    console.log("change vote type to", newtype);
    await prisma.vote.update({
      where: { id: voteId },
      data: { type: newtype },
    });

    return NextResponse.json(
      { message: "Vote changed successfully" },
      { status: 200 },
    );
  } catch (err) {
    console.error(" PUT /vote/[voteId] エラー:", err);
    return NextResponse.json(
      {
        error: "Server Error",
        detail: err instanceof Error ? err.message : String(err),
      },
      { status: 500 },
    );
  }
}
