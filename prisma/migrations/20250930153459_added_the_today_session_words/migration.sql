-- CreateTable
CREATE TABLE "public"."TodaySessionVocabWords" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "wordId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TodaySessionVocabWords_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."TodaySessionVocabWords" ADD CONSTRAINT "TodaySessionVocabWords_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TodaySessionVocabWords" ADD CONSTRAINT "TodaySessionVocabWords_wordId_fkey" FOREIGN KEY ("wordId") REFERENCES "public"."VocabuloryWords"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
