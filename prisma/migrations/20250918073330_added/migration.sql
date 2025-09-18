-- CreateTable
CREATE TABLE "public"."VocabuloryWords" (
    "id" SERIAL NOT NULL,
    "level" TEXT NOT NULL,
    "word" TEXT NOT NULL,
    "part_of_speech" TEXT NOT NULL,
    "example_Sentence" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VocabuloryWords_pkey" PRIMARY KEY ("id")
);
