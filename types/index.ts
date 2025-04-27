import { Question, User, QuestionTag } from "@prisma/client"

export type QuestionWithUserAndTags = Question & {
    user: { username: string };
    questionTags: QuestionTag[];
}

export interface NavLinks {
    label: string
    href: string
}
