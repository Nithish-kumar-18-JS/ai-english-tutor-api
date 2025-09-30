/*
  Warnings:

  - Added the required column `phonetics_audio` to the `VocabuloryWords` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phonetics_text` to the `VocabuloryWords` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."VocabuloryWords" ADD COLUMN     "phonetics_audio" TEXT NOT NULL,
ADD COLUMN     "phonetics_text" TEXT NOT NULL;
