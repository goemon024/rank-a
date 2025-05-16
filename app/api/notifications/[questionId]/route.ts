import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";


export async function PUT(req: NextRequest) {
    try {
        // URLからquestionIdを抽出
        const url = new URL(req.url);
        const pathParts = url.pathname.split("/");
        const questionId = parseInt(pathParts.pop() || "", 10);

        if (isNaN(questionId)) {
            return NextResponse.json(
                { error: "Invalid questionId" },
                { status: 400 },
            );
        }

        const authHeader = req.headers.get("authorization");
        const token = authHeader?.startsWith("Bearer ")
            ? authHeader.split(" ")[1]
            : null;

        if (!token) {
            return NextResponse.json({ error: "Missing token" }, { status: 401 });
        }

        // 通知を既読化
        const result = await prisma.notification.updateMany({
            where: {
                questionId,
                isRead: false,
            },
            data: {
                isRead: true,
            },
        });

        return NextResponse.json({ success: true, updated: result.count });
    } catch (err) {
        console.error("通知更新エラー:", err);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 },
        );
    }
}
