// app/api/users/login/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sanitizeInput } from "@/utils/sanitize";
import { signinSchema } from "@/schemas/signinSchema";
// import { serialize } from "cookie";

// ログイン試行回数を追跡するための簡易的なメモリストア
const loginAttempts = new Map<string, { count: number; lastAttempt: number }>();

// ログイン試行をチェックする関数
async function checkLoginAttempts(identifier: string): Promise<boolean> {
  const now = Date.now();
  const attempt = loginAttempts.get(identifier);

  // 300秒でリセット
  if (attempt && now - attempt.lastAttempt > 300 * 1000) {
    loginAttempts.delete(identifier);
    return true;
  }

  // 3回以上の試行でブロック
  if (attempt && attempt.count >= 3) {
    return false;
  }

  // 試行回数を更新
  loginAttempts.set(identifier, {
    count: (attempt?.count || 0) + 1,
    lastAttempt: now,
  });

  return true;
}

const JWT_SECRET = process.env.JWT_SECRET || "your-default-secret";

export async function POST(req: Request) {
  try {
    const { usernameOrEmail, password } = await req.json();

    const sanitizedUsernameOrEmail = sanitizeInput(usernameOrEmail);

    const validationResult = signinSchema.safeParse({
      usernameOrEmail,
      password,
    });
    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.errors[0].message },
        { status: 400 },
      );
    }

    // ログイン試行をチェック
    const canAttempt = await checkLoginAttempts(sanitizedUsernameOrEmail);
    if (!canAttempt) {
      return NextResponse.json(
        {
          error:
            "ログイン試行回数が制限を超えました。15秒後に再試行してください。",
        },
        { status: 401 },
      );
    }

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { username: sanitizedUsernameOrEmail },
          { email: sanitizedUsernameOrEmail },
        ],
      },
    });

    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return NextResponse.json(
        { error: "パスワードが正しくありません" },
        { status: 401 },
      );
    }

    const token = jwt.sign(
      {
        userId: user.id,
        username: user.username,
        role: user.role,
        imagePath: user.imagePath,
      },
      JWT_SECRET,
      { expiresIn: "3h" },
    );

    return NextResponse.json({ token }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        error: "ログイン中にサーバーエラーが発生しました",
        message: error instanceof Error ? error.message : "不明なエラー",
      },
      { status: 500 },
    );
  }
}
