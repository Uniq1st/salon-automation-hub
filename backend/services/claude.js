import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function generateMarketingContent(prompt, maxTokens = 1000) {
  try {
    const message = await client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: maxTokens,
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

    return {
      content: text,
      tokens: {
        input: message.usage.input_tokens,
        output: message.usage.output_tokens,
        total: message.usage.input_tokens + message.usage.output_tokens,
      },
      cost: calculateCost(message.usage.input_tokens, message.usage.output_tokens),
    };
  } catch (error) {
    console.error('Claude API error:', error);
    throw new Error(`Failed to generate content: ${error.message}`);
  }
}

// Generate Instagram captions with hashtags
export async function generateInstagramCaption(salonName, serviceType, offer = null) {
  const prompt = `You are a social media expert for a luxury salon "${salonName}".

Generate an engaging Instagram caption (max 150 chars) for ${serviceType}.
${offer ? `Include this offer: ${offer}` : ''}
Include 3-5 relevant hashtags.

Respond ONLY with valid JSON:
{
  "caption": "...",
  "hashtags": ["#tag1", "#tag2", ...]
}`;

  return generateMarketingContent(prompt, 500);
}

// Generate TikTok viral content ideas
export async function generateTikTokContent(salonName, targetAudience = 'women 18-35') {
  const prompt = `You are a TikTok viral content expert for beauty salon "${salonName}".

Create 3 viral TikTok video ideas for ${targetAudience}:
- Each should be 15-30 seconds
- Focus on: before/after transformations, tips, trends, or entertainment

Respond ONLY with valid JSON:
{
  "videos": [
    {
      "title": "Video Title",
      "description": "30-second script",
      "hooks": ["Opening line to hook viewers"],
      "hashtags": ["#FYP", "#BeautyTok"]
    }
  ]
}`;

  return generateMarketingContent(prompt, 1500);
}

// Generate product/service descriptions for upselling
export async function generateUpsellContent(salonName, currentService, upsellService) {
  const prompt = `You are a luxury salon sales expert for "${salonName}".

Client just booked: ${currentService}
Upsell service: ${upsellService}

Generate:
1. A persuasive SMS upsell message (max 160 chars)
2. An email subject line
3. Email body (2-3 sentences, luxury tone)

Respond ONLY with valid JSON:
{
  "sms": "...",
  "email_subject": "...",
  "email_body": "..."
}`;

  return generateMarketingContent(prompt, 800);
}

// Generate blog post for SEO & authority
export async function generateBlogPost(salonName, topic, keywords) {
  const prompt = `You are a beauty industry SEO expert writing for "${salonName}".

Topic: ${topic}
Keywords to include: ${keywords.join(', ')}

Write a 300-word blog post that:
- Ranks for these keywords
- Provides real value
- Includes a call-to-action to book

Format as HTML.`;

  return generateMarketingContent(prompt, 2000);
}

// Calculate token costs (Sonnet pricing as of 2024)
function calculateCost(inputTokens, outputTokens) {
  const inputPrice = 0.003 / 1000;  // $3 per 1M input tokens
  const outputPrice = 0.015 / 1000; // $15 per 1M output tokens
  
  return {
    input: (inputTokens * inputPrice).toFixed(4),
    output: (outputTokens * outputPrice).toFixed(4),
    total: ((inputTokens * inputPrice) + (outputTokens * outputPrice)).toFixed(4),
  };
}

export async function generateBatch(prompts) {
  try {
    const results = await Promise.all(
      prompts.map(prompt => generateMarketingContent(prompt))
    );
    return results;
  } catch (error) {
    console.error('Batch generation error:', error);
    throw error;
  }
}
