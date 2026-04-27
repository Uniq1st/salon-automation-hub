import OpenAI from 'openai';

let openai = null;

function getOpenAIClient() {
  if (!openai) {
    if (!process.env.OPENAI_API_KEY) {
      console.warn('OPENAI_API_KEY not set - image generation will be skipped');
      return null;
    }
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  return openai;
}

export async function generateSalonImage(salonName, description, style = 'luxury modern') {
  try {
    const client = getOpenAIClient();
    if (!client) {
      return {
        url: 'https://via.placeholder.com/1024x1024?text=Image+Generation+Disabled',
        created: new Date(),
        cost: { usd: '0.00' },
      };
    }

    const response = await client.images.generate({
      model: 'dall-e-3',
      prompt: `Professional salon photo for "${salonName}": ${description}. Style: ${style}. High quality, Instagram-ready, 1080x1350 portrait.`,
      n: 1,
      size: '1024x1024',
      quality: 'hd',
    });

    return {
      url: response.data[0].url,
      created: response.created,
      cost: {
        usd: '0.0800',
      },
    };
  } catch (error) {
    console.error('Image generation error:', error);
    throw new Error(`Failed to generate image: ${error.message}`);
  }
}

export async function generateContentCalendar(salonName, services, weekCount = 4) {
  const prompts = [
    `Lash extension close-up for "${salonName}", luxury style`,
    `Facial treatment spa setup for "${salonName}", modern aesthetics`,
    `Eyebrow shaping artistry for "${salonName}", professional lighting`,
    `Threading service transformation for "${salonName}", before/after style`,
  ];

  try {
    const images = await Promise.all(
      prompts.slice(0, weekCount).map(prompt => generateSalonImage(salonName, prompt))
    );

    return {
      week: new Date().toISOString().split('T')[0],
      images: images.map((img, idx) => ({
        post_day: ['Monday', 'Wednesday', 'Friday', 'Sunday'][idx],
        image_url: img.url,
        content_type: 'service_showcase',
      })),
      totalCost: (images.length * 0.08).toFixed(2),
    };
  } catch (error) {
    console.error('Content calendar error:', error);
    throw error;
  }
}

export async function generatePromoImage(salonName, promotion, discount) {
  try {
    const client = getOpenAIClient();
    if (!client) {
      return {
        url: 'https://via.placeholder.com/1024x1024?text=Promo+Image',
        promotion,
        discount,
      };
    }

    const response = await client.images.generate({
      model: 'dall-e-3',
      prompt: `Professional salon promotional image for "${salonName}": "${promotion}" ${discount}% off. Luxury design, bold colors, ready for Instagram stories. 1080x1920 vertical format.`,
      n: 1,
      size: '1024x1024',
      quality: 'hd',
    });

    return {
      url: response.data[0].url,
      promotion,
      discount,
    };
  } catch (error) {
    console.error('Promo image generation error:', error);
    throw error;
  }
}
