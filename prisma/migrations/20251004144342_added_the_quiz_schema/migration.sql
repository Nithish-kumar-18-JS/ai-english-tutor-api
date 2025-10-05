-- CreateTable
CREATE TABLE "public"."UserGeneratedQuiz" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "quiz" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserGeneratedQuiz_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."UserGeneratedQuiz" ADD CONSTRAINT "UserGeneratedQuiz_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
