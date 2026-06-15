require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function listModels() {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    // There isn't a direct listModels in the high level SDK easily, 
    // but we can try a few common ones to see what sticks.
    console.log("Checking API Key status...");
    
    const testModels = ['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-1.0-pro'];
    
    for (const m of testModels) {
        try {
            console.log(`Trying ${m} with v1...`);
            const model = genAI.getGenerativeModel({ model: m }, { apiVersion: 'v1' });
            const result = await model.generateContent("Hi");
            console.log(`✅ Model ${m} is WORKING on v1`);
            return;
        } catch (e) {
            console.log(`❌ Model ${m} failed on v1: ${e.message} (Status: ${e.status})`);
        }
    }
  } catch (error) {
    console.error("Fatal error:", error);
  }
}

listModels();
