import nodemailer from 'nodemailer';

function getTransporter() {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });
}

// Send a single email
export async function sendEmail({ to, subject, body, fromName = 'Brows and Lashes' }) {
  const transporter = getTransporter();

  const info = await transporter.sendMail({
    from: `"${fromName}" <${process.env.GMAIL_USER}>`,
    to,
    subject,
    text: body,
    html: body.replace(/\n/g, '<br>'),
  });

  return { messageId: info.messageId, to };
}

// Send a campaign to a list of customers
// Replaces {first_name} in subject/body with each customer's name
export async function sendCampaign({ customers, subject, body, delayMs = 300 }) {
  const results = { sent: [], failed: [] };

  for (const customer of customers) {
    const firstName = customer.given_name || 'there';
    const personalSubject = subject.replace(/{first_name}/g, firstName);
    const personalBody = body
      .replace(/{first_name}/g, firstName)
      .replace(/{promo_offer}/g, customer.promoOffer || '')
      .replace(/{promo_dates}/g, customer.promoDates || '');

    const email = customer.email_address;
    if (!email) continue;

    try {
      await sendEmail({ to: email, subject: personalSubject, body: personalBody });
      results.sent.push(email);
    } catch (err) {
      results.failed.push({ email, error: err.message });
    }

    // Small delay between sends to avoid Gmail rate limits
    if (delayMs > 0) await new Promise(r => setTimeout(r, delayMs));
  }

  return results;
}

// Verify Gmail credentials are working
export async function verifyEmailConnection() {
  const transporter = getTransporter();
  await transporter.verify();
  return { success: true, user: process.env.GMAIL_USER };
}
