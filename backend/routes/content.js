import express from 'express';
import {
  generateMarketingContent,
  generateInstagramCaption,
  generateTikTokContent,
  generateUpsellContent,
  generateBlogPost,
} from '../services/claude.js';
import {
  generateSalonImage,
  generateContentCalendar,
  generatePromoImage,
} from '../services/imageGeneration.js';
import {
  postToSocialMedia,
  schedulePost,
  getInstagramAnalytics,
} from '../services/socialMedia.js';

const router = express.Router();

// Generate marketing content
router.post('/generate/marketing', async (req, res) => {
  try {
    const { prompt, maxTokens = 1000 } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const result = await generateMarketingContent(prompt, maxTokens);
    
    res.json({
      success: true,
      content: result.content,
      tokens: result.tokens,
      cost: result.cost,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Generate Instagram caption
router.post('/generate/instagram', async (req, res) => {
  try {
    const { salonName, serviceType, offer } = req.body;
    
    if (!salonName || !serviceType) {
      return res.status(400).json({ error: 'salonName and serviceType required' });
    }

    const result = await generateInstagramCaption(salonName, serviceType, offer);
    
    res.json({
      success: true,
      content: result.content,
      tokens: result.tokens,
      cost: result.cost,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Generate TikTok content ideas
router.post('/generate/tiktok', async (req, res) => {
  try {
    const { salonName, targetAudience = 'women 18-35' } = req.body;
    
    if (!salonName) {
      return res.status(400).json({ error: 'salonName is required' });
    }

    const result = await generateTikTokContent(salonName, targetAudience);
    
    res.json({
      success: true,
      content: result.content,
      tokens: result.tokens,
      cost: result.cost,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Generate upsell content
router.post('/generate/upsell', async (req, res) => {
  try {
    const { salonName, currentService, upsellService } = req.body;
    
    if (!salonName || !currentService || !upsellService) {
      return res.status(400).json({ error: 'All fields required' });
    }

    const result = await generateUpsellContent(salonName, currentService, upsellService);
    
    res.json({
      success: true,
      content: result.content,
      tokens: result.tokens,
      cost: result.cost,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Generate blog post
router.post('/generate/blog', async (req, res) => {
  try {
    const { salonName, topic, keywords } = req.body;
    
    if (!salonName || !topic || !keywords) {
      return res.status(400).json({ error: 'All fields required' });
    }

    const result = await generateBlogPost(salonName, topic, keywords);
    
    res.json({
      success: true,
      content: result.content,
      tokens: result.tokens,
      cost: result.cost,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Generate salon images
router.post('/generate/image', async (req, res) => {
  try {
    const { salonName, description, style = 'luxury modern' } = req.body;
    
    if (!salonName || !description) {
      return res.status(400).json({ error: 'salonName and description required' });
    }

    const result = await generateSalonImage(salonName, description, style);
    
    res.json({
      success: true,
      imageUrl: result.url,
      cost: result.cost,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Generate content calendar (4 weeks of images)
router.post('/generate/calendar', async (req, res) => {
  try {
    const { salonName, services, weekCount = 4 } = req.body;
    
    if (!salonName || !services) {
      return res.status(400).json({ error: 'salonName and services required' });
    }

    const result = await generateContentCalendar(salonName, services, weekCount);
    
    res.json({
      success: true,
      calendar: result,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Generate promotional image
router.post('/generate/promo-image', async (req, res) => {
  try {
    const { salonName, promotion, discount } = req.body;
    
    if (!salonName || !promotion || !discount) {
      return res.status(400).json({ error: 'All fields required' });
    }

    const result = await generatePromoImage(salonName, promotion, discount);
    
    res.json({
      success: true,
      imageUrl: result.url,
      promotion: result.promotion,
      discount: result.discount,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Post to social media
router.post('/social/post', async (req, res) => {
  try {
    const { imageUrl, videoUrl, caption, hashtags } = req.body;
    
    if (!caption || !hashtags) {
      return res.status(400).json({ error: 'caption and hashtags required' });
    }

    const content = {
      imageUrl,
      videoUrl,
      caption,
      hashtags,
    };

    const result = await postToSocialMedia(content);
    
    res.json({
      success: true,
      posts: result.posts,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Schedule a post
router.post('/social/schedule', async (req, res) => {
  try {
    const { imageUrl, caption, hashtags, scheduledTime } = req.body;
    
    if (!scheduledTime) {
      return res.status(400).json({ error: 'scheduledTime is required' });
    }

    const content = { imageUrl, caption, hashtags };
    const result = await schedulePost(content, scheduledTime);
    
    res.json({
      success: true,
      scheduled: result,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get Instagram analytics
router.get('/social/analytics', async (req, res) => {
  try {
    const { timeframe = '7days' } = req.query;
    
    const result = await getInstagramAnalytics(timeframe);
    
    res.json({
      success: true,
      analytics: result,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
