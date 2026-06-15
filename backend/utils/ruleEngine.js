// ============================================
// HUMANIZER RULE ENGINE v2 — Research-Backed
// 6 Layers: Phrases → Contractions → Lexical
//           → Burstiness → Punctuation → Score
// ============================================

// ─── LAYER 1: ROBOTIC PHRASE MAP ───────────────
const phraseMap = [
  // Formal transitions → conversational
  [/\bFurthermore\b/g, 'On top of that'],
  [/\bMoreover\b/g, "What's more"],
  [/\bIn addition\b/gi, 'Also'],
  [/\bAdditionally\b/g, 'Also'],
  [/\bIn conclusion\b/gi, 'All in all'],
  [/\bTo summarize\b/gi, 'In short'],
  [/\bIn summary\b/gi, 'To put it simply'],
  [/\bIn other words\b/gi, 'Put simply'],
  [/\bSubsequently\b/g, 'Then'],
  [/\bConsequently\b/g, 'As a result'],
  [/\bNevertheless\b/g, 'Still'],
  [/\bNotwithstanding\b/g, 'Even so'],
  [/\bHenceforth\b/g, 'From now on'],
  [/\bThereby\b/g, 'which means'],
  [/\bWherein\b/g, 'where'],
  [/\bHerein\b/g, 'here'],

  // Hedge/filler phrases → cut or simplify
  [/\bIt is important to note that\b/gi, 'Worth knowing —'],
  [/\bIt is worth noting that\b/gi, 'Interestingly,'],
  [/\bIt should be noted that\b/gi, 'Keep in mind that'],
  [/\bIt goes without saying that?\b/gi, 'Of course,'],
  [/\bIt is evident that\b/gi, 'Clearly,'],
  [/\bIt is clear that\b/gi, 'Clearly,'],
  [/\bIt is widely known that\b/gi, 'Most people know that'],
  [/\bNeedless to say[,]?\b/gi, ''],
  [/\bAs previously mentioned[,]?\b/gi, ''],
  [/\bAs mentioned earlier[,]?\b/gi, ''],
  [/\bAs stated above[,]?\b/gi, ''],
  [/\bFor all intents and purposes\b/gi, 'Basically'],
  [/\bAt this juncture\b/gi, 'Right now'],
  [/\bAt this point in time\b/gi, 'Now'],

  // Formal prepositions → simple
  [/\bIn order to\b/gi, 'To'],
  [/\bIn order for\b/gi, 'For'],
  [/\bDue to the fact that\b/gi, 'Because'],
  [/\bOwing to the fact that\b/gi, 'Because'],
  [/\bIn the event that\b/gi, 'If'],
  [/\bIn light of\b/gi, 'Given'],
  [/\bWith regard to\b/gi, 'About'],
  [/\bWith respect to\b/gi, 'For'],
  [/\bPrior to\b/gi, 'Before'],
  [/\bSubsequent to\b/gi, 'After'],

  // Formal verbs → natural
  [/\bUtili[zs]e\b/gi, 'use'],
  [/\bUtili[zs]ation\b/gi, 'use'],
  [/\bImplement\b/gi, 'set up'],
  [/\bFacilitate\b/gi, 'help'],
  [/\bEncompass\b/gi, 'cover'],
  [/\bDemonstrate\b/gi, 'show'],
  [/\bAscertain\b/gi, 'find out'],
  [/\bCommence\b/gi, 'start'],
  [/\bTerminate\b/gi, 'end'],
  [/\bObtain\b/gi, 'get'],
  [/\bAcquire\b/gi, 'get'],
  [/\bPurchase\b/gi, 'buy'],
  [/\bPossess\b/gi, 'have'],
  [/\bRequire\b/gi, 'need'],
  [/\bAttempt\b/gi, 'try'],
  [/\bEndeavour\b/gi, 'try'],
  [/\bEndevour\b/gi, 'try'],
  [/\bInquire\b/gi, 'ask'],
  [/\bCommunicate\b/gi, 'tell'],
  [/\bElucidate\b/gi, 'explain'],
  [/\bDelineate\b/gi, 'outline'],
  [/\bProliferate\b/gi, 'spread'],
  [/\bAmalgamate\b/gi, 'combine'],
  [/\bExacerbate\b/gi, 'worsen'],
  [/\bMitigate\b/gi, 'reduce'],
  [/\bPrecipitate\b/gi, 'cause'],

  // AI "signature" words (detectors know these)
  [/\bDelve\b/gi, 'explore'],
  [/\bDelving\b/gi, 'exploring'],
  [/\bUnlock\b/gi, 'open up'],
  [/\bRobust\b/gi, 'strong'],
  [/\bSeamless(ly)?\b/gi, 'smooth$1'],
  [/\bLeverage\b/gi, 'use'],
  [/\bLeveraging\b/gi, 'using'],
  [/\bSynerg(y|ies|ize)\b/gi, (m) => m.includes('iz') ? 'combine' : 'teamwork'],
  [/\bEmpowering\b/gi, 'helping'],
  [/\bGamechanger\b/gi, 'big shift'],
  [/\bGame-changer\b/gi, 'big shift'],
  [/\bPivotal\b/gi, 'key'],
  [/\bParadigm shift\b/gi, 'major change'],
  [/\bCutting-edge\b/gi, 'latest'],
  [/\bState-of-the-art\b/gi, 'latest'],
  [/\bGroundbreaking\b/gi, 'new'],
  [/\bInnovative\b/gi, 'new'],
  [/\bRevolutionary\b/gi, 'major'],
  [/\bTransformative\b/gi, 'significant'],
  [/\bHolistic\b/gi, 'overall'],
  [/\bNuanced\b/gi, 'subtle'],
  [/\bComprehensive\b/gi, 'thorough'],
  [/\bEnsure\b/gi, 'make sure'],
  [/\bEnsuring\b/gi, 'making sure'],
  [/\bFoster\b/gi, 'build'],
  [/\bFostering\b/gi, 'building'],
  [/\bSpearhead\b/gi, 'lead'],
  [/\bTapestry\b/gi, 'mix'],
  [/\bLandscape\b/gi, 'field'],
  [/\bin today\'s world\b/gi, 'today'],
  [/\bin the modern world\b/gi, 'today'],
  [/\bin today's fast-paced world\b/gi, 'these days'],
  [/\bin conclusion,?\b/gi, 'To wrap up,'],
];

// ─── LAYER 2: CONTRACTIONS ──────────────────────
const contractions = [
  [/\bdo not\b/gi, "don't"],
  [/\bdoes not\b/gi, "doesn't"],
  [/\bdid not\b/gi, "didn't"],
  [/\bcannot\b/gi, "can't"],
  [/\bwill not\b/gi, "won't"],
  [/\bwould not\b/gi, "wouldn't"],
  [/\bshould not\b/gi, "shouldn't"],
  [/\bcould not\b/gi, "couldn't"],
  [/\bmust not\b/gi, "mustn't"],
  [/\bhave not\b/gi, "haven't"],
  [/\bhas not\b/gi, "hasn't"],
  [/\bhad not\b/gi, "hadn't"],
  [/\bwere not\b/gi, "weren't"],
  [/\bare not\b/gi, "aren't"],
  [/\bwas not\b/gi, "wasn't"],
  [/\bI am\b/g, "I'm"],
  [/\bI have\b/g, "I've"],
  [/\bI will\b/g, "I'll"],
  [/\bI would\b/g, "I'd"],
  [/\bwe are\b/gi, "we're"],
  [/\bwe have\b/gi, "we've"],
  [/\bwe will\b/gi, "we'll"],
  [/\bthey are\b/gi, "they're"],
  [/\bthey have\b/gi, "they've"],
  [/\bthey will\b/gi, "they'll"],
  [/\bit is\b/gi, "it's"],
  [/\bthat is\b/gi, "that's"],
  [/\bthere is\b/gi, "there's"],
  [/\bhere is\b/gi, "here's"],
  [/\bwhat is\b/gi, "what's"],
  [/\bwho is\b/gi, "who's"],
  [/\bhe is\b/gi, "he's"],
  [/\bshe is\b/gi, "she's"],
  [/\byou are\b/gi, "you're"],
  [/\byou have\b/gi, "you've"],
  [/\byou will\b/gi, "you'll"],
];

// ─── LAYER 3: LEXICAL DIVERSITY (TTR booster) ──
// Synonym pools — randomly pick alternatives
// This directly increases Type-Token Ratio
const synonymPools = [
  { pattern: /\bvery important\b/gi, alts: ['crucial', 'critical', 'essential', 'key'] },
  { pattern: /\bimportant\b/gi, alts: ['key', 'critical', 'essential', 'significant', 'major'] },
  { pattern: /\bsignificant\b/gi, alts: ['notable', 'major', 'substantial', 'meaningful'] },
  { pattern: /\bhowever\b/gi, alts: ['but', 'yet', 'still', 'that said', 'even so'] },
  { pattern: /\bshows\b/gi, alts: ['reveals', 'indicates', 'suggests', 'points to'] },
  { pattern: /\bhelps\b/gi, alts: ['supports', 'aids', 'assists', 'makes it easier'] },
  { pattern: /\bmany\b/gi, alts: ['several', 'numerous', 'a number of', 'quite a few'] },
  { pattern: /\buse\b/gi, alts: ['apply', 'work with', 'rely on', 'turn to'] },
  { pattern: /\bstart\b/gi, alts: ['begin', 'kick off', 'get going with', 'open with'] },
  { pattern: /\bproblem\b/gi, alts: ['issue', 'challenge', 'hurdle', 'difficulty'] },
  { pattern: /\bsolution\b/gi, alts: ['fix', 'answer', 'approach', 'way forward'] },
  { pattern: /\ballow\b/gi, alts: ['let', 'enable', 'make it possible to', 'give the ability to'] },
  { pattern: /\bcreate\b/gi, alts: ['build', 'develop', 'produce', 'put together'] },
  { pattern: /\bchange\b/gi, alts: ['shift', 'alter', 'adjust', 'reshape'] },
  { pattern: /\bimprove\b/gi, alts: ['boost', 'enhance', 'strengthen', 'upgrade'] },
  { pattern: /\bunderstand\b/gi, alts: ['grasp', 'see', 'recognize', 'get a handle on'] },
  { pattern: /\bconsider\b/gi, alts: ['think about', 'look at', 'weigh', 'keep in mind'] },
  { pattern: /\bprovide\b/gi, alts: ['give', 'offer', 'deliver', 'supply'] },
  { pattern: /\binclude\b/gi, alts: ['cover', 'involve', 'feature', 'take in'] },
  { pattern: /\bsuccessful\b/gi, alts: ['effective', 'productive', 'working', 'solid'] },
];

function applyLexicalDiversity(text) {
  let result = text;
  // Only replace ~40% of matches to avoid over-editing
  synonymPools.forEach(({ pattern, alts }) => {
    result = result.replace(pattern, (match) => {
      if (Math.random() > 0.4) return match; // keep original 60% of time
      const alt = alts[Math.floor(Math.random() * alts.length)];
      // Preserve original casing
      if (match[0] === match[0].toUpperCase()) {
        return alt.charAt(0).toUpperCase() + alt.slice(1);
      }
      return alt;
    });
  });
  return result;
}

// ─── LAYER 4: BURSTINESS ENGINE ─────────────────
// AI text: sentences cluster 15-20 words, low variance
// Human text: aggressive alternation short ↔ long
function applyBurstiness(text) {
  const sentenceRegex = /([^.!?]*[.!?]+)/g;
  const sentences = text.match(sentenceRegex);
  if (!sentences || sentences.length < 3) return text;

  const result = [];
  for (let i = 0; i < sentences.length; i++) {
    const s = sentences[i].trim();
    const words = s.split(/\s+/);
    const len = words.length;

    // Long sentence (18+ words) → split at natural conjunction
    if (len > 18) {
      const splitWords = ['which', 'where', 'while', 'and', 'but', 'because', 'although', 'since', 'as'];
      let splitIdx = -1;

      for (const sw of splitWords) {
        const idx = words.findIndex((w, j) => j > 5 && j < len - 3 && w.toLowerCase() === sw);
        if (idx !== -1) { splitIdx = idx; break; }
      }

      if (splitIdx !== -1) {
        const p1 = words.slice(0, splitIdx).join(' ').replace(/[,]$/, '') + '.';
        const p2 = words.slice(splitIdx).join(' ');
        const p2cap = p2.charAt(0).toUpperCase() + p2.slice(1);
        result.push(p1);
        result.push(p2cap);
        continue;
      }
    }

    // Short sentence (4-7 words) → occasionally merge with next
    if (len < 7 && i < sentences.length - 1) {
      const nextWords = sentences[i + 1].trim().split(/\s+/).length;
      if (nextWords < 10 && Math.random() > 0.6) {
        const merged = s.replace(/[.!?]$/, '') + ', ' + sentences[i + 1].trim().charAt(0).toLowerCase() + sentences[i + 1].trim().slice(1);
        result.push(merged);
        i++; // skip next
        continue;
      }
    }

    result.push(s);
  }

  return result.join(' ');
}

// ─── LAYER 5: PUNCTUATION HUMANIZER ─────────────
// Humans use dashes, parentheses, colons naturally
// AI almost never does
function applyPunctuation(text) {
  let result = text;

  // Add em-dash for strong parenthetical breaks (occasionally)
  result = result.replace(
    /,\s(which\s(?:is|was|are|were)\s[^,]{5,25}),/g,
    (match, inner) => Math.random() > 0.5 ? ` — ${inner.trim()} —` : match
  );

  // Add parenthetical asides (occasional)
  result = result.replace(
    /\b(for example|for instance)\b/gi,
    (m) => Math.random() > 0.6 ? `(${m})` : m
  );

  // Serial comma consistency (humans are inconsistent — good)
  result = result.replace(/(\w+), (\w+) and (\w+)/g,
    (m, a, b, c) => Math.random() > 0.5 ? `${a}, ${b}, and ${c}` : m
  );

  return result;
}

// ─── LAYER 6: AI DETECTION SCORE ────────────────
// Composite score based on research-backed signals
function getAIScore(text) {
  let score = 0;
  const lower = text.toLowerCase();
  const words = text.split(/\s+/);
  const wordCount = words.length;

  // Signal 1: Known robotic markers (weighted)
  const highWeightMarkers = [
    'furthermore', 'moreover', 'in conclusion', 'it is important to note',
    'it is worth noting', 'it should be noted', 'delve', 'robust',
    'seamlessly', 'leverage', 'paradigm', 'holistic', 'nuanced',
    'groundbreaking', 'transformative', 'in today\'s world'
  ];
  const lowWeightMarkers = [
    'additionally', 'subsequently', 'consequently', 'utilize', 'facilitate',
    'demonstrate', 'ensure', 'comprehensive', 'innovative', 'significant'
  ];
  highWeightMarkers.forEach(m => { if (lower.includes(m)) score += 10; });
  lowWeightMarkers.forEach(m => { if (lower.includes(m)) score += 4; });

  // Signal 2: Burstiness — sentence length variance
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
  if (sentences.length >= 3) {
    const lengths = sentences.map(s => s.split(/\s+/).length);
    const avg = lengths.reduce((a, b) => a + b, 0) / lengths.length;
    const variance = lengths.reduce((a, b) => a + Math.pow(b - avg, 2), 0) / lengths.length;
    if (variance < 8) score += 25;       // very uniform = very AI
    else if (variance < 15) score += 12; // somewhat uniform
  }

  // Signal 3: Type-Token Ratio (lexical diversity)
  const uniqueWords = new Set(words.map(w => w.toLowerCase().replace(/[^a-z]/g, '')));
  const ttr = uniqueWords.size / wordCount;
  if (ttr < 0.4) score += 20; // very repetitive vocab
  else if (ttr < 0.55) score += 10;

  // Signal 4: Contraction density (humans use contractions)
  const contractionMatches = (text.match(/\b(don't|doesn't|didn't|can't|won't|wouldn't|shouldn't|couldn't|haven't|hasn't|I'm|it's|that's|we're|they're|you're|I've|we've|I'll|we'll)\b/gi) || []).length;
  const contractionRatio = contractionMatches / wordCount;
  if (contractionRatio < 0.008) score += 15; // no contractions = AI

  // Signal 5: Avg sentence length (AI: 15-20 words/sentence)
  if (sentences.length > 0) {
    const avgLen = words.length / sentences.length;
    if (avgLen > 18 && avgLen < 22) score += 10; // suspiciously uniform AI range
  }

  // Signal 6: Punctuation diversity
  const dashCount = (text.match(/—|–/g) || []).length;
  const parenCount = (text.match(/\(/g) || []).length;
  if (dashCount === 0 && parenCount === 0 && wordCount > 100) score += 8;

  return Math.min(score, 100);
}

// ─── MAIN EXPORT ─────────────────────────────────
function applyRules(text) {
  let result = text;

  // Layer 1: Phrase replacement
  phraseMap.forEach(([from, to]) => {
    result = result.replace(from, to);
  });

  // Layer 2: Contractions
  contractions.forEach(([from, to]) => {
    result = result.replace(from, to);
  });

  // Layer 3: Lexical diversity
  result = applyLexicalDiversity(result);

  // Layer 4: Burstiness
  result = applyBurstiness(result);

  // Layer 5: Punctuation
  result = applyPunctuation(result);

  // Cleanup
  result = result.replace(/\s{2,}/g, ' ').replace(/\s+([.,!?])/g, '$1').trim();

  return result;
}

module.exports = { applyRules, getAIScore };