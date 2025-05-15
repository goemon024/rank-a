-- CreateTable
CREATE TABLE "VoteQuestion" (
    "type" TEXT NOT NULL,
    "id" SERIAL NOT NULL,
    "question_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "VoteQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "VoteQuestion_question_id_user_id_key" ON "VoteQuestion"("question_id", "user_id");

-- AddForeignKey
ALTER TABLE "VoteQuestion" ADD CONSTRAINT "VoteQuestion_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "Question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VoteQuestion" ADD CONSTRAINT "VoteQuestion_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
