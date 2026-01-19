import React, { useState } from "react";
import DashShell from "../components/DashShell.jsx";

// --- Icons ---
const EyeIcon = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const DownloadIcon = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

const SearchIcon = () => (
  <svg width="18" height="18" fill="none" stroke="#94a3b8" strokeWidth="2" viewBox="0 0 24 24">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const KebabIcon = () => (
  <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
    <circle cx="12" cy="5" r="2" />
    <circle cx="12" cy="12" r="2" />
    <circle cx="12" cy="19" r="2" />
  </svg>
);

// --- Dummy Data ---
const PITCHES_DATA = [
  {
    id: 1,
    title: "TechNova Series A Deck",
    subtitle: "v4.2 - Final for Investors",
    status: "Shared",
    views: 142,
    downloads: 12,
    lastMod: "2h ago",
    thumbColor: "linear-gradient(135deg, #bfdbfe 0%, #60a5fa 100%)", // Blue
    icon: null,
  },
  {
    id: 2,
    title: "Q4 Financial Update",
    subtitle: "Draft - Internal Review",
    status: "Draft",
    views: null, // Hidden
    downloads: null,
    lastMod: "Oct 24, 2023",
    thumbColor: "#f1f5f9", // Gray
    icon: "📊",
  },
  {
    id: 3,
    title: "Seed Round Extension",
    subtitle: "v1.0",
    status: "Under Review",
    views: 5,
    downloads: 0,
    lastMod: "Yesterday",
    thumbColor: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)", // Dark
    icon: null,
  }
];

// --- Sub-components ---

function StatusBadge({ status }) {
  const styles = {
    Shared: { bg: "#ecfdf5", color: "#059669", dot: "#059669" },
    Draft: { bg: "#f1f5f9", color: "#475569", dot: "#94a3b8" },
    "Under Review": { bg: "#fffbeb", color: "#d97706", dot: "#d97706" },
  };

  const s = styles[status] || styles.Draft;

  return (
    <div style={{ 
      display: "inline-flex", alignItems: "center", gap: 6, 
      background: s.bg, color: s.color, padding: "4px 10px", 
      borderRadius: 999, fontSize: 12, fontWeight: 700, border: "1px solid transparent" 
    }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: s.dot }} />
      {status}
    </div>
  );
}

export default function MyPitches() {
  const [search, setSearch] = useState("");

  const filtered = PITCHES_DATA.filter(p => 
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashShell>
      <div className="dash-content" style={{ padding: "32px 40px" }}>
        
        {/* Header Section */}
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 28, margin: "0 0 8px 0", color: "#0f172a" }}>My Pitches</h1>
          <p style={{ color: "#64748b", margin: 0 }}>
            Manage your decks, track investor engagement, and close deals faster.
          </p>
        </div>

        {/* Controls Bar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <div style={{ position: "relative", width: 320 }}>
            <div style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", display: "grid", placeItems: "center" }}>
              <SearchIcon />
            </div>
            <input 
              placeholder="Search by pitch name..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: "100%", height: 44, paddingLeft: 40, paddingRight: 16,
                border: "1px solid #e2e8f0", borderRadius: 8, fontSize: 14, outline: "none"
              }}
            />
          </div>

          <button style={{ 
            height: 44, padding: "0 20px", background: "#1d4ed8", color: "#fff", 
            border: "none", borderRadius: 8, fontWeight: 700, fontSize: 14, 
            cursor: "pointer", display: "flex", alignItems: "center", gap: 8,
            boxShadow: "0 4px 6px -1px rgba(29, 78, 216, 0.2)"
          }}>
            <span style={{ fontSize: 18 }}>+</span> Create New Pitch
          </button>
        </div>

        {/* List Table Header */}
        <div style={{ display: "grid", gridTemplateColumns: "2.5fr 1fr 1fr 0.5fr 40px", padding: "0 16px 12px 16px", borderBottom: "1px solid #e2e8f0", color: "#94a3b8", fontSize: 11, fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase" }}>
          <div>Name</div>
          <div style={{ textAlign: "center" }}>Status</div>
          <div style={{ textAlign: "center" }}>Performance</div>
          <div style={{ textAlign: "right" }}>Last Modified</div>
          <div></div>
        </div>

        {/* List Items */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 12 }}>
          {filtered.map((pitch) => (
            <div key={pitch.id} style={{ 
              display: "grid", gridTemplateColumns: "2.5fr 1fr 1fr 0.5fr 40px", alignItems: "center",
              background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: 16,
              transition: "box-shadow 0.2s"
            }}>
              
              {/* Name Column */}
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ 
                  width: 64, height: 44, borderRadius: 6, background: pitch.thumbColor, 
                  display: "grid", placeItems: "center", fontSize: 20, flexShrink: 0 
                }}>
                  {pitch.icon}
                </div>
                <div>
                  <div style={{ fontWeight: 700, color: "#0f172a" }}>{pitch.title}</div>
                  <div style={{ fontSize: 13, color: "#64748b", marginTop: 2 }}>{pitch.subtitle}</div>
                </div>
              </div>

              {/* Status Column */}
              <div style={{ textAlign: "center" }}>
                <StatusBadge status={pitch.status} />
              </div>

              {/* Performance Column */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, color: "#64748b", fontSize: 14 }}>
                {pitch.views !== null ? (
                  <>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ color: "#1d4ed8" }}><EyeIcon /></span> 
                      <span style={{ fontWeight: 700, color: "#0f172a" }}>{pitch.views}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ color: "#64748b" }}><DownloadIcon /></span> 
                      <span style={{ fontWeight: 600 }}>{pitch.downloads}</span>
                    </div>
                  </>
                ) : (
                  <span style={{ display: "flex", gap: 16, opacity: 0.5 }}>
                    <span style={{ textDecoration: "line-through" }}><EyeIcon /></span>
                    <span style={{ textDecoration: "line-through" }}><DownloadIcon /></span>
                  </span>
                )}
              </div>

              {/* Date Column */}
              <div style={{ textAlign: "right", color: "#64748b", fontSize: 13 }}>
                {pitch.lastMod}
              </div>

              {/* Menu Column */}
              <div style={{ textAlign: "right" }}>
                <button style={{ background: "transparent", border: "none", color: "#94a3b8", cursor: "pointer", padding: 4 }}>
                  <KebabIcon />
                </button>
              </div>

            </div>
          ))}

          {filtered.length === 0 && (
            <div style={{ padding: 40, textAlign: "center", color: "#94a3b8" }}>
              No pitches found matching "{search}"
            </div>
          )}
        </div>

      </div>
    </DashShell>
  );
}