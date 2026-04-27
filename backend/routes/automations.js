import express from 'express';
import { sendCampaign, verifyEmailConnection } from '../services/email.js';
import { getAllCustomers } from '../services/square.js';

const router = express.Router();

// Verify email connection is working
router.get('/verify-email', async (req, res) => {
  try {
    const result = await verifyEmailConnection();
    res.json({ success: true, ...result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Send a test email to one address only — safe to call anytime
router.post('/test-email', async (req, res) => {
  try {
    const { to = process.env.GMAIL_USER, subject, body } = req.body;
    const { sendEmail } = await import('../services/email.js');
    await sendEmail({ to, subject: subject || 'Test email from Salon Hub', body: body || 'Email sending is working!' });
    res.json({ success: true, message: `Test email sent to ${to}` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/send', async (req, res, next) => {
  try {
    const { automationId, template, promoOffer, promoDates } = req.body;

    if (!automationId || !template) {
      return res.status(400).json({
        success: false,
        message: 'automationId and template are required',
      });
    }

    if (!template.subject || !template.email) {
      return res.status(400).json({
        success: false,
        message: 'Template must have subject and email fields',
      });
    }

    // Fetch all customers with email addresses
    const { customers } = await getAllCustomers();
    const emailableCustomers = customers
      .filter(c => c.email_address)
      .map(c => ({ ...c, promoOffer, promoDates }));

    if (emailableCustomers.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No customers with email addresses found',
      });
    }

    // Send campaign
    const results = await sendCampaign({
      customers: emailableCustomers,
      subject: template.subject,
      body: template.email,
    });

    res.json({
      success: true,
      automationId,
      sent: results.sent.length,
      failed: results.failed.length,
      failedList: results.failed,
      message: `✓ Sent to ${results.sent.length} clients${results.failed.length > 0 ? `, ${results.failed.length} failed` : ''}`,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
