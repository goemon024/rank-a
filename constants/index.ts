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
  { label: "人気質問一覧", href: "/home?sort=score&page=1" },
];

export const getLinksProfile = (
  userId: string | null,
  isOwer: boolean = true,
) => {
  if (isOwer) {
    return [
      { label: "プロフィール", href: `/profile/${userId}` },
      { label: "下書き一覧", href: `/profile/${userId}/drafts` },
      { label: "質問履歴", href: `/profile/${userId}/questions` },
      { label: "回答履歴", href: `/profile/${userId}/answers` },
      { label: "コメント履歴", href: `/profile/${userId}/comments` },
    ];
  } else {
    return [
      { label: "プロフィール", href: `/profile/${userId}` },
      { label: "質問履歴", href: `/profile/${userId}/questions` },
      { label: "回答履歴", href: `/profile/${userId}/answers` },
      { label: "コメント履歴", href: `/profile/${userId}/comments` },
    ];
  }
};
