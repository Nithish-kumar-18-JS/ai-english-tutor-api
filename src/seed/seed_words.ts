import { PrismaClient } from '@prisma/client';
const wordJson = require('./words.json');

const prisma = new PrismaClient({
  log: ['info', 'warn', 'error'],
});

interface WordData {
  word: string;
  level: string;
  partsOfSpeech: string;
  phonetics_text: string;
  phonetics_audio: string;
  definitions: string;
  synonyms: string;
  example_Sentence: string;
}

async function seedWords(): Promise<void> {
  console.log('📚 Starting vocabulary seeding...');
  console.log(`📖 Total words to process: ${wordJson.length}`);
  
  let count = 0;
  let skipped = 0;
  let errors = 0;

  for (const word of wordJson as WordData[]) {
    try {
      if(word.phonetics_audio && word.phonetics_text) {
        // Check if word already exists
        const existing = await prisma.vocabularyWords.findFirst({
          where: { word: word.word }
        });
        
        if (existing) {
          console.log(`⚠️  Word '${word.word}' already exists, skipping...`);
          skipped++;
          continue;
        }
        
        await prisma.vocabularyWords.create({
          data: {
            word: word.word,
            level: word.level,
            partOfSpeech: word.partsOfSpeech,
            definitions: word.definitions,
            exampleSentence: word.example_Sentence,
            phoneticsText: word.phonetics_text,
            phoneticsAudio: word.phonetics_audio
          }
        });
        
        count++;
        if (count % 100 === 0) {
          console.log(`✅ Processed ${count} words...`);
        }
      } else {
        console.log(`⚠️  Skipping '${word.word}' - missing phonetics data`);
        skipped++;
      }
    } catch (err: any) {
      console.error(`❌ Failed to insert ${word.word}: ${err.message}`);
      errors++;
    }
  }

  console.log(`\n📊 Seeding Summary:`);
  console.log(`   ✅ Successfully inserted: ${count} words`);
  console.log(`   ⚠️  Skipped: ${skipped} words`);
  console.log(`   ❌ Errors: ${errors} words`);
  console.log(`🎉 Vocabulary seeding completed!`);
}

async function main(): Promise<void> {
  try {
    await seedWords();
  } catch (error) {
    console.error('❌ Error during vocabulary seeding:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run if called directly
if (require.main === module) {
  main()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    });
}

export { main as default, main, seedWords };
