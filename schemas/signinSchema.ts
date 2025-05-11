import { z } from "zod";
import { getPasswordScore } from "./passwordSchema";

export const signinSchema = z.object({
    usernameOrEmail: z
        .string()
        .min(1, { message: "ユーザー名またはメールアドレスを入力してください" })
        .max(100, { message: "ユーザー名またはメールアドレスは100文字以内で入力してください" }),
    password: z
        .string()
        .min(8, { message: "パスワードは8文字以上で入力してください" })
        .refine((val) => getPasswordScore(val) >= 2, {
            message:
                "パスワードは大文字・小文字・数字・記号のうち2種類以上を含めてください",
        }),
});