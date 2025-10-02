const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const wordJson = require('../../vocabulary.json');

const prisma = new PrismaClient({
  log: ['info', 'warn', 'error'],
});

const missedWordsFile = path.join(__dirname, 'missed_phonetics.json');

async function seedWords() {
  console.log(`🌱 Starting vocabulary seeding...`);
  console.log(`📚 Total words to process: ${wordJson.length}`);
  
  let count = 0;
  let skipped = 0;
  let errors = 0;
  const missedPhonetics = [];

  for (const word of wordJson) {
    try {
        // Check if word already exists
        const existing = await prisma.vocabularyWords.findFirst({
          where: { word: word.word }
        });
        
        if (existing) {
          // console.log(`⚠️  Word '${word.word}' already exists, skipping...`);
          skipped++;
          continue;
        }
        
        await prisma.vocabularyWords.create({
          data: {
            word: word.word,
            level: word.level,
            partOfSpeech: word.partsOfSpeech ? word.partsOfSpeech : "",
            exampleSentence: word.example_Sentence ? word.example_Sentence : "",
            phoneticsText: word.phonetics_text ? word.phonetics_text : "",
            definitions: word.definitions ? word.definitions : "",
            phoneticsAudio: word.phonetics_audio ? word.phonetics_audio : ""
          }
        });
        
        count++;
        if (count % 100 === 0) {
          console.log(`✅ Processed ${count} words...`);
        }
 
    } catch (err) {
      console.error(`❌ Failed to insert ${word.word}: ${err.message}`);
      errors++;
    }
  }

  // Save missed phonetics words to JSON
  if (missedPhonetics.length > 0) {
    fs.writeFileSync(missedWordsFile, JSON.stringify(missedPhonetics, null, 2), 'utf-8');
    console.log(`📂 Exported ${missedPhonetics.length} words with missing phonetics to: ${missedWordsFile}`);
  }

  console.log(`\n📊 Seeding Summary:`);
  console.log(`   ✅ Successfully inserted: ${count} words`);
  console.log(`   ⚠️  Skipped (including missing phonetics): ${skipped} words`);
  console.log(`   ❌ Errors: ${errors} words`);
  console.log(`🎉 Vocabulary seeding completed!`);
}

async function main() {
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

module.exports = { main, seedWords };
