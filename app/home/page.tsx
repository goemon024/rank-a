import Home from "./home";
import { headers } from "next/headers";
import { QuestionWithUserAndTags } from "@/types";

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

export default async function Page({
  searchParams,
}: {
  searchParams: {
    page?: string;
    limit?: string;
    keyword?: string;
  };
}) {
  const params = await searchParams;
  const page = params.page ?? "1";
  const limit = params.limit ?? "10";
  const keyword = params.keyword ?? "";

  const queryParams = new URLSearchParams({
    page,
    limit,
    keyword,
  }).toString();

  const res = await fetch(`${BASE_URL}/api/questions?${queryParams}`, {
    cache: "no-store",
    headers: await headers(),
  });

  if (!res.ok) {
    throw new Error("質問データの取得に失敗しました");
  }

  const data = await res.json();
  const questions = data.questions as QuestionWithUserAndTags[];
  const totalCount = data.totalCount;

  const currentPage = Number(page);
  const totalPages = Math.ceil(totalCount / 10);

  return (
    <Home
      questions={questions}
      currentPage={currentPage}
      totalPages={totalPages}
      keyword={keyword}
    />
  );
}
