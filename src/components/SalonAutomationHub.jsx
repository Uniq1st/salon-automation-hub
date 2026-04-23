import { useState, useEffect } from "react";
import PreviewModal from "./PreviewModal";
import Tag from "./Tag";
import Spinner from "./Spinner";
import { AUTOMATIONS, defaultTemplates, promoOptions } from "@utils/constants";
import { useAIGeneration } from "@hooks/useAIGeneration";

const SALON_NAME = process.env.VITE_SALON_NAME || "Brows and Lashes";
const SALON_EMAIL = process.env.VITE_SALON_EMAIL || "browsandlashesbyuniqswek@gmail.com";
const SALON_PHONE = process.env.VITE_SALON_PHONE || "+1 917-388-2434";
const SALON_ADDRESS = process.env.VITE_SALON_ADDRESS || "1240 Lexington Ave, New York, NY 10028";
const BOOKING_URL = process.env.VITE_BOOKING_URL || "https://book.squareup.com/appointments/4t8q4a3w43qqpa/location/LJDRXPJBMD5Y2/services";

export default function SalonAutomationHub() {
  const [activeModal, setActiveModal] = useState(null);
  const [templates, setTemplates] = useState(defaultTemplates);
  const [sending, setSending] = useState(false);
  const [results, setResults] = useState({});
  const [promoOffer, setPromoOffer] = useState(promoOptions[0]);
  const [promoDates, setPromoDates] = useState("This week only");
  const [customPromo, setCustomPromo] = useState("");
  const [generatedMessages, setGeneratedMessages] = useState({});
  const [aiLoading, setAiLoading] = useState({});
  const [stats] = useState({ customers: 198, reachable: 198 });

  const { generateWithAI } = useAIGeneration({
    salonInfo: { SALON_NAME, SALON_EMAIL, SALON_PHONE, SALON_ADDRESS, BOOKING_URL },
    onGenerateComplete: (automationId, generated) => {
      setGeneratedMessages(prev => ({ ...prev, [automationId]: generated }));
      setTemplates(prev => ({ ...prev, [automationId]: generated }));
    },
    onLoading: (automationId, loading) => {
      setAiLoading(prev => ({ ...prev, [automationId]: loading }));
    }
  });

  const handleOpenModal = async (automationId) => {
    setActiveModal(automationId);
    if (!generatedMessages[automationId]) {
      await generateWithAI(automationId, promoOffer === "Custom offer..." ? customPromo : promoOffer, promoDates);
    }
  };

  const handleSend = async (automationId) => {
    setSending(true);
    try {
      const template = templates[automationId] || defaultTemplates[automationId];
      const automation = AUTOMATIONS.find(a => a.id === automationId);

      // Call backend API
      const response = await fetch("/api/automations/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          automationId,
          template,
          clientCount: stats.reachable
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setResults(prev => ({
          ...prev,
          [automationId]: {
            success: true,
            message: `✓ "${automation.label}" automation queued! Email drafted in Gmail + SMS queued via Square for ${stats.reachable} clients.`,
          },
        }));
      } else {
        throw new Error(data.message || "Failed to send automation");
      }
    } catch (err) {
      setResults(prev => ({
        ...prev,
        [automationId]: { success: false, message: `Error: ${err.message}` },
      }));
    }
    setSending(false);
  };

  const activeAutomation = AUTOMATIONS.find(a => a.id === activeModal);
  const activeTemplate = activeModal ? (templates[activeModal] || defaultTemplates[activeModal]) : null;

  return (
    <>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      <div style={{ padding: "1rem", maxWidth: 1200, margin: "0 auto", animation: "fadeIn 0.3s ease" }}>
        <h2 className="sr-only">Brows and Lashes Salon Automation Hub</h2>

        <div style={{
          display: "flex", alignItems: "center", gap: 12,
          marginBottom: "1.5rem",
          paddingBottom: "1rem",
          borderBottom: "0.5px solid var(--color-border-tertiary)",
        }}>
          <div style={{
            width: 40, height: 40, borderRadius: "var(--border-radius-md)",
            background: "#EEEDFE", display: "flex", alignItems: "center",
            justifyContent: "center", fontSize: 20,
          }}>✦</div>
          <div>
            <p style={{ margin: 0, fontWeight: 500, fontSize: 16 }}>Brows and Lashes</p>
            <p style={{ margin: 0, fontSize: 13, color: "var(--color-text-secondary)" }}>Automation Hub — Gmail + Square connected</p>
          </div>
          <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
            <Tag color="#1D9E75" bg="#E1F5EE">Gmail ✓</Tag>
            <Tag color="#7F77DD" bg="#EEEDFE">Square ✓</Tag>
          </div>
        </div>

        <div style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 12, marginBottom: "1.5rem",
        }}>
          {[
            { label: "Total clients", value: stats.customers },
            { label: "Reachable (email/SMS)", value: stats.reachable },
            { label: "Google rating", value: "4.9 ⭐" },
          ].map(s => (
            <div key={s.label} style={{
              background: "var(--color-background-secondary)",
              borderRadius: "var(--border-radius-md)",
              padding: "12px 16px",
            }}>
              <p style={{ margin: 0, fontSize: 12, color: "var(--color-text-secondary)" }}>{s.label}</p>
              <p style={{ margin: "4px 0 0", fontSize: 22, fontWeight: 500 }}>{s.value}</p>
            </div>
          ))}
        </div>

        {AUTOMATIONS.map((a) => (
          <div key={a.id} style={{
            background: "var(--color-background-primary)",
            border: "0.5px solid var(--color-border-tertiary)",
            borderRadius: "var(--border-radius-lg)",
            padding: "1rem 1.25rem",
            marginBottom: 10,
            display: "flex", alignItems: "center", gap: 14,
            flexWrap: "wrap",
          }}>
            <div style={{
              width: 40, height: 40, borderRadius: "var(--border-radius-md)",
              background: a.bg, display: "flex", alignItems: "center",
              justifyContent: "center", fontSize: 18, color: a.color,
              flexShrink: 0,
            }}>{a.icon}</div>

            <div style={{ flex: 1, minWidth: 200 }}>
              <p style={{ margin: 0, fontWeight: 500, fontSize: 15 }}>{a.label}</p>
              <p style={{ margin: "2px 0 0", fontSize: 13, color: "var(--color-text-secondary)" }}>{a.description}</p>
              <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
                <Tag color="#185FA5" bg="#E6F1FB">Email</Tag>
                <Tag color="#3B6D11" bg="#EAF3DE">SMS</Tag>
                <Tag color="#5F5E5A" bg="#F1EFE8">AI-written</Tag>
              </div>
            </div>

            {results[a.id]?.success && (
              <span style={{ fontSize: 13, color: "var(--color-text-success)", flexShrink: 0 }}>✓ Queued</span>
            )}

            <button
              onClick={() => handleOpenModal(a.id)}
              style={{
                padding: "8px 16px",
                borderRadius: "var(--border-radius-md)",
                border: `0.5px solid ${a.color}`,
                background: a.bg,
                color: a.color,
                cursor: "pointer",
                fontSize: 13,
                fontWeight: 500,
                flexShrink: 0,
                display: "flex", alignItems: "center", gap: 6,
              }}
            >
              {aiLoading[a.id] && <Spinner />}
              {aiLoading[a.id] ? "Writing..." : (results[a.id]?.success ? "Edit & Resend" : "Preview & Send")}
            </button>
          </div>
        ))}

        <div style={{
          background: "var(--color-background-secondary)",
          border: "0.5px solid var(--color-border-tertiary)",
          borderRadius: "var(--border-radius-lg)",
          padding: "1rem 1.25rem",
          marginTop: "1.5rem",
        }}>
          <p style={{ margin: "0 0 10px", fontWeight: 500, fontSize: 14 }}>Promo campaign settings</p>
          <p style={{ margin: "0 0 8px", fontSize: 12, color: "var(--color-text-secondary)" }}>Offer</p>
          <select
            value={promoOffer}
            onChange={e => { setPromoOffer(e.target.value); setGeneratedMessages(prev => ({ ...prev, promo: null })); }}
            style={{ width: "100%", marginBottom: 10, fontSize: 13, padding: "8px" }}
          >
            {promoOptions.map(o => <option key={o}>{o}</option>)}
          </select>

          {promoOffer === "Custom offer..." && (
            <>
              <p style={{ margin: "0 0 6px", fontSize: 12, color: "var(--color-text-secondary)" }}>Describe your offer</p>
              <input
                type="text"
                value={customPromo}
                onChange={e => { setCustomPromo(e.target.value); setGeneratedMessages(prev => ({ ...prev, promo: null })); }}
                placeholder="e.g. Free lash lift with any facial"
                style={{ width: "100%", marginBottom: 10, fontSize: 13, padding: "8px" }}
              />
            </>
          )}

          <p style={{ margin: "0 0 6px", fontSize: 12, color: "var(--color-text-secondary)" }}>Valid dates</p>
          <input
            type="text"
            value={promoDates}
            onChange={e => { setPromoDates(e.target.value); setGeneratedMessages(prev => ({ ...prev, promo: null })); }}
            placeholder="e.g. This Tuesday & Wednesday only"
            style={{ width: "100%", fontSize: 13, padding: "8px" }}
          />
        </div>

        <p style={{
          fontSize: 12, color: "var(--color-text-secondary)",
          marginTop: "1.25rem", textAlign: "center",
        }}>
          Messages are AI-written using your salon info, then queued via Gmail (email) and Square (SMS). Clients who opted out are automatically skipped.
        </p>
      </div>

      {activeModal && activeAutomation && (
        <PreviewModal
          automation={activeAutomation}
          template={aiLoading[activeModal]
            ? defaultTemplates[activeModal]
            : (templates[activeModal] || defaultTemplates[activeModal])}
          onClose={() => setActiveModal(null)}
          onSend={() => handleSend(activeModal)}
          sending={sending}
          result={results[activeModal]}
        />
      )}
    </>
  );
}
