import { PrismaClient, WordStreakType, AchievementType } from '@prisma/client';

const prisma = new PrismaClient();

interface GamificationData {
  streaks: {
    daily: Array<{ days: number; name: string }>;
    weekly: Array<{ weeks: number; name: string }>;
    total: Array<{ streaks: number; name: string }>;
  };
  achievements: {
    progress: Array<{ words: number; name: string }>;
    consistency: Array<{ days: number; name: string }>;
    special: Array<{ event: string; name: string }>;
  };
}

const gamificationData: GamificationData = {
  "streaks": {
    "daily": [
      { "days": 1, "name": "Word Starter" },
      { "days": 3, "name": "Word Explorer" },
      { "days": 7, "name": "Word Builder" },
      { "days": 14, "name": "Word Collector" },
      { "days": 30, "name": "Word Warrior" },
      { "days": 100, "name": "Word Master" }
    ],
    "weekly": [
      { "weeks": 1, "name": "Vocab Voyager" },
      { "weeks": 2, "name": "Lexicon Learner" },
      { "weeks": 4, "name": "Dictionary Diver" },
      { "weeks": 8, "name": "Grammar Gladiator" },
      { "weeks": 12, "name": "Vocabulary Virtuoso" }
    ],
    "total": [
      { "streaks": 10, "name": "Word Rookie" },
      { "streaks": 25, "name": "Phrase Finder" },
      { "streaks": 50, "name": "Sentence Sage" },
      { "streaks": 100, "name": "Language Legend" }
    ]
  },
  "achievements": {
    "progress": [
      { "words": 100, "name": "Word Collector" },
      { "words": 500, "name": "Vocabulary Builder" },
      { "words": 1000, "name": "Wordsmith" },
      { "words": 5000, "name": "Language Architect" },
      { "words": 10000, "name": "Lexicon Master" }
    ],
    "consistency": [
      { "days": 7, "name": "Consistency Champion" },
      { "days": 30, "name": "Unstoppable Learner" },
      { "days": 100, "name": "Century Streaker" },
      { "days": 365, "name": "Word Immortal" }
    ],
    "special": [
      { "event": "first_daily_goal", "name": "First Step" },
      { "event": "weekly_goal_4_in_a_row", "name": "Goal Crusher" },
      { "event": "double_daily_goal", "name": "Overachiever" },
      { "event": "complete_total_goal", "name": "Mission Accomplished" }
    ]
  }
};

async function seedWordStreaks(): Promise<void> {
  console.log('🎯 Seeding Word Streaks...');
  
  const streakData: Array<{
    name: string;
    type: WordStreakType;
    goal: number;
  }> = [];
  
  // Daily streaks
  gamificationData.streaks.daily.forEach(streak => {
    streakData.push({
      name: streak.name,
      type: WordStreakType.DAILY,
      goal: streak.days
    });
  });
  
  // Weekly streaks
  gamificationData.streaks.weekly.forEach(streak => {
    streakData.push({
      name: streak.name,
      type: WordStreakType.WEEKLY,
      goal: streak.weeks
    });
  });
  
  // Total streaks
  gamificationData.streaks.total.forEach(streak => {
    streakData.push({
      name: streak.name,
      type: WordStreakType.TOTAL,
      goal: streak.streaks
    });
  });
  
  // Insert all streak data
  for (const streak of streakData) {
    await prisma.wordStreaks.upsert({
      where: {
        name: streak.name
      },
      update: streak,
      create: streak
    });
  }
  
  console.log(`✅ Created ${streakData.length} word streaks`);
}

async function seedAchievements(): Promise<void> {
  console.log('🏆 Seeding Achievements...');
  
  const achievementData: Array<{
    name: string;
    type: AchievementType;
    condition: Record<string, any>;
  }> = [];
  
  // Progress achievements
  gamificationData.achievements.progress.forEach(achievement => {
    achievementData.push({
      name: achievement.name,
      type: AchievementType.PROGRESS,
      condition: { words: achievement.words }
    });
  });
  
  // Consistency achievements
  gamificationData.achievements.consistency.forEach(achievement => {
    achievementData.push({
      name: achievement.name,
      type: AchievementType.CONSISTENCY,
      condition: { days: achievement.days }
    });
  });
  
  // Special achievements
  gamificationData.achievements.special.forEach(achievement => {
    achievementData.push({
      name: achievement.name,
      type: AchievementType.SPECIAL,
      condition: { event: achievement.event }
    });
  });
  
  // Insert all achievement data
  for (const achievement of achievementData) {
    await prisma.achievement.upsert({
      where: {
        name: achievement.name
      },
      update: achievement,
      create: achievement
    });
  }
  
  console.log(`✅ Created ${achievementData.length} achievements`);
}

async function main(): Promise<void> {
  try {
    console.log('🚀 Starting gamification seeding...');
    
    await seedWordStreaks();
    await seedAchievements();
    
    console.log('🎉 Gamification seeding completed successfully!');
    
    // Display summary
    const streakCount = await prisma.wordStreaks.count();
    const achievementCount = await prisma.achievement.count();
    
    console.log('\n📊 Summary:');
    console.log(`   Word Streaks: ${streakCount}`);
    console.log(`   Achievements: ${achievementCount}`);
    
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seeder
if (require.main === module) {
  main()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    });
}

export { main, seedWordStreaks, seedAchievements };
