// ================================================
// HINDI HUMANIZER RULE ENGINE — Research-Backed v2
// Based on: Tatsam→Tadbhav conversion +
//           Colloquial particle injection +  
//           AI phrase elimination
// ================================================

// ── LAYER 1: TATSAM → TADBHAV / COLLOQUIAL ──────
// AI uses Sanskrit-origin (tatsam) words
// Real spoken Hindi uses tadbhav/Urdu-origin words
// Source: Linguistic analysis of ChatGPT Hindi output patterns

const tatsamToColloquial = [
  // Core verbs — most common AI tatsam verbs
  [/प्रदान करता है/g, 'देता है'],
  [/प्रदान करती है/g, 'देती है'],
  [/प्रदान करते हैं/g, 'देते हैं'],
  [/प्रदान करना/g, 'देना'],
  [/प्रदान करें/g, 'दें'],
  [/प्रदान किया/g, 'दिया'],
  [/प्रदान की/g, 'दी'],

  [/सुनिश्चित करना/g, 'पक्का करना'],
  [/सुनिश्चित करें/g, 'पक्का करें'],
  [/सुनिश्चित करता है/g, 'पक्का करता है'],
  [/सुनिश्चित किया/g, 'पक्का किया'],
  [/सुनिश्चित हो/g, 'पक्का हो'],

  [/उपयोग करना/g, 'इस्तेमाल करना'],
  [/उपयोग करें/g, 'इस्तेमाल करें'],
  [/उपयोग किया/g, 'इस्तेमाल किया'],
  [/उपयोग होता है/g, 'इस्तेमाल होता है'],
  [/उपयोग की जाती है/g, 'इस्तेमाल की जाती है'],
  [/का उपयोग/g, 'का इस्तेमाल'],

  [/प्राप्त करना/g, 'पाना'],
  [/प्राप्त करें/g, 'हासिल करें'],
  [/प्राप्त होता है/g, 'मिलता है'],
  [/प्राप्त होती है/g, 'मिलती है'],
  [/प्राप्त किया/g, 'पाया'],
  [/प्राप्त हुआ/g, 'मिला'],

  [/आवश्यक है/g, 'ज़रूरी है'],
  [/आवश्यक हैं/g, 'ज़रूरी हैं'],
  [/आवश्यकता है/g, 'ज़रूरत है'],
  [/आवश्यकता होती है/g, 'ज़रूरत होती है'],
  [/आवश्यकता पड़ती है/g, 'ज़रूरत पड़ती है'],

  [/महत्वपूर्ण है/g, 'अहम है'],
  [/महत्वपूर्ण हैं/g, 'अहम हैं'],
  [/महत्वपूर्ण भूमिका/g, 'अहम भूमिका'],
  [/महत्वपूर्ण कदम/g, 'ज़रूरी कदम'],
  [/महत्वपूर्ण योगदान/g, 'बड़ा योगदान'],
  [/अत्यंत महत्वपूर्ण/g, 'बेहद ज़रूरी'],

  [/विचार करना/g, 'सोचना'],
  [/विचार करें/g, 'सोचें'],
  [/विचार किया/g, 'सोचा'],
  [/पर विचार/g, 'के बारे में सोच'],

  [/प्रयास करना/g, 'कोशिश करना'],
  [/प्रयास करें/g, 'कोशिश करें'],
  [/प्रयास किया/g, 'कोशिश की'],
  [/प्रयास करते हैं/g, 'कोशिश करते हैं'],

  [/संभावना है/g, 'हो सकता है'],
  [/संभावना होती है/g, 'हो सकता है'],
  [/संभव है/g, 'मुमकिन है'],
  [/संभव हो/g, 'मुमकिन हो'],
  [/असंभव है/g, 'नामुमकिन है'],

  [/समझना/g, 'समझ लेना'],
  [/समझाना/g, 'बताना'],
  [/ज्ञात होना/g, 'पता होना'],
  [/ज्ञात है/g, 'पता है'],
  [/ज्ञात हो/g, 'पता हो'],

  [/निर्माण करना/g, 'बनाना'],
  [/निर्माण किया/g, 'बनाया'],
  [/निर्मित/g, 'बना हुआ'],
  [/स्थापित करना/g, 'बनाना'],
  [/स्थापित किया/g, 'बनाया'],
  [/स्थापित है/g, 'बना है'],

  [/परिवर्तन करना/g, 'बदलना'],
  [/परिवर्तन किया/g, 'बदला'],
  [/परिवर्तन होता है/g, 'बदलाव आता है'],
  [/परिवर्तन आना/g, 'बदलाव आना'],

  [/सहायता करना/g, 'मदद करना'],
  [/सहायता करें/g, 'मदद करें'],
  [/सहायता मिलती है/g, 'मदद मिलती है'],
  [/सहायता प्रदान/g, 'मदद'],

  [/कार्य करना/g, 'काम करना'],
  [/कार्य करता है/g, 'काम करता है'],
  [/कार्य किया/g, 'काम किया'],
  [/कार्यों को/g, 'कामों को'],

  [/अनुभव प्राप्त/g, 'तजुर्बा'],
  [/अनुभव होना/g, 'तजुर्बा होना'],

  [/उत्पन्न होना/g, 'पैदा होना'],
  [/उत्पन्न करना/g, 'पैदा करना'],
  [/उत्पन्न हुआ/g, 'पैदा हुआ'],

  [/व्यक्त करना/g, 'बताना'],
  [/व्यक्त किया/g, 'बताया'],
  [/व्यक्त होना/g, 'ज़ाहिर होना'],

  [/संबंधित/g, 'से जुड़ा'],
  [/के संबंध में/g, 'के बारे में'],
  [/के अनुसार/g, 'के हिसाब से'],
  [/के अंतर्गत/g, 'के तहत'],
  [/के माध्यम से/g, 'के ज़रिए'],
  [/के द्वारा/g, 'के ज़रिए'],

  // Formal adjectives → simple
  [/व्यापक/g, 'बड़ा'],
  [/समग्र/g, 'पूरा'],
  [/विस्तृत/g, 'विस्तार से'],
  [/पर्याप्त/g, 'काफी'],
  [/उचित/g, 'सही'],
  [/उचित है/g, 'ठीक है'],
  [/उचित नहीं/g, 'ठीक नहीं'],
  [/विभिन्न/g, 'अलग-अलग'],
  [/विशेष/g, 'खास'],
  [/विशेष रूप से/g, 'खासकर'],
  [/सामान्य/g, 'आम'],
  [/सामान्यतः/g, 'आमतौर पर'],
  [/सामान्यत:/g, 'आमतौर पर'],
  [/मुख्य रूप से/g, 'मुख्यतः'],
  [/मुख्यतः/g, 'खासतौर पर'],
  [/वर्तमान में/g, 'अभी'],
  [/वर्तमान समय में/g, 'आज के समय में'],
  [/भविष्य में/g, 'आगे चलकर'],
  [/निकट भविष्य में/g, 'जल्द ही'],
  [/अत्यधिक/g, 'बहुत ज़्यादा'],
  [/अत्यंत/g, 'बेहद'],
  [/पूर्णतः/g, 'पूरी तरह'],
  [/पूर्ण रूप से/g, 'पूरी तरह से'],
  [/स्पष्ट रूप से/g, 'साफ़ तौर पर'],
  [/निश्चित रूप से/g, 'ज़रूर'],
  [/तीव्र/g, 'तेज़'],
  [/दीर्घकालिक/g, 'लंबे समय तक'],
  [/अल्पकालिक/g, 'थोड़े समय के लिए'],
];

// ── LAYER 2: AI TRANSITION PHRASES → CONVERSATIONAL ──
const aiTransitions = [
  // Direct translated English AI patterns
  [/यह ध्यान देना महत्वपूर्ण है कि\s*/gi, 'गौर करें — '],
  [/यह ध्यान रखना महत्वपूर्ण है कि\s*/gi, 'याद रखें — '],
  [/यह उल्लेखनीय है कि\s*/gi, 'दिलचस्प बात यह है कि '],
  [/यह बताना आवश्यक है कि\s*/gi, 'यहाँ बताते चलें — '],
  [/यह बताना ज़रूरी है कि\s*/gi, 'एक ज़रूरी बात — '],
  [/यह स्पष्ट है कि\s*/gi, 'साफ़ है कि '],
  [/यह सर्वविदित है कि\s*/gi, 'सब जानते हैं कि '],
  [/यह कहना गलत नहीं होगा कि\s*/gi, 'सच में, '],
  [/यह उचित होगा कि\s*/gi, 'बेहतर होगा कि '],

  // Formal transitions → spoken
  [/इसके अतिरिक्त[,،]?\s*/g, 'इसके साथ ही '],
  [/इसके अलावा[,،]?\s*/g, 'और भी — '],
  [/इसके साथ-साथ[,،]?\s*/g, 'साथ में '],
  [/फलस्वरूप[,،]?\s*/g, 'इसी वजह से '],
  [/परिणामस्वरूप[,،]?\s*/g, 'नतीजतन '],
  [/तदनुसार[,،]?\s*/g, 'उसी के हिसाब से '],
  [/अतः[,،]?\s*/g, 'इसलिए '],
  [/अंततः[,،]?\s*/g, 'आखिरकार '],
  [/सर्वप्रथम[,،]?\s*/g, 'सबसे पहले '],
  [/तत्पश्चात्?[,،]?\s*/g, 'उसके बाद '],
  [/यद्यपि\s*/g, 'हालांकि '],
  [/तथापि\s*/g, 'फिर भी '],
  [/किंतु\s*/g, 'लेकिन '],
  [/परंतु\s*/g, 'पर '],
  [/एवं\s*/g, 'और '],
  [/तथा\s*/g, 'और '],
  [/अथवा\s*/g, 'या '],
  [/अन्यथा\s*/g, 'वरना '],
  [/क्योंकि\s*/g, 'क्योंकि '], // keep but ensure spacing

  // Closing/summary phrases
  [/संक्षेप में[,،]?\s*/gi, 'सीधे कहें तो '],
  [/निष्कर्ष के रूप में[,،]?\s*/gi, 'कुल मिलाकर '],
  [/निष्कर्षतः[,،]?\s*/gi, 'आखिर में '],
  [/उपरोक्त के आधार पर\s*/gi, 'इसी आधार पर '],
  [/उपर्युक्त\s*/g, 'ऊपर बताई गई '],
  [/जैसा कि पहले उल्लेख किया गया है[,،]?\s*/gi, ''],
  [/जैसा कि ऊपर बताया गया है[,،]?\s*/gi, ''],
  [/जैसा कि पहले बताया गया[,،]?\s*/gi, ''],
  [/पूर्वोक्त[,،]?\s*/g, 'पहले बताए गए '],

  // Filler/hedge
  [/निस्संदेह[,،]?\s*/g, 'बेशक '],
  [/निःसंदेह[,،]?\s*/g, 'बिल्कुल '],
  [/वस्तुतः[,،]?\s*/g, 'दरअसल '],
  [/वास्तव में[,،]?\s*/g, 'सच में '],
  [/दरअसल[,،]?\s*/g, 'दरअसल '],
  [/स्वाभाविक रूप से\s*/g, 'स्वाभाविक है कि '],
];

// ── LAYER 3: COLLOQUIAL PARTICLE INJECTOR ────────
// AI Hindi has ZERO natural particles
// Real Hindi constantly uses: तो, ही, भी, न, तक, बस
// Strategy: inject after specific patterns — safe, no meaning change

function injectColloquialParticles(text) {
  let result = text;

  // "यह X है" → "यह X तो है" (emphasis particle)
  result = result.replace(
    /यह ([^\।।.]{3,20}) है।/g,
    (match, inner, offset) => {
      if (Math.random() > 0.5) return `यह ${inner} तो है।`;
      return match;
    }
  );

  // "X करना होगा" → "X करना ही होगा"
  result = result.replace(
    /(\S+ करना) होगा/g,
    (match, verb) => Math.random() > 0.5 ? `${verb} ही होगा` : match
  );

  // "इसके बाद" → "इसके बाद भी" (occasionally)
  result = result.replace(
    /इसके बाद ([^,।।.]{5,}),/g,
    (match, clause) => Math.random() > 0.6 ? `इसके बाद भी ${clause},` : match
  );

  return result;
}

// ── LAYER 4: SENTENCE BURSTINESS (Hindi) ─────────
// Hindi sentences end with: है, हैं, था, थे, गा, गी, एगा
// Split long compound sentences at conjunctions

function applyHindiBurstiness(text) {
  // Split at "और" when sentence is long
  const sentences = text.split(/([।!?])/);
  const result = [];

  for (let i = 0; i < sentences.length; i += 2) {
    const s = sentences[i]?.trim();
    const punct = sentences[i + 1] || '।';
    if (!s) continue;

    const words = s.split(/\s+/);

    // Long sentence (20+ words) with "और" in middle → split
    if (words.length > 20) {
      const andIdx = words.findIndex((w, j) => j > 6 && j < words.length - 4 &&
        (w === 'और' || w === 'लेकिन' || w === 'परंतु' || w === 'तथा' || w === 'जबकि'));

      if (andIdx !== -1) {
        const p1 = words.slice(0, andIdx).join(' ') + '।';
        const p2 = words.slice(andIdx + 1).join(' ');
        // Capitalize first word of p2 (Hindi doesn't have case, just clean spacing)
        result.push(p1 + ' ' + p2 + punct);
        continue;
      }
    }
    result.push(s + punct);
  }

  return result.join(' ').replace(/\s+/g, ' ').trim();
}

// ── LAYER 5: AI SCORE (Hindi) ────────────────────
function getHindiAIScore(text) {
  let score = 0;

  // Tatsam word density — biggest signal
  const tatsamWords = [
    'प्रदान', 'सुनिश्चित', 'उपयोग', 'आवश्यक', 'महत्वपूर्ण',
    'विचार', 'प्रयास', 'संभावना', 'निर्माण', 'स्थापित',
    'परिवर्तन', 'सहायता', 'कार्य', 'उत्पन्न', 'व्यक्त',
    'व्यापक', 'समग्र', 'विस्तृत', 'पर्याप्त', 'उचित',
    'विभिन्न', 'विशेष', 'सामान्य', 'वर्तमान', 'अत्यधिक',
    'पूर्णतः', 'स्पष्ट', 'निश्चित', 'तीव्र', 'दीर्घकालिक',
    'फलस्वरूप', 'परिणामस्वरूप', 'तदनुसार', 'सर्वप्रथम',
    'तत्पश्चात', 'यद्यपि', 'तथापि', 'निस्संदेह', 'वस्तुतः',
    'अंततः', 'इसके अतिरिक्त', 'संक्षेप में', 'निष्कर्ष'
  ];

  const words = text.split(/\s+/);
  const wordCount = words.length;

  tatsamWords.forEach(w => {
    const count = (text.match(new RegExp(w, 'g')) || []).length;
    score += count * 6;
  });

  // AI transition phrase check
  const aiPhrases = [
    'यह ध्यान देना महत्वपूर्ण है',
    'यह उल्लेखनीय है',
    'यह बताना आवश्यक है',
    'जैसा कि पहले उल्लेख किया गया',
    'उपरोक्त के आधार पर',
  ];
  aiPhrases.forEach(p => { if (text.includes(p)) score += 12; });

  // Colloquial particle presence (good sign → reduce score)
  const colloquialMarkers = /\bतो\b|\bही\b|\bभी\b|\bन\b|\bबस\b|\bतक\b|\bवैसे\b|\bअरे\b|\bदरअसल\b/g;
  const colloquialCount = (text.match(colloquialMarkers) || []).length;
  const colloquialRatio = colloquialCount / wordCount;
  if (colloquialRatio > 0.05) score -= 15; // good — has natural particles
  else if (colloquialRatio < 0.01) score += 15; // bad — zero particles = AI

  // Sentence length uniformity
  const sentences = text.split(/[।!?]/).filter(s => s.trim().length > 0);
  if (sentences.length >= 3) {
    const lengths = sentences.map(s => s.split(/\s+/).length);
    const avg = lengths.reduce((a, b) => a + b, 0) / lengths.length;
    const variance = lengths.reduce((a, b) => a + Math.pow(b - avg, 2), 0) / lengths.length;
    if (variance < 6) score += 20;
    else if (variance < 12) score += 8;
  }

  return Math.max(0, Math.min(score, 100));
}

// ── MAIN EXPORT ───────────────────────────────────
function applyHindiRules(text) {
  let result = text;

  // Layer 1: Tatsam → Colloquial
  tatsamToColloquial.forEach(([from, to]) => {
    result = result.replace(from, to);
  });

  // Layer 2: AI transitions → conversational
  aiTransitions.forEach(([from, to]) => {
    result = result.replace(from, to);
  });

  // Layer 3: Inject colloquial particles
  result = injectColloquialParticles(result);

  // Layer 4: Burstiness
  result = applyHindiBurstiness(result);

  // Cleanup
  result = result.replace(/\s{2,}/g, ' ').replace(/\s+([।,!?])/g, '$1').trim();

  return result;
}

module.exports = { applyHindiRules, getHindiAIScore };