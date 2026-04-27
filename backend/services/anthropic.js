import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

export async function generateAIMessage(prompt) {
  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    // Clean JSON response
    const clean = text.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(clean);

    return parsed;
  } catch (error) {
    console.error('AI generation error:', error);
    throw new Error(`Failed to generate message: ${error.message}`);
  }
}
