require('dotenv').config();

async function checkModels() {
    const key = process.env.GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1/models?key=${key}`;
    
    try {
        const res = await fetch(url);
        const data = await res.json();
        
        if (data.error) {
            console.error("API Error:", JSON.stringify(data.error, null, 2));
        } else {
            console.log("Available Models:");
            data.models.forEach(m => console.log(` - ${m.name}`));
        }
    } catch (e) {
        console.error("Fetch Error:", e);
    }
}

checkModels();
