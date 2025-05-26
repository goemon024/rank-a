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
      {
        label: "ブックマーク",
        href: `/home?filter=bookmarked&userId=${userId}`,
      },
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

export const getLinkQuestionDetail = (searchParams: URLSearchParams) => {
  console.log("searchParams", searchParams);
  if (!searchParams || searchParams.toString() === "") {
    return [{ label: "ＴＯＰに戻る", href: `/home` }];
  } else {
    return [{ label: "検索結果に戻る", href: `/home`, query: searchParams }];
  }
};

export const BreadDetailpage = () => {
  return [{ label: "ＴＯＰページ", href: `/home` },
  { label: "質問詳細", href: "" },
  ]
};

export const BreadHomepage = () => {
  return [{ label: "ＴＯＰページ", href: `` },
  ]
};

export const BreadNewPostpage = () => {
  return [{ label: "ＴＯＰページ", href: `/home` },
  { label: "質問投稿", href: "" },
  ]
};

export const BreadDraftpage = (userId: string) => {
  return [{ label: "ＴＯＰページ", href: `/home` },
  { label: "下書き一覧", href: `/profile/${userId}/drafts` },
  { label: "質問投稿", href: "" }]
};

export const BreadProfilepage = (pagename?: string, userId?: string) => {
  const crumbs = [
    { label: "ＴＯＰページ", href: `/home` },
    { label: "プロフィール", href: `/profile/${userId}` },
  ]
  if (pagename && userId) {
    crumbs.push({ label: pagename, href: "" })
  }
  return crumbs
};
