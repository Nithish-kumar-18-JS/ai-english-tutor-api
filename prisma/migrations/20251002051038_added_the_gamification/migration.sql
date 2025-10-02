-- CreateEnum
CREATE TYPE "public"."WordStreakType" AS ENUM ('DAILY', 'WEEKLY', 'TOTAL', 'ACHIEVEMENT');

-- CreateEnum
CREATE TYPE "public"."AchievementType" AS ENUM ('PROGRESS', 'CONSISTENCY', 'SPECIAL');

-- CreateEnum
CREATE TYPE "public"."UserWordStatus" AS ENUM ('LEARNED', 'SAVED');

-- CreateTable
CREATE TABLE "public"."User" (
    "id" SERIAL NOT NULL,
    "firebaseUid" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "picture" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."OnBoardingQuestions" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "englishProficiencyGoal" TEXT NOT NULL,
    "whyLearningEnglish" TEXT NOT NULL,
    "englishLevel" TEXT NOT NULL,
    "timeSpentEnglish" TEXT NOT NULL,
    "streakAlerts" BOOLEAN NOT NULL,
    "quickChallenge" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OnBoardingQuestions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."TodaySessionVocabWords" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "wordId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TodaySessionVocabWords_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."TrackWeeklyWordsGoals" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "dailyGoal" INTEGER NOT NULL,
    "weeklyGoal" INTEGER NOT NULL,
    "dailyProgress" INTEGER NOT NULL,
    "weeklyProgress" INTEGER NOT NULL,
    "totalGoal" INTEGER NOT NULL,
    "totalProgress" INTEGER NOT NULL,

    CONSTRAINT "TrackWeeklyWordsGoals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."UserWordStreaks" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "wordStreakId" INTEGER NOT NULL,
    "currentStreak" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserWordStreaks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."WordStreaks" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "type" "public"."WordStreakType" NOT NULL,
    "goal" INTEGER NOT NULL,

    CONSTRAINT "WordStreaks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Achievement" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type" "public"."AchievementType" NOT NULL,
    "condition" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Achievement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."UserAchievements" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "achievementId" INTEGER NOT NULL,
    "unlockedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserAchievements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."VocabularyWords" (
    "id" SERIAL NOT NULL,
    "level" TEXT NOT NULL,
    "word" TEXT NOT NULL,
    "partOfSpeech" TEXT NOT NULL,
    "exampleSentence" TEXT NOT NULL,
    "phoneticsText" TEXT NOT NULL,
    "phoneticsAudio" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VocabularyWords_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."UserWords" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "wordId" INTEGER NOT NULL,
    "status" "public"."UserWordStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserWords_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_firebaseUid_key" ON "public"."User"("firebaseUid");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "UserWordStreaks_userId_wordStreakId_key" ON "public"."UserWordStreaks"("userId", "wordStreakId");

-- CreateIndex
CREATE UNIQUE INDEX "WordStreaks_name_key" ON "public"."WordStreaks"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Achievement_name_key" ON "public"."Achievement"("name");

-- CreateIndex
CREATE UNIQUE INDEX "UserAchievements_userId_achievementId_key" ON "public"."UserAchievements"("userId", "achievementId");

-- AddForeignKey
ALTER TABLE "public"."OnBoardingQuestions" ADD CONSTRAINT "OnBoardingQuestions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TodaySessionVocabWords" ADD CONSTRAINT "TodaySessionVocabWords_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TodaySessionVocabWords" ADD CONSTRAINT "TodaySessionVocabWords_wordId_fkey" FOREIGN KEY ("wordId") REFERENCES "public"."VocabularyWords"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TrackWeeklyWordsGoals" ADD CONSTRAINT "TrackWeeklyWordsGoals_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserWordStreaks" ADD CONSTRAINT "UserWordStreaks_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserWordStreaks" ADD CONSTRAINT "UserWordStreaks_wordStreakId_fkey" FOREIGN KEY ("wordStreakId") REFERENCES "public"."WordStreaks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserAchievements" ADD CONSTRAINT "UserAchievements_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserAchievements" ADD CONSTRAINT "UserAchievements_achievementId_fkey" FOREIGN KEY ("achievementId") REFERENCES "public"."Achievement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserWords" ADD CONSTRAINT "UserWords_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserWords" ADD CONSTRAINT "UserWords_wordId_fkey" FOREIGN KEY ("wordId") REFERENCES "public"."VocabularyWords"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
