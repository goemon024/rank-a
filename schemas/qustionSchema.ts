import { z } from "zod";

export const questionSchema = z.object({
  title: z
    .string()
    .min(5, "タイトルは5文字以上で入力してください")
    .max(50, "タイトルは50文字以内で入力してください"),

  description: z
    .string()
    .min(10, "本文は10文字以上で入力してください")
    .max(2000, "本文は2000文字以内で入力してください"),

  tags: z
    .array(z.number().int().min(0).max(14))
    .min(1, "タグを選択してください")
    .max(15, "タグは15個以内で選択してください"),
});
