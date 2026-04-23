export const AUTOMATIONS = [
  {
    id: "welcome",
    icon: "★",
    label: "New client welcome",
    description: "Sent after first booking",
    color: "#7F77DD",
    bg: "#EEEDFE",
    channel: ["email", "sms"],
  },
  {
    id: "winback",
    icon: "↩",
    label: "Win-back (we miss you)",
    description: "For clients inactive 60+ days",
    color: "#1D9E75",
    bg: "#E1F5EE",
    channel: ["email", "sms"],
  },
  {
    id: "promo",
    icon: "♦",
    label: "Promotional campaign",
    description: "Special offers & slow-day deals",
    color: "#D85A30",
    bg: "#FAECE7",
    channel: ["email", "sms"],
  },
];

export const defaultTemplates = {
  welcome: {
    subject: `Welcome to Brows and Lashes, {first_name}! ✨`,
    email: `Hi {first_name},

Welcome to Brows and Lashes! We're so excited to have you as a new client.

Your appointment is confirmed and we can't wait to take care of you. Here's everything you need to know:

📍 1240 Lexington Ave, New York, NY 10028
📞 +1 917-388-2434
🔗 Book your next visit: https://book.squareup.com/appointments/4t8q4a3w43qqpa/location/LJDRXPJBMD5Y2/services

We're rated 4.9 ⭐ by 198 clients — and we're committed to making your experience just as exceptional.

If you have any questions before your visit, just reply to this email.

See you soon!
The Brows and Lashes Team`,
    sms: `Hi {first_name}! Welcome to Brows and Lashes 🌟 We're thrilled to have you! Your appt is confirmed. Questions? Call us at +1 917-388-2434. Book again anytime: https://book.squareup.com/appointments/4t8q4a3w43qqpa/location/LJDRXPJBMD5Y2/services`,
  },
  winback: {
    subject: `We miss you, {first_name}! 💕 Come back for a special treat`,
    email: `Hi {first_name},

It's been a while since we've seen you at Brows and Lashes, and we genuinely miss you!

As a thank-you for being a valued client, we'd love to offer you:

🎁 15% OFF your next visit
✨ Valid for any service: lash extensions, facials, waxing, threading

Use code WELCOMEBACK when booking:
https://book.squareup.com/appointments/4t8q4a3w43qqpa/location/LJDRXPJBMD5Y2/services

This offer is just for you and expires in 14 days.

We can't wait to see you again!
The Brows and Lashes Team`,
    sms: `Hi {first_name}! We miss you at Brows and Lashes 💕 Come back & get 15% OFF your next visit! Use code WELCOMEBACK when booking (Expires in 14 days)`,
  },
  promo: {
    subject: `✨ {promo_offer} — This Week Only at Brows and Lashes`,
    email: `Hi {first_name},

We have something special just for you this week at Brows and Lashes!

🌟 {promo_offer}
📅 Valid: {promo_dates}

Whether it's a fresh set of lash extensions, a glowing facial, or a clean wax — now is the perfect time to treat yourself.

Book your spot before it fills up:
https://book.squareup.com/appointments/4t8q4a3w43qqpa/location/LJDRXPJBMD5Y2/services

Rated 4.9 ⭐ by 198 happy clients. We'd love to make you one of them!

The Brows and Lashes Team`,
    sms: `Hi {first_name}! ✨ {promo_offer} at Brows and Lashes — {promo_dates} only! Book now: https://book.squareup.com/appointments/4t8q4a3w43qqpa/location/LJDRXPJBMD5Y2/services`,
  },
};

export const promoOptions = [
  "20% off all lash extensions",
  "Buy one facial, get one 50% off",
  "Free brow thread with any waxing service",
  "Slow day special — 15% off Tuesday & Wednesday",
  "Custom offer...",
];
