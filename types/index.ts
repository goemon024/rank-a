import { Question, Answer, QuestionTag, Comment, Vote } from "@prisma/client";

export type QuestionWithUserAndTags = Question & {
  user: {
    username: string;
    imagePath: string | null;
  };
  questionTags: QuestionTag[];
};

export interface NavLinks {
  label: string;
  href: string;
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

export type VoteSummary = {
  upvotes: number;
  downvotes: number;
  userVote: "Upvote" | "Downvote" | null;
  voteId?: number;
};

export type VoteMap = {
  [answerId: number]: VoteSummary;
};
