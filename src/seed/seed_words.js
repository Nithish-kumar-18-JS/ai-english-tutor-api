import { PrismaClient } from "@prisma/client";
import wordJson from "./words.json" assert { type: "json" };

const prisma = new PrismaClient();

async function main() {
  console.log(`🌱 Starting seeding...`);
  let count = 0;

  for (const word of vocabulary) {
    try {
      await prisma.VocabuloryWords.create({
        data: {
          word: word.word,
          level:word.level,
          part_of_speech:word.part_of_speech,
          example_Sentence:word.example_Sentence,
        },
      });
      count++;
    } catch (err) {
      console.error(`❌ Failed to insert ${word.word}: ${err.message}`);
    }
  }

  console.log(`✅ Done! Inserted ${count} words.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
