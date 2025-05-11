import { z } from "zod";
import { getPasswordScore } from "./passwordSchema";

export const signupSchema = z.object({
    username: z
        .string()
        .min(1, { message: "ユーザー名を30文字以内で入力してください" })
        .max(30, { message: "ユーザー名は30文字以内で入力してください" }),
    email: z
        .string()
        .email({ message: "有効なメールアドレスを入力してください" })
        .max(100, { message: "メールアドレスは100文字以内で入力してください" }),
    password: z
        .string()
        .min(8, { message: "パスワードは8文字以上で入力してください" })
        .refine((val) => getPasswordScore(val) >= 2, { message: "パスワードの強度が足りません" }),
    confirmPassword: z
        .string()
        .min(8, { message: "パスワード確認も8文字以上で入力してください" }),
}).refine((data) => data.password === data.confirmPassword, {
    message: "パスワードが一致しません",
    path: ["confirmPassword"],
});
