import { z } from "zod";

export const commentSchema = z.object({
  content: z
    .string()
    .min(2, "コメントは2文字以上で入力してください")
    .max(200, "コメントは200文字以内で入力してください"),
});
