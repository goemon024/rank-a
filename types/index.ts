import { Question, Answer, QuestionTag, Comment } from "@prisma/client";

export type QuestionWithUserAndTags = Question & {
  user: { username: string };
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
  };
};

export type CommentWithUser = Comment & {
  user: {
    username: string;
    userId: number;
  };
};
