const { GoogleGenAI } = require('@google/generative-ai');

/**
 * Fallback classification using regex/keywords
 */
function fallbackClassify(text) {
  const normalized = text.toLowerCase();
  
  // 1. Determine Category
  let category = 'General Inquiry';
  if (normalized.includes('buy') || normalized.includes('price') || normalized.includes('pricing') || normalized.includes('cost') || normalized.includes('sales') || normalized.includes('quote') || normalized.includes('demo') || normalized.includes('purchase')) {
    category = 'Sales';
  } else if (normalized.includes('help') || normalized.includes('error') || normalized.includes('broken') || normalized.includes('bug') || normalized.includes('support') || normalized.includes('issue') || normalized.includes('fail')) {
    category = 'Support';
  } else if (normalized.includes('job') || normalized.includes('career') || normalized.includes('hire') || normalized.includes('hiring') || normalized.includes('resume') || normalized.includes('apply') || normalized.includes('work')) {
    category = 'Careers';
  } else if (normalized.includes('partner') || normalized.includes('collab') || normalized.includes('partnership') || normalized.includes('sponsor') || normalized.includes('affiliate')) {
    category = 'Partnership';
  }

  // 2. Determine Sentiment
  let sentiment = 'Neutral';
  const positiveWords = ['great', 'awesome', 'good', 'love', 'perfect', 'nice', 'pleased', 'happy', 'excited'];
  const negativeWords = ['bad', 'sad', 'angry', 'error', 'broken', 'issue', 'hate', 'worst', 'fail', 'poor', 'slow'];

  let posCount = 0;
  let negCount = 0;

  positiveWords.forEach(word => {
    if (normalized.includes(word)) posCount++;
  });
  negativeWords.forEach(word => {
    if (normalized.includes(word)) negCount++;
  });

  if (posCount > negCount) {
    sentiment = 'Positive';
  } else if (negCount > posCount) {
    sentiment = 'Negative';
  }

  return { category, sentiment };
}

/**
 * Classify a lead requirement using Gemini API (or fallback)
 */
async function classifyRequirement(text) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    console.log('[AI Service] No Gemini API key detected. Using offline fallback classifier.');
    return fallbackClassify(text);
  }

  try {
    // Note: GoogleGenAI or GoogleGenAI.GoogleGenAI may vary depending on SDK version.
    // In newer SDK versions, we import GoogleGenAI from '@google/generative-ai'.
    // Let's use a dynamic initialize or robust load to handle the Google GenAI interface.
    const { GoogleGenAI } = require('@google/generative-ai');
    const ai = new GoogleGenAI({ apiKey });
    
    const prompt = `
You are an AI data classification assistant. Your task is to analyze the following user requirement message from a lead contact form.
Categorize the message into exactly one of these categories:
- "Sales" (if they ask about pricing, demos, buying, quotes, or product interest)
- "Support" (if they report bugs, issues, errors, ask for help, or complaints)
- "Careers" (if they ask about jobs, hiring, submitting resumes, or working at the company)
- "Partnership" (if they mention collaboration, sponsorships, or joint ventures)
- "General Inquiry" (any general question not fitting the above)

Also, analyze the sentiment of the text. It must be exactly one of:
- "Positive"
- "Neutral"
- "Negative"

Message: "${text}"

Respond ONLY with a valid JSON object of the format:
{
  "category": "Sales" | "Support" | "Careers" | "Partnership" | "General Inquiry",
  "sentiment": "Positive" | "Neutral" | "Negative"
}
Do not include any other text, markdown formatting (like \`\`\`json), or explanations.
`;

    // Modern SDK use: ai.models.generateContent
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const responseText = response.text ? response.text.trim() : '';
    // Clean potential markdown wrappers
    const jsonStr = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    const result = JSON.parse(jsonStr);

    if (result.category && result.sentiment) {
      return {
        category: result.category,
        sentiment: result.sentiment,
      };
    }
    
    return fallbackClassify(text);
  } catch (error) {
    console.error('[AI Service] Error calling Gemini API, falling back:', error.message);
    return fallbackClassify(text);
  }
}

module.exports = {
  classifyRequirement,
};
