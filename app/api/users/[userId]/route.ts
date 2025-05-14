// app/api/users/[userId]/route.ts
import prisma from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import { verifyToken } from "@/utils/auth"; // JWT検証ユーティリティ
import { Prisma } from "@prisma/client";
import { createClient } from "@supabase/supabase-js";

import { imageUploadSchema } from "@/schemas/imageUploadSchema";
import { profileSchema } from "@/schemas/profileSchema";

export async function GET(req: NextRequest) {
  try {
    const urlParams = new URL(req.url);
    const userId = urlParams.pathname.split("/").filter(Boolean)[2];

    // クエリでユーザーIDが存在しない場合と数値でない場合にエラーを返す。
    if (!userId || isNaN(Number(userId))) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    // トークン取得と検証
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null;

    let payload: { id: number } | null = null;
    try {
      if (token) {
        const decoded = await verifyToken(token);
        if (
          decoded &&
          typeof decoded === "object" &&
          "userId" in decoded &&
          typeof decoded.userId === "number"
        ) {
          payload = { id: decoded.userId };
        } else {
          payload = null;
        }
      }
    } catch (err) {
      console.error("トークンの検証に失敗しました:", err);
      payload = null; // 無効トークン
    }

    const isSelf = payload?.id === parseInt(userId, 10);

    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId, 10) },
      select: isSelf
        ? {
          id: true,
          username: true,
          email: true,
          role: true,
          imagePath: true,
          introduce: true,
          createdAt: true,
        }
        : {
          id: true,
          username: true,
          imagePath: true,
          introduce: true,
          createdAt: true,
        },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (err) {
    console.error("User fetch error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function PUT(req: NextRequest) {
  const urlParams = new URL(req.url);
  const userIdstr = urlParams.pathname.split("/").filter(Boolean)[2];
  const userId = parseInt(userIdstr, 10);

  // トークン取得と検証
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : null;

  let payload: { id: number } | null = null;
  try {
    if (token) {
      const decoded = await verifyToken(token);
      if (
        decoded &&
        typeof decoded === "object" &&
        "userId" in decoded &&
        typeof decoded.userId === "number"
      ) {
        payload = { id: decoded.userId };
      } else {
        payload = null;
      }
    }
  } catch (err) {
    console.error("トークンの検証に失敗しました:", err);
    payload = null; // 無効トークン
  }

  if (!payload || payload.id !== userId) {
    return NextResponse.json({ error: "権限がありません" }, { status: 403 });
  }

  // 現在のユーザ情報（imagePath）を後で削除するために取得
  const currentUser = await prisma.user.findUnique({
    where: { id: userId },
    select: { imagePath: true },
  });

  let oldFileName: string | null = null;
  try {
    if (currentUser?.imagePath) {
      // const url = new URL(currentUser.imagePath);
      // const parts = url.pathname.split("/");
      // oldFileName = parts[parts.length - 1];

      const parts = currentUser.imagePath.split("/");
      oldFileName = parts[parts.length - 1];

    }
  } catch (e) {
    console.warn("旧画像ファイル名の取得に失敗しました（ログのみ）", e);
  }

  // 画像アップロード
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  const formData = await req.formData();
  const username = formData.get("username");
  const email = formData.get("email");
  const file = formData.get("imagePath") as File | null;
  const introduce = formData.get("introduce");

  // 画像バリデーション
  if (file && file.size > 0) {
    const result = imageUploadSchema.safeParse(file);
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0].message },
        { status: 400 },
      );
    }
  }

  // プロフィールバリデーション
  const profileResult = profileSchema.safeParse({
    username,
    email,
    introduce,
  });
  if (!profileResult.success) {
    return NextResponse.json(
      { error: profileResult.error.errors[0].message },
      { status: 400 },
    );
  }

  let imagePath: string | null = null;
  if (file && file.size > 0) {
    const buffer = Buffer.from(await file.arrayBuffer());

    // const ext = file.type.split("/")[1];
    const ext = "jpg";
    const fileName = `user_${userId}_${Date.now()}.${ext}`;

    // const fileName = `user_${userId}_${Date.now()}.jpg`;

    const { error } = await supabase.storage
      .from("avatars") // バケット名
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: true, // 同名なら上書き
      });

    if (error) {
      console.error("画像アップロード失敗:", error);
      return NextResponse.json(
        { error: "画像の保存に失敗しました" },
        { status: 500 },
      );
    }

    imagePath = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/avatars/${fileName}`;
    console.log("imagePath", imagePath);

    // const { data: urlData } = supabase.storage
    //   .from("avatars")
    //   .getPublicUrl(fileName);
    // imagePath = urlData.publicUrl;
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        id: userId,
        username: username as string,
        email: email as string,
        introduce: introduce as string,
        ...(imagePath && { imagePath }),
      },
      select: {
        id: true,
        username: true,
        email: true,
        introduce: true,
        imagePath: true,
        role: true,
      },
    });

    // 旧画像の削除
    if (oldFileName) {
      try {
        await supabase.storage.from("avatars").remove([oldFileName]);
      } catch (e) {
        console.warn("旧画像の削除に失敗しました（ログのみ）", e);
      }
    }

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      // ユニーク制約違反
      const target = Array.isArray(error.meta?.target)
        ? error.meta?.target.join("と")
        : "一意制約";
      // eslint-disable-next-line no-console
      console.error("ユニーク制約違反:", error);
      return NextResponse.json(
        { error: `${target}が既に使われています` },
        { status: 409 },
      );
    }
    console.error("プロフィール更新エラー:", error);
    return NextResponse.json(
      { error: "プロフィールの更新に失敗しました" },
      { status: 500 },
    );
  }
}

// export const GET = async (
//   req: NextRequest,
//   // { params }: { params: { userId: string } },
// ) => {
//   try {
//     const authHeader = req.headers.get("authorization");

//     if (!authHeader || !authHeader.startsWith("Bearer ")) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 404 }); //401
//     }

//     const token = authHeader.split(" ")[1];
//     const payload = await verifyToken(token);
//     if (!payload) {
//       return NextResponse.json({ error: "Invalid token" }, { status: 404 }); //401
//     }

//     // const { userId } = await Promise.resolve(params);
//     const userId = req.nextUrl.pathname.split("/").filter(Boolean)[2];

//     // DBからユーザー取得
//     const user = await prisma.user.findUnique({
//       where: { id: parseInt(userId, 10) },
//       select: {
//         id: true,
//         username: true,
//         email: true,
//         passwordHash: true,
//         role: true,
//         imagePath: true,
//         createdAt: true,
//       },
//     });

//     if (!user) {
//       return NextResponse.json({ error: "User not found" }, { status: 404 });
//     }

//     return NextResponse.json(user, { status: 200 });
//   } catch (err) {
//     console.error(err);
//     return NextResponse.json(
//       { error: "Internal Server Error" },
//       { status: 500 },
//     );
//   }
// };
