// 500 words per chunk
function chunkText(text, wordsPerChunk = 500) {
  const words = text.split(' ');
  const chunks = [];

  for (let i = 0; i < words.length; i += wordsPerChunk) {
    chunks.push(words.slice(i, i + wordsPerChunk).join(' '));
  }
  return chunks;
}

module.exports = { chunkText };