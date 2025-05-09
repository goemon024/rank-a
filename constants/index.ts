export const TAGS = [
  "Python",
  "SQL",
  "React",
  "Next.js",
  "Prisma",
  "TypeScript",
  "CSS",
  "HTML",
  "Node.js",
  "Express",
  "Django",
  "Vue",
  "Svelte",
  "Ruby",
  "Java",
] as const;

export const LINKS_HOME = [
  { label: "新着質問一覧", href: "/home" },
  { label: "人気質問一覧", href: "/home/popular" },
];

export const getLinksProfile = (userId: string | null) => [
  { label: "プロフィール", href: `/profile/${userId}` },
  { label: "下書き一覧", href: `/profile/${userId}/drafts` },
  { label: "質問履歴", href: `/profile/${userId}/questions` },
  { label: "回答履歴", href: `/profile/${userId}/answers` },
  { label: "コメント履歴", href: `/profile/${userId}/comments` },
];
