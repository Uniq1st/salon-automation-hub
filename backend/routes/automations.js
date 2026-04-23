import express from 'express';
import { sendGmailDraft, sendSquareSMS } from '../services/communications.js';

const router = express.Router();

router.post('/send', async (req, res, next) => {
  try {
    const { automationId, template, clientCount } = req.body;

    if (!automationId || !template) {
      return res.status(400).json({
        success: false,
        message: 'automationId and template are required',
      });
    }

    // Send via Gmail (email)
    const gmailResult = await sendGmailDraft(template, clientCount);

    // Send via Square (SMS)
    const squareResult = await sendSquareSMS(template, clientCount);

    res.json({
      success: true,
      automationId,
      results: {
        email: gmailResult,
        sms: squareResult,
      },
      message: `✓ "${automationId}" automation queued! Email drafted in Gmail + SMS queued via Square for ${clientCount} clients.`,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
