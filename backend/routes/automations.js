import express from 'express';
import { sendCampaign, verifyEmailConnection, sendEmail } from '../services/email.js';
import { sendSMSCampaign, sendSMS } from '../services/sms.js';
import { getAllCustomers } from '../services/square.js';

const router = express.Router();

// Verify email connection
router.get('/verify-email', async (req, res) => {
  try {
    const result = await verifyEmailConnection();
    res.json({ success: true, ...result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Test email — sends to salon Gmail only
router.post('/test-email', async (req, res) => {
  try {
    const { to = process.env.GMAIL_USER, subject, body } = req.body;
    await sendEmail({ to, subject: subject || 'Test email from Salon Hub', body: body || 'Email sending is working!' });
    res.json({ success: true, message: `Test email sent to ${to}` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Test SMS — sends to one number only
router.post('/test-sms', async (req, res) => {
  try {
    const { to, message } = req.body;
    if (!to) return res.status(400).json({ success: false, message: 'Phone number required' });
    await sendSMS({ to, message: message || 'Test SMS from Brows and Lashes salon hub!' });
    res.json({ success: true, message: `Test SMS sent to ${to}` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Test both email + SMS to yourself only
router.post('/test-both', async (req, res) => {
  try {
    const { subject, emailBody, smsBody } = req.body;
    const salonPhone = process.env.SALON_PHONE || '+19173882434';

    const [emailResult, smsResult] = await Promise.allSettled([
      sendEmail({
        to: process.env.GMAIL_USER,
        subject: subject || 'Test email from Salon Hub',
        body: emailBody || 'Email test',
      }),
      sendSMS({
        to: salonPhone,
        message: smsBody || 'Test SMS from Brows and Lashes salon hub!',
      }),
    ]);

    res.json({
      success: true,
      message: `✓ Test email sent to ${process.env.GMAIL_USER} + SMS sent to ${salonPhone}`,
      email: emailResult.status,
      sms: smsResult.status,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Live campaign — sends email + SMS to all matching customers
router.post('/send', async (req, res, next) => {
  try {
    const { automationId, template, promoOffer, promoDates } = req.body;

    if (!automationId || !template) {
      return res.status(400).json({ success: false, message: 'automationId and template are required' });
    }

    const { customers } = await getAllCustomers();
    const tagged = customers.map(c => ({ ...c, promoOffer, promoDates }));

    const emailCustomers = tagged.filter(c => c.email_address);
    const smsCustomers = tagged.filter(c => c.phone_number);

    // Run email + SMS in parallel
    const [emailResults, smsResults] = await Promise.all([
      template.email
        ? sendCampaign({ customers: emailCustomers, subject: template.subject, body: template.email })
        : Promise.resolve({ sent: [], failed: [] }),
      template.sms
        ? sendSMSCampaign({ customers: smsCustomers, message: template.sms })
        : Promise.resolve({ sent: [], failed: [] }),
    ]);

    res.json({
      success: true,
      automationId,
      email: { sent: emailResults.sent.length, failed: emailResults.failed.length },
      sms: { sent: smsResults.sent.length, failed: smsResults.failed.length },
      message: `✓ Email sent to ${emailResults.sent.length} clients, SMS sent to ${smsResults.sent.length} clients`,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
