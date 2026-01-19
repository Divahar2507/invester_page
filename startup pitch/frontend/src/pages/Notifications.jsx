import React from "react";
import DashShell from "../components/DashShell.jsx";

// --- Icons ---
const EyeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const MsgIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  </svg>
);

const MegaIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2l3 6h4a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-4l-3 6" />
    <path d="M12 2H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h6" />
  </svg>
);

const DownloadIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

// --- Dummy Data ---
const NOTIFICATIONS = [
  {
    id: 1,
    type: "view",
    // Using inline styles for bolding specific parts of the text to match screenshot
    title: <span>New view on <span style={{ color: "#1d4ed8", fontWeight: 700 }}>TechNova Series A Deck</span></span>,
    desc: <span><span style={{ fontWeight: 700 }}>Venture Capital Partners</span> viewed your pitch deck from the simplified link.</span>,
    time: "2m ago",
    iconColor: "#eff6ff", // Blue background
    iconFill: "#1d4ed8",  // Blue icon
    Icon: EyeIcon
  },
  {
    id: 2,
    type: "msg",
    title: <span>Message from <span style={{ fontWeight: 700 }}>Sarah Jenkins</span></span>,
    desc: <span>"Hi team, we reviewed the deck and have a few questions regarding the go-to-market strategy..."</span>,
    time: "1h ago",
    iconColor: "#ecfdf5", // Green background
    iconFill: "#059669",  // Green icon
    Icon: MsgIcon
  },
  {
    id: 3,
    type: "feature",
    title: <span>New Feature: <span style={{ fontWeight: 700 }}>AI Pitch Analysis</span></span>,
    desc: "Get instant feedback on your pitch deck structure and content with our new AI tools.",
    time: "4h ago",
    iconColor: "#fffbeb", // Amber background
    iconFill: "#d97706",  // Amber icon
    Icon: MegaIcon
  },
  {
    id: 4,
    type: "view",
    title: <span>New view on <span style={{ color: "#1d4ed8", fontWeight: 700 }}>TechNova Series A Deck</span></span>,
    desc: <span><span style={{ fontWeight: 700 }}>Sequoia Capital</span> viewed your pitch deck.</span>,
    time: "Yesterday",
    iconColor: "#eff6ff",
    iconFill: "#1d4ed8",
    Icon: EyeIcon
  },
  {
    id: 5,
    type: "download",
    title: <span style={{ fontWeight: 700 }}>Deck Downloaded</span>,
    desc: <span><span style={{ fontWeight: 700 }}>Michael Chen</span> downloaded "TechNova Financials Q3".</span>,
    time: "2 days ago",
    iconColor: "#f3edff", // Purple background
    iconFill: "#7c3aed",  // Purple icon
    Icon: DownloadIcon
  }
];

export default function Notifications() {
  return (
    <DashShell>
      <div className="dash-content" style={{ maxWidth: 880, margin: "0 auto", padding: "32px 24px" }}>
        
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32 }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 700, margin: "0 0 8px 0", color: "#0f172a" }}>Notifications</h1>
            <p style={{ color: "#64748b", margin: 0 }}>Stay updated on your pitch activity and messages.</p>
          </div>
          
          <div style={{ position: "relative" }}>
            <select style={{ 
              appearance: "none", padding: "10px 36px 10px 16px", borderRadius: 8, 
              border: "1px solid #e2e8f0", background: "#fff", fontWeight: 600, color: "#334155",
              fontSize: 13, cursor: "pointer", outline: "none"
            }}>
              <option>All Notifications</option>
              <option>Unread</option>
              <option>Mentions</option>
            </select>
            <div style={{ position: "absolute", right: 14, top: 12, pointerEvents: "none", fontSize: 10 }}>▼</div>
          </div>
        </div>

        {/* Notification List */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {NOTIFICATIONS.map(n => (
            <div key={n.id} style={{
              display: "flex", alignItems: "flex-start", gap: 16,
              background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12,
              padding: 20, transition: "box-shadow 0.2s"
            }}>
              {/* Icon */}
              <div style={{
                width: 44, height: 44, borderRadius: "50%",
                background: n.iconColor, color: n.iconFill,
                display: "grid", placeItems: "center",
                flexShrink: 0
              }}>
                <n.Icon />
              </div>
              
              {/* Content */}
              <div style={{ flex: 1, paddingTop: 2 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div style={{ fontSize: 15, color: "#0f172a", lineHeight: 1.4 }}>
                    {n.title}
                  </div>
                  <div style={{ fontSize: 12, color: "#94a3b8", fontWeight: 500, whiteSpace: "nowrap", marginLeft: 12 }}>
                    {n.time}
                  </div>
                </div>
                
                <div style={{ marginTop: 4, color: "#64748b", fontSize: 14, lineHeight: 1.5 }}>
                  {n.desc}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: 40, fontSize: 13, color: "#94a3b8" }}>
          End of notifications
        </div>
      </div>
    </DashShell>
  );
}
