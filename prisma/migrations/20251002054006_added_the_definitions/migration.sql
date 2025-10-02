/*
  Warnings:

  - Added the required column `definitions` to the `VocabularyWords` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."VocabularyWords" ADD COLUMN     "definitions" TEXT NOT NULL;
