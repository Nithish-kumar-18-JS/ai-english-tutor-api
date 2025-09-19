/*
  Warnings:

  - Added the required column `wordId` to the `UserWords` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."UserWords" ADD COLUMN     "wordId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."UserWords" ADD CONSTRAINT "UserWords_wordId_fkey" FOREIGN KEY ("wordId") REFERENCES "public"."VocabuloryWords"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
