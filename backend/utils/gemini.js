const { GoogleGenerativeAI } = require('@google/generative-ai');

// Sanity check for API Key
if (!process.env.GEMINI_API_KEY) {
  console.error('❌ FATAL: GEMINI_API_KEY is missing in .env file');
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Helper for delay
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function humanizeText(text, mode = 'standard') {
  // Using models discovered from raw API check for this specific key
  const models = [ 
    'gemini-2.5-flash',
    'gemini-1.5-flash', // Still keeping as fallback
    'gemini-2.0-flash-exp'
  ];
  
  let lastError = null;

  for (let i = 0; i < models.length; i++) {
    const modelName = models[i];
    try {
      console.log(`[Attempt ${i + 1}] Requesting ${modelName}...`);
      const model = genAI.getGenerativeModel({ model: modelName });

      const prompt = `
You are a professional human writer and editor.
TASK: Rewrite the following AI-generated text so it reads as naturally written by a human.
STRICT RULES:
1. DO NOT change meaning or facts
2. Vary sentence lengths
3. Add natural imperfections
4. Output ONLY the rewritten text, no conversational filler or intro
MODE: ${mode === 'aggressive' ? 'Rewrite heavily' : 'Light touch'}
TEXT TO HUMANIZE:
"""
${text}
"""`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const responseText = response.text();
      
      if (responseText) {
        console.log(`✅ Success with ${modelName}`);
        return responseText;
      }
    } catch (err) {
      lastError = err;
      
      console.error(`DEBUG: Model ${modelName} failed. Status: ${err.status}. Message: ${err.message}`);
      if (err.errorDetails) {
        console.error(`DEBUG: Error Details: ${JSON.stringify(err.errorDetails, null, 2)}`);
      }
      
      // Handle Quota (429) or Model Not Found (404)
      if (err.status === 429 || err.status === 404 || err.message?.includes('429') || err.message?.includes('404')) {
        const reason = err.status === 429 ? 'Quota/Rate Limit' : 'Model Not Found/Unsupported';
        console.warn(`⚠️ ${modelName} failed (${reason}).`);
        
        if (i < models.length - 1) {
          const waitTime = err.status === 429 ? 2000 * (i + 1) : 100; // Wait longer for 429, less for 404
          console.log(`Trying next model in ${waitTime}ms...`);
          await sleep(waitTime);
          continue;
        }
      }
      
      console.error(`❌ Unexpected error with ${modelName}:`, err.message);
      // If it's not a quota or model name issue, it might be something we should throw
      if (i === models.length - 1) throw err;
    }
  }

  console.error('🛑 All models failed. Please verify your API key at: https://aistudio.google.com/');
  throw lastError;
}

module.exports = { humanizeText };