import wordJson from "./words.json" assert { type: "json" };
import axios from "axios";
import { writeFileSync } from "fs";

const buildVocabulary = async () => {
  let vocabulary = [];

  const chunkSize = 5;
  for (let start = 0; start < 10; start += chunkSize) {
    const chunk = wordJson.slice(start, start + chunkSize);

    console.log(`📦 Processing words ${start + 1} to ${start + chunk.length}...`);

    for (let i = 0; i < chunk.length; i++) {
      const { word, part_of_speech, level, synonyms, example_Sentence } = chunk[i];

      try {
        const response = await axios.get(
          `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
        );
        let responseData = response.data[0];

        let phonetics_text = "";
        let phonetics_audio = "";
        let definitions = "";

        // Find UK phonetics
        for (let j = 0; j < responseData.phonetics.length; j++) {
          if (
            responseData.phonetics[j].audio &&
            responseData.phonetics[j].audio.includes("uk")
          ) {
            phonetics_text = responseData.phonetics[j].text;
            phonetics_audio = responseData.phonetics[j].audio;
            break;
          }
        }

        // Find matching definition
        for (let j = 0; j < responseData.meanings.length; j++) {
          if (responseData.meanings[j].partOfSpeech === part_of_speech.toLowerCase()) {
            definitions = responseData.meanings[j].definitions[0].definition;
            break;
          }
        }

        vocabulary.push({
          word: responseData.word,
          level,
          partsOfSpeech: part_of_speech,
          phonetics_text,
          phonetics_audio,
          definitions,
          synonyms,
          example_Sentence,
        });
      } catch (error) {
        console.error(`❌ Error fetching ${word}:`, error.message);
      }
    }

    // Save progress after each chunk
    writeFileSync("vocabulary.json", JSON.stringify(vocabulary, null, 2), "utf-8");
    console.log(`✅ Saved progress up to word ${start + chunk.length}`);
  }

  return vocabulary;
};

buildVocabulary().then((result) => {
  console.log(`🎉 Vocabulary built with ${result.length} entries`);
});
