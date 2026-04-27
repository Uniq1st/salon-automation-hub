import { useState } from "react";
import Spinner from "./Spinner";

function PreviewModal({ automation, template, onClose, onSend, sending, result, clientCount }) {
  const [tab, setTab] = useState("email");
  const [testMode, setTestMode] = useState(true);

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 100, padding: "1rem",
    }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{
        background: "var(--color-background-primary)",
        border: "0.5px solid var(--color-border-tertiary)",
        borderRadius: "var(--border-radius-lg)",
        width: "100%", maxWidth: 560,
        maxHeight: "80vh", overflowY: "auto",
        padding: "1.5rem",
      }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <div>
            <p style={{ margin: 0, fontWeight: 500, fontSize: 16 }}>{automation.label}</p>
            <p style={{ margin: 0, fontSize: 13, color: "var(--color-text-secondary)" }}>{automation.description}</p>
          </div>
          <button onClick={onClose} style={{
            background: "none", border: "none", cursor: "pointer",
            fontSize: 20, color: "var(--color-text-secondary)", lineHeight: 1,
          }}>×</button>
        </div>

        {/* Test mode toggle */}
        <div style={{
          background: testMode ? "#FFF8E7" : "#FEF0EE",
          border: `1px solid ${testMode ? "#F5C842" : "#D85A30"}`,
          borderRadius: "var(--border-radius-md)",
          padding: "10px 14px",
          marginBottom: "1rem",
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
        }}>
          <div>
            <p style={{ margin: 0, fontSize: 13, fontWeight: 500, color: testMode ? "#92660A" : "#D85A30" }}>
              {testMode ? "Test mode — sends only to you" : `Live mode — sends to ${clientCount} real clients`}
            </p>
            <p style={{ margin: "2px 0 0", fontSize: 12, color: "var(--color-text-secondary)" }}>
              {testMode
                ? "Safe to click. Toggle off when ready for the real campaign."
                : "This will email all your clients. Make sure the message looks right first."}
            </p>
          </div>
          <button
            onClick={() => setTestMode(t => !t)}
            style={{
              flexShrink: 0,
              padding: "6px 12px",
              borderRadius: "var(--border-radius-md)",
              border: `1px solid ${testMode ? "#F5C842" : "#D85A30"}`,
              background: testMode ? "#F5C842" : "#D85A30",
              color: testMode ? "#92660A" : "#fff",
              cursor: "pointer", fontSize: 12, fontWeight: 600,
            }}
          >
            {testMode ? "Switch to Live" : "Back to Test"}
          </button>
        </div>

        {/* Email / SMS tabs */}
        <div style={{ display: "flex", gap: 8, marginBottom: "1rem" }}>
          {["email", "sms"].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding: "6px 14px", borderRadius: "var(--border-radius-md)",
              border: tab === t ? `0.5px solid ${automation.color}` : "0.5px solid var(--color-border-tertiary)",
              background: tab === t ? automation.bg : "transparent",
              color: tab === t ? automation.color : "var(--color-text-secondary)",
              fontWeight: tab === t ? 500 : 400,
              cursor: "pointer", fontSize: 13,
            }}>
              {t === "email" ? "Email" : "SMS"}
            </button>
          ))}
        </div>

        {tab === "email" && (
          <div style={{ marginBottom: "1rem" }}>
            <p style={{ fontSize: 12, color: "var(--color-text-secondary)", margin: "0 0 4px" }}>Subject</p>
            <div style={{
              background: "var(--color-background-secondary)",
              borderRadius: "var(--border-radius-md)",
              padding: "10px 14px", fontSize: 14,
              border: "0.5px solid var(--color-border-tertiary)",
              marginBottom: 12,
            }}>{template.subject}</div>
            <p style={{ fontSize: 12, color: "var(--color-text-secondary)", margin: "0 0 4px" }}>Body</p>
            <div style={{
              background: "var(--color-background-secondary)",
              borderRadius: "var(--border-radius-md)",
              padding: "12px 14px", fontSize: 13,
              border: "0.5px solid var(--color-border-tertiary)",
              whiteSpace: "pre-wrap", lineHeight: 1.7,
            }}>{template.email}</div>
          </div>
        )}

        {tab === "sms" && (
          <div style={{
            background: "var(--color-background-secondary)",
            borderRadius: "var(--border-radius-md)",
            padding: "12px 14px", fontSize: 13,
            border: "0.5px solid var(--color-border-tertiary)",
            whiteSpace: "pre-wrap", lineHeight: 1.7,
            marginBottom: "1rem",
          }}>{template.sms}</div>
        )}

        <p style={{ fontSize: 12, color: "var(--color-text-secondary)", margin: "0 0 1rem" }}>
          Variables like <code style={{ fontSize: 11 }}>{"{first_name}"}</code> are auto-filled from your Square customer data.
        </p>

        {result && (
          <div style={{
            background: result.success ? "var(--color-background-success)" : "var(--color-background-danger)",
            color: result.success ? "var(--color-text-success)" : "var(--color-text-danger)",
            borderRadius: "var(--border-radius-md)",
            padding: "10px 14px", fontSize: 13, marginBottom: "1rem",
          }}>{result.message}</div>
        )}

        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <button onClick={onClose} style={{
            padding: "8px 16px", borderRadius: "var(--border-radius-md)",
            border: "0.5px solid var(--color-border-secondary)",
            background: "transparent", cursor: "pointer", fontSize: 14,
            color: "var(--color-text-secondary)",
          }}>Cancel</button>
          <button onClick={() => onSend(testMode)} disabled={sending} style={{
            padding: "8px 16px", borderRadius: "var(--border-radius-md)",
            border: "none",
            background: testMode ? "#F5C842" : automation.color,
            color: testMode ? "#92660A" : "#fff",
            cursor: sending ? "not-allowed" : "pointer", fontSize: 14,
            fontWeight: 500, opacity: sending ? 0.7 : 1,
            display: "flex", alignItems: "center", gap: 4,
          }}>
            {sending && <Spinner />}
            {sending
              ? (testMode ? "Sending test..." : "Sending to clients...")
              : (testMode ? "Send Test to Me" : `Send to ${clientCount} Clients`)}
          </button>
        </div>
      </div>
    </div>
  );
}

export default PreviewModal;
