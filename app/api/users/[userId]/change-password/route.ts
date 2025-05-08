import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import { verifyToken } from "@/utils/auth";
import { changePasswordSchema } from "@/schemas/passswordSchema";

export async function PUT(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "認証情報がありません" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: "トークンが無効です" }, { status: 401 });
    }

    const { currentPassword, newPassword, confirmPassword } = await req.json();

    // if (!currentPassword || !newPassword) {
    //   // eslint-disable-next-line no-console
    //   console.log("すべての項目を入力してください");
    //   return NextResponse.json({ error: "すべての項目を入力してください" }, { status: 400 });
    // }


    // if (newPassword.length < 8) {
    //   return NextResponse.json({ error: "パスワードは8文字以上にしてください" }, { status: 400 });
    // }


    const result = changePasswordSchema.safeParse({
      currentPassword,
      newPassword,
      confirmPassword,
    });
    if (!result.success) {
      return NextResponse.json({ error: result.error.errors[0].message }, { status: 400 });
    }

    let userId: number | undefined = undefined;
    if (
      payload &&
      typeof payload === "object" &&
      "userId" in payload &&
      typeof payload.userId === "number"
    ) {
      userId = payload.userId;
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { passwordHash: true },
    });

    if (!user) {
      return NextResponse.json({ error: "ユーザーが見つかりません" }, { status: 404 });
    }

    console.log("passwordHash", user.passwordHash);
    // 現在のパスワードが正しいか確認
    const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isMatch) {
      return NextResponse.json({ error: "現在のパスワードが正しくありません" }, { status: 401 });
    }

    // 新しいパスワードをハッシュ化して保存
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash: hashedNewPassword },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("パスワード変更エラー:", err);
    return NextResponse.json({ error: "サーバーエラーが発生しました" }, { status: 500 });
  }
}
