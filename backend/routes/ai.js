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

    const template = await generateAIMessage(prompt);

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
