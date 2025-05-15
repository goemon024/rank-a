import { Question, Answer, QuestionTag, Comment, Vote } from "@prisma/client";

export type QuestionWithUserAndTags = Question & {
  user: {
    username: string;
    imagePath: string | null;
  };
  questionTags: QuestionTag[];
  answerCountDirect: number; // 直接取得した回答数:現段階で名称に反映しない
};

export interface NavLinks {
  label: string;
  href: string;
  query?: URLSearchParams;
}

export type AnswerWithUser = Answer & {
  user: {
    username: string;
    userId: number;
    imagePath: string | null;
  };
};

export type AnswerWithUserAndQuestion = Answer & {
  user: {
    username: string;
    imagePath: string | null;
  };
  question: {
    title: string;
  };
};

export type CommentWithUser = Comment & {
  user: {
    username: string;
    userId: number;
    imagePath: string | null;
  };
};

export type VoteWithQuestion = Vote & {
  answer: {
    questionId: number;
  };
};

// 投票サマリー
// userVote:アクセスユーザがupかdownか
// voteId:アクセスユーザの投票のi
// up,downvotes:回答の合計up,down数
export type VoteSummary = {
  upvotes: number;
  downvotes: number;
  userVote: "Upvote" | "Downvote" | null;
  voteId?: number;
};

export type VoteMap = {
  [targetId: number]: VoteSummary;
};

// export type VoteMapQuestion = {
//   [questionId: number]: VoteSummary;
// };

export type JwtPayload = {
  userId: number;
  username: string;
  role: string;
  imagePath: string | null;
  exp?: number; // トークンの有効期限
};
