const { PrismaClient, WordStreakType, AchievementType } = require('@prisma/client');

const prisma = new PrismaClient({
  log: ['info', 'warn', 'error'],
});

const gamificationData = {
  streaks: {
    daily: [
      { days: 1, name: "Word Starter" },
      { days: 3, name: "Word Explorer" },
      { days: 7, name: "Word Builder" },
      { days: 14, name: "Word Collector" },
      { days: 30, name: "Word Warrior" },
      { days: 100, name: "Word Master" }
    ],
    weekly: [
      { weeks: 1, name: "Vocab Voyager" },
      { weeks: 2, name: "Lexicon Learner" },
      { weeks: 4, name: "Dictionary Diver" },
      { weeks: 8, name: "Grammar Gladiator" },
      { weeks: 12, name: "Vocabulary Virtuoso" }
    ],
    total: [
      { streaks: 10, name: "Word Rookie" },
      { streaks: 25, name: "Phrase Finder" },
      { streaks: 50, name: "Sentence Sage" },
      { streaks: 100, name: "Language Legend" }
    ]
  },
  achievements: {
    progress: [
      { words: 100, name: "Word Collector" },
      { words: 500, name: "Vocabulary Builder" },
      { words: 1000, name: "Wordsmith" },
      { words: 5000, name: "Language Architect" },
      { words: 10000, name: "Lexicon Master" }
    ],
    consistency: [
      { days: 7, name: "Consistency Champion" },
      { days: 30, name: "Unstoppable Learner" },
      { days: 100, name: "Century Streaker" },
      { days: 365, name: "Word Immortal" }
    ],
    special: [
      { event: "first_daily_goal", name: "First Step" },
      { event: "weekly_goal_4_in_a_row", name: "Goal Crusher" },
      { event: "double_daily_goal", name: "Overachiever" },
      { event: "complete_total_goal", name: "Mission Accomplished" }
    ]
  }
};

async function seedWordStreaks() {
  console.log('🎯 Seeding Word Streaks...');

  const streakData = [];

  gamificationData.streaks.daily.forEach(streak => {
    streakData.push({
      name: streak.name,
      type: WordStreakType.DAILY,
      goal: streak.days
    });
  });

  gamificationData.streaks.weekly.forEach(streak => {
    streakData.push({
      name: streak.name,
      type: WordStreakType.WEEKLY,
      goal: streak.weeks
    });
  });

  gamificationData.streaks.total.forEach(streak => {
    streakData.push({
      name: streak.name,
      type: WordStreakType.TOTAL,
      goal: streak.streaks
    });
  });

  // Insert all streak data using sequential upsert to avoid connection limits
  for (const streak of streakData) {
    try {
      await prisma.wordStreaks.upsert({
        where: { name: streak.name },
        update: streak,
        create: streak
      });
      console.log(`✓ Processed streak: ${streak.name}`);
    } catch (error) {
      console.error(`✗ Failed to process streak ${streak.name}:`, error.message);
      throw error;
    }
  }

  console.log(`✅ Created/updated ${streakData.length} word streaks`);
}

async function seedAchievements() {
  console.log('🏆 Seeding Achievements...');

  const achievementData = [];

  gamificationData.achievements.progress.forEach(ach => {
    achievementData.push({
      name: ach.name,
      type: AchievementType.PROGRESS,
      condition: { words: ach.words }
    });
  });

  gamificationData.achievements.consistency.forEach(ach => {
    achievementData.push({
      name: ach.name,
      type: AchievementType.CONSISTENCY,
      condition: { days: ach.days }
    });
  });

  gamificationData.achievements.special.forEach(ach => {
    achievementData.push({
      name: ach.name,
      type: AchievementType.SPECIAL,
      condition: { event: ach.event }
    });
  });

  // Insert all achievement data using sequential upsert to avoid connection limits
  for (const achievement of achievementData) {
    try {
      await prisma.achievement.upsert({
        where: { name: achievement.name },
        update: achievement,
        create: achievement
      });
      console.log(`✓ Processed achievement: ${achievement.name}`);
    } catch (error) {
      console.error(`✗ Failed to process achievement ${achievement.name}:`, error.message);
      throw error;
    }
  }

  console.log(`✅ Created/updated ${achievementData.length} achievements`);
}

async function main() {
  try {
    console.log('🚀 Starting gamification seeding...');
    await seedWordStreaks();
    await seedAchievements();

    const streakCount = await prisma.wordStreaks.count();
    const achievementCount = await prisma.achievement.count();

    console.log('\n📊 Summary:');
    console.log(`   Word Streaks: ${streakCount}`);
    console.log(`   Achievements: ${achievementCount}`);

    console.log('🎉 Gamification seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seeder
if (require.main === module) {
  main().catch(e => {
    console.error(e);
    process.exit(1);
  });
}

module.exports = { main, seedWordStreaks, seedAchievements };
