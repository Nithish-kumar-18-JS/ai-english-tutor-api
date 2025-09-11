/*
  Warnings:

  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "public"."User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");

-- CreateTable
CREATE TABLE "public"."OnBoardingQuestions" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "english_proficiency_goal" TEXT NOT NULL,
    "why_are_learning_english" TEXT NOT NULL,
    "english_level" TEXT NOT NULL,
    "time_spent_english" TEXT NOT NULL,
    "streak_alerts" BOOLEAN NOT NULL,
    "quick_challenge" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OnBoardingQuestions_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."OnBoardingQuestions" ADD CONSTRAINT "OnBoardingQuestions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
