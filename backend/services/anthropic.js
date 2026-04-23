import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function generateAIMessage(prompt) {
  try {
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      messages: [
        {
          role: 'user',
          content: prompt,
        }
      ],
    });

    const text = message.content
      .map(block => block.text || '')
      .join('');

    // Clean JSON response
    const clean = text.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(clean);

    return parsed;
  } catch (error) {
    console.error('AI generation error:', error);
    throw new Error(`Failed to generate message: ${error.message}`);
  }
}
