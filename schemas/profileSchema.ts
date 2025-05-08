import { z } from "zod";

export const profileSchema = z.object({
    username: z
        .string()
        .min(2, { message: "ユーザー名は2文字以上で入力してください" })
        .max(20, { message: "ユーザー名は20文字以内で入力してください" }),
    email: z
        .string()
        .email({ message: "有効なメールアドレスを入力してください" }),
    introduce: z
        .string()
        .max(200, { message: "自己紹介は200文字以内で入力してください" })
        .optional(),
});