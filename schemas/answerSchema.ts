import { z } from "zod";
import { marked } from "marked";

// Markdownの内容が実質的に空でないかをチェックする関数
export function isMeaningfulMarkdown(input: string): boolean {
  const html = (marked.parse(input || "") as string)
    .replace(/<[^>]+>/g, "")
    .trim();
  return html.length >= 10; // 実質的に10文字以上あるか
}

export const answerSchema = z.object({
  content: z
    .string()
    .min(1, "回答を入力してください")
    .max(2000, "回答は2000文字以内にしてください")
    .refine(isMeaningfulMarkdown, {
      message: "Markdownを含めて、実質的に10文字以上の内容が必要です",
    }),
});
