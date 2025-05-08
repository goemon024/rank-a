import { z } from "zod";

// パスワード強度出力
export const getPasswordScore = (val: string): number => {
  if (val.length < 8) return 1;
  const hasLower = /[a-z]/.test(val);
  const hasUpper = /[A-Z]/.test(val);
  const hasNumber = /[0-9]/.test(val);
  const hasSymbol = /[^a-zA-Z0-9]/.test(val);
  return [hasLower, hasUpper, hasNumber, hasSymbol].filter(Boolean).length;
};

export const changePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, { message: "現在のパスワードを入力してください" }),
    newPassword: z
      .string()
      .min(8, { message: "新しいパスワードは8文字以上で入力してください" })
      .refine((val) => getPasswordScore(val) >= 2, {
        message:
          "新しいパスワードは大文字・小文字・数字・記号のうち2種類以上を含めてください",
      }),
    confirmPassword: z
      .string()
      .min(1, { message: "新しいパスワード（確認）を入力してください" }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "新しいパスワードと確認用パスワードが一致しません",
    path: ["confirmPassword"],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "現在のパスワードと新しいパスワードが同じです",
    path: ["newPassword"],
  });

export const passwordSchema = z.object({
  newPassword: z
    .string()
    .min(8, { message: "新しいパスワードは8文字以上で入力してください" })
    .refine((val) => getPasswordScore(val) >= 2, {
      message:
        "新しいパスワードは大文字・小文字・数字・記号のうち2種類以上を含めてください",
    }),
});
