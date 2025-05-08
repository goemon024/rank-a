import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { answerSchema } from "@/schemas/answerSchema";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_key";

export async function PUT(req: NextRequest) {
    // 認証処理
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

    const answer = await req.json();
    const result = answerSchema.safeParse(answer);
    if (!result.success) {
        return NextResponse.json(
            { error: result.error.errors[0].message },
            { status: 400 },
        );
    }

    if (answer.userId !== payload.userId) {
        return NextResponse.json(
            { error: "編集権限がありません" },
            { status: 403 },
        );
    }

    try {
        const updatedAnswer = await prisma.answer.update({
            where: {
                id: parseInt(answer.answerId, 10),
            },
            data: {
                content: answer.content,
            },
        });

        if (!updatedAnswer) {
            return NextResponse.json(
                { error: "回答が見つかりません" },
                { status: 404 },
            );
        }

        return NextResponse.json(updatedAnswer, { status: 200 });
    } catch (error) {
        console.error("Error updating answer:", error);
        return NextResponse.json(
            { error: "回答の更新に失敗しました" },
            { status: 500 },
        );
    }
}

export async function DELETE(req: NextRequest) {
    // 認証処理
    const answerId = req.nextUrl.pathname.split("/").pop() || "";

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
        const deletedAnswer = await prisma.answer.delete({
            where: {
                id: parseInt(answerId, 10),
                userId: payload.userId,
            },
        });

        if (!deletedAnswer) {
            return NextResponse.json(
                { error: "回答が見つかりません" },
                { status: 404 },
            );
        }

        return NextResponse.json(deletedAnswer, { status: 200 });
    } catch (error) {
        console.error("Error updating answer:", error);
        return NextResponse.json(
            { error: "回答の更新に失敗しました" },
            { status: 500 },
        );
    }
}
