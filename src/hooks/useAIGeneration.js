import { useState } from "react";
import { AUTOMATIONS, defaultTemplates } from "@utils/constants";

export function useAIGeneration({ salonInfo, onGenerateComplete, onLoading }) {
  const generateWithAI = async (automationId, customOffer = "", promoDates = "") => {
    onLoading(automationId, true);
    try {
      const automation = AUTOMATIONS.find(a => a.id === automationId);
      const offer = customOffer || "default offer";

      const prompt = automationId === "promo"
        ? `You are writing salon marketing messages for "${salonInfo.SALON_NAME}", a beauty salon at ${salonInfo.SALON_ADDRESS} specializing in lash extensions, facials, waxing, and threading. They have a 4.9 star rating with 198 reviews and their booking link is ${salonInfo.BOOKING_URL}.

Write a "${automation.label}" marketing message with offer: "${offer}" valid "${promoDates}".

Respond ONLY with valid JSON (no markdown), like:
{
  "subject": "email subject line with emoji",
  "email": "full email body text",
  "sms": "short SMS under 160 chars"
}`
        : `You are writing salon marketing messages for "${salonInfo.SALON_NAME}", a beauty salon at ${salonInfo.SALON_ADDRESS} specializing in lash extensions, facials, waxing, and threading. They have a 4.9 star rating with 198 reviews and their booking link is ${salonInfo.BOOKING_URL}. Owner email: ${salonInfo.SALON_EMAIL}.

Write a "${automation.label}" message (${automation.description}).

Use {first_name} as placeholder for client name.

Respond ONLY with valid JSON (no markdown), like:
{
  "subject": "email subject line with emoji",
  "email": "full email body (warm, professional, 3-4 paragraphs)",
  "sms": "short SMS under 160 chars"
}`;

      // Call backend API for AI generation
      const response = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ automationId, prompt }),
      });

      const data = await response.json();

      if (data.success) {
        onGenerateComplete(automationId, data.template);
      } else {
        throw new Error(data.message || "AI generation failed");
      }
    } catch (err) {
      console.error("AI generation error:", err);
      onGenerateComplete(automationId, defaultTemplates[automationId]);
    }
    onLoading(automationId, false);
  };

  return { generateWithAI };
}
