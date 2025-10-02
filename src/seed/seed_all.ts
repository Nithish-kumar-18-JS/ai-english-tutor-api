import { PrismaClient } from '@prisma/client';
import { main as seedGamification } from './seed_gamification';
// import { main as seedWords } from './seed_words';

const prisma = new PrismaClient();

async function seedAll() {
  try {
    console.log('🌱 Starting complete database seeding...');
    console.log('='.repeat(50));
    
    // Run gamification seeding
    await seedGamification();
    
    // Run vocabulary seeding (using require for now)
    const { main: seedWords } = require('./seed_words.js');
    await seedWords();
    
    // Add other seeders here as needed
    // await seedUsers();
    
    console.log('='.repeat(50));
    console.log('🎉 All seeding completed successfully!');
    
    // Final summary
    const counts = {
      wordStreaks: await prisma.wordStreaks.count(),
      achievements: await prisma.achievement.count(),
      vocabularyWords: await prisma.vocabularyWords.count(),
      users: await prisma.user.count(),
    };
    
    console.log('\n📊 Final Database Summary:');
    console.log(`   Word Streaks: ${counts.wordStreaks}`);
    console.log(`   Achievements: ${counts.achievements}`);
    console.log(`   Vocabulary Words: ${counts.vocabularyWords}`);
    console.log(`   Users: ${counts.users}`);
    
  } catch (error) {
    console.error('❌ Error during complete seeding:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run if called directly
if (require.main === module) {
  seedAll()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    });
}

export default seedAll;
