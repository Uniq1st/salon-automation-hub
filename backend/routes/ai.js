import express from 'express';
import { generateAIMessage } from '../services/anthropic.js';

const router = express.Router();

router.post('/generate', async (req, res, next) => {
  try {
    const { automationId, prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({
        success: false,
        message: 'Prompt is required',
      });
    }

    const result = await generateAIMessage(prompt);

    let template;
    try {
      template = JSON.parse(result.content);
    } catch {
      template = {
        subject: 'Message from Brows and Lashes',
        email: result.content,
        sms: result.content.substring(0, 160),
      };
    }

    res.json({
      success: true,
      automationId,
      template,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
