-- CreateEnum
CREATE TYPE "public"."UserWordStatus" AS ENUM ('LEARNED', 'SAVED');

-- CreateTable
CREATE TABLE "public"."UserWords" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "status" "public"."UserWordStatus"[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserWords_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."UserWords" ADD CONSTRAINT "UserWords_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
