// We use a basic word-matching logic for now. 
// A more robust app might use Levenshtein distance on words.
const stringSimilarity = require('string-similarity');

exports.calculateAccuracy = (original, transcript) => {
  const originalWords = original.toLowerCase().replace(/[.,!?;:]/g, '').split(/\s+/);
  const transcriptWords = transcript.toLowerCase().replace(/[.,!?;:]/g, '').split(/\s+/);

  let matchCount = 0;
  const missingWords = [];
  const incorrectWords = [];

  // Very naive word match for MVP
  originalWords.forEach((word) => {
    const foundIdx = transcriptWords.indexOf(word);
    if (foundIdx > -1) {
      matchCount++;
      // Remove from transcript to handle duplicates (naive)
      transcriptWords.splice(foundIdx, 1);
    } else {
      missingWords.push(word);
    }
  });

  // Remaining transcript words are considered incorrect/extra
  incorrectWords.push(...transcriptWords);

  const accuracy = originalWords.length > 0 
    ? Math.round((matchCount / originalWords.length) * 100) 
    : 0;

  return {
    accuracy,
    missingWords,
    incorrectWords
  };
};
