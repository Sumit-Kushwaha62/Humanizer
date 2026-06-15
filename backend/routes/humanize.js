const express = require('express');
const multer = require('multer');
const router = express.Router();
const { applyRules, getAIScore } = require('../utils/ruleEngine');
const { chunkText } = require('../utils/chunker');
const { humanizeText } = require('../utils/gemini');
const { extractText } = require('../utils/fileParser');

const upload = multer({ storage: multer.memoryStorage() });

// Helper to handle humanization logic and stats
async function processHumanization(text, mode) {
  const scoreBefore = getAIScore(text);
  const afterRules = applyRules(text);
  const scoreAfterRules = getAIScore(afterRules);

  let result;
  let apiCallMade = false;

  if (scoreAfterRules < 25 || mode === 'standard') {
    console.log('Rules sufficient or standard mode. Skipping AI call.');
    result = afterRules;
  } else {
    console.log('Score high and aggressive mode. Using AI...');
    const chunks = chunkText(afterRules, 500);
    const humanizedChunks = [];

    for (const chunk of chunks) {
      const humanized = await humanizeText(chunk, mode);
      humanizedChunks.push(humanized);
      if (chunks.length > 1) await new Promise(r => setTimeout(r, 1000));
    }
    result = humanizedChunks.join('\n\n');
    apiCallMade = true;
  }

  const finalScoreAfter = getAIScore(result);

  return {
    result,
    stats: {
      scoreBefore: scoreBefore,
      scoreAfter: finalScoreAfter,
      method: apiCallMade ? 'ai' : 'rules',
      wordCount: text.trim().split(/\s+/).length,
      apiCallMade: apiCallMade
    }
  };
}

// Plain text route
router.post('/text', async (req, res) => {
  try {
    const { text, mode } = req.body;
    if (!text) return res.status(400).json({ error: 'Text required' });

    const response = await processHumanization(text, mode);
    res.json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Humanization failed' });
  }
});

// File upload route
router.post('/file', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'File required' });
    const text = await extractText(req.file.buffer, req.file.mimetype);
    const mode = req.body.mode || 'standard';

    const response = await processHumanization(text, mode);
    res.json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'File processing failed' });
  }
});

module.exports = router;
