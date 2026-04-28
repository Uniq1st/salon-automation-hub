import twilio from 'twilio';

function getClient() {
  return twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
}

export async function sendSMS({ to, message }) {
  const client = getClient();
  const result = await client.messages.create({
    body: message,
    from: process.env.TWILIO_PHONE_NUMBER,
    to,
  });
  return { sid: result.sid, to, status: result.status };
}

// Send SMS campaign to a list of customers
export async function sendSMSCampaign({ customers, message, delayMs = 300 }) {
  const results = { sent: [], failed: [] };

  for (const customer of customers) {
    const phone = customer.phone_number;
    if (!phone) continue;

    const firstName = customer.given_name || 'there';
    const personalMessage = message
      .replace(/{first_name}/g, firstName)
      .replace(/{promo_offer}/g, customer.promoOffer || '')
      .replace(/{promo_dates}/g, customer.promoDates || '');

    try {
      await sendSMS({ to: phone, message: personalMessage });
      results.sent.push(phone);
    } catch (err) {
      results.failed.push({ phone, error: err.message });
    }

    if (delayMs > 0) await new Promise(r => setTimeout(r, delayMs));
  }

  return results;
}
