import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api.js";

// --- Icons ---
const CheckBig = () => (
  <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
    <circle cx="32" cy="32" r="32" fill="#dcfce7" />
    <circle cx="32" cy="32" r="24" fill="#22c55e" />
    <path d="M20 32l8 8 16-16" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const DownloadIcon = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

const MailIcon = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

const RocketIcon = () => (
  <svg width="20" height="20" fill="none" stroke="#1d4ed8" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.48-.56.93-1.23 1.35-2h-4.35z" />
    <path d="M12 15l-3-3" />
    <path d="M15 12l-3-3" />
    <path d="M6.5 9.5c.34-.38.74-.75 1.15-1.12 3.12-2.83 8.35-4.38 12.35 1.62 4 6 2.45 11.23-.38 14.35-.37.41-.74.81-1.12 1.15" />
  </svg>
);

export default function EnterpriseSuccess() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);

  useEffect(() => {
    // Fetch mock data from backend
    api.getEnterpriseSuccess()
      .then(setData)
      .catch((err) => console.error("Failed to load details", err));
  }, []);

  if (!data) return <div style={{ padding: 40, textAlign: "center" }}>Loading confirmation...</div>;

  return (
    <div style={{ minHeight: "100vh", background: "#f1f5f9", fontFamily: "Inter, sans-serif", padding: 20 }}>
      
      {/* Top Header Bar */}
      <div style={{ 
        maxWidth: 1000, margin: "0 auto 20px auto", background: "#fff", padding: "12px 24px", 
        borderRadius: 12, display: "flex", justifyContent: "space-between", alignItems: "center",
        boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, fontWeight: 800, fontSize: 18, color: "#0f172a" }}>
          <div style={{ width: 24, height: 24, background: "#1d4ed8", borderRadius: 4 }}></div>
          StartupPitch
        </div>
        <div style={{ 
          background: "#dcfce7", color: "#166534", padding: "4px 12px", borderRadius: 20, 
          fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", gap: 6 
        }}>
          <span style={{ width: 8, height: 8, background: "#166534", borderRadius: "50%" }}></span>
          Plan Active
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        
        {/* Main Success Card */}
        <div style={{ background: "#fff", borderRadius: 20, padding: 40, textAlign: "center", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" }}>
          
          <div style={{ marginBottom: 24, display: "inline-block", filter: "drop-shadow(0 4px 6px rgba(34, 197, 94, 0.2))" }}>
            <CheckBig />
          </div>

          <h1 style={{ fontSize: 28, margin: "0 0 16px 0", color: "#0f172a" }}>Enterprise Plan Confirmed!</h1>
          
          <p style={{ color: "#64748b", lineHeight: 1.6, maxWidth: 500, margin: "0 auto 32px auto" }}>
            Welcome to our Premium Service. The custom agreement for <b style={{ color: "#0f172a" }}>{data.company_name}</b> has been successfully processed. Your team now has full access to all enterprise features.
          </p>

          {/* Details Table */}
          <div style={{ background: "#f8fafc", borderRadius: 12, padding: 24, maxWidth: 500, margin: "0 auto 32px auto", textAlign: "left" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", rowGap: 16 }}>
              
              <div style={{ color: "#64748b", fontSize: 14 }}>Reference ID</div>
              <div style={{ fontWeight: 600, color: "#0f172a", fontSize: 14 }}>#{data.reference_id}</div>

              <div style={{ color: "#64748b", fontSize: 14 }}>Invoice Status</div>
              <div>
                <span style={{ background: "#eff6ff", color: "#1d4ed8", fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 4 }}>
                  ● {data.invoice_status}
                </span>
              </div>

              <div style={{ color: "#64748b", fontSize: 14 }}>Sent to</div>
              <div style={{ fontWeight: 600, color: "#0f172a", fontSize: 14 }}>{data.sent_to_email}</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: "flex", gap: 16, justifyContent: "center" }}>
            <button 
              onClick={() => navigate("/dashboard")}
              style={{ 
                background: "#1d4ed8", color: "#fff", border: "none", padding: "12px 32px", 
                borderRadius: 8, fontWeight: 600, fontSize: 14, cursor: "pointer",
                boxShadow: "0 4px 6px -1px rgba(29, 78, 216, 0.2)"
              }}
            >
              Go to Dashboard
            </button>

            <button 
              style={{ 
                background: "#fff", color: "#334155", border: "1px solid #e2e8f0", padding: "12px 24px", 
                borderRadius: 8, fontWeight: 600, fontSize: 14, cursor: "pointer",
                display: "flex", alignItems: "center", gap: 8
              }}
            >
              <DownloadIcon /> Download Invoice
            </button>
          </div>
        </div>

        {/* Bottom Section: Manager & Steps */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginTop: 20 }}>
          
          {/* Manager Card */}
          <div style={{ background: "#fff", borderRadius: 16, padding: 24, boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#eff6ff", color: "#1d4ed8", display: "grid", placeItems: "center", fontWeight: 700 }}>
                SJ
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14, color: "#0f172a" }}>{data.account_manager.name}</div>
                <div style={{ fontSize: 11, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>{data.account_manager.role}</div>
              </div>
              <div style={{ width: 8, height: 8, background: "#22c55e", borderRadius: "50%", marginLeft: "auto" }}></div>
            </div>
            
            <div style={{ fontSize: 13, color: "#64748b", lineHeight: 1.5, marginBottom: 20, fontStyle: "italic" }}>
              "{data.account_manager.message}"
            </div>

            <button style={{ 
              width: "100%", padding: "10px", background: "#f8fafc", border: "1px solid #e2e8f0", 
              borderRadius: 8, fontWeight: 600, color: "#0f172a", fontSize: 13, cursor: "pointer",
              display: "flex", justifyContent: "center", alignItems: "center", gap: 8 
            }}>
              <MailIcon /> Contact Sarah
            </button>
          </div>

          {/* Next Steps Card */}
          <div style={{ background: "#fff", borderRadius: 16, padding: 24, boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
              <RocketIcon />
              <div style={{ fontWeight: 700, fontSize: 15, color: "#0f172a" }}>Next Steps</div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {data.next_steps.map((step, i) => (
                <div key={i} style={{ display: "flex", gap: 12 }}>
                  <div style={{ paddingTop: 2 }}>
                    {step.status === "completed" ? (
                      <div style={{ color: "#22c55e" }}>✔</div>
                    ) : step.status === "pending" ? (
                      <div style={{ width: 14, height: 14, border: "2px solid #3b82f6", borderRadius: "50%", borderTopColor: "transparent" }}></div> 
                    ) : (
                      <div style={{ width: 14, height: 14, border: "2px solid #e2e8f0", borderRadius: "50%" }}></div>
                    )}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 13, color: step.status === "waiting" ? "#94a3b8" : "#0f172a" }}>
                      {step.label}
                    </div>
                    <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>
                      {step.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer Link */}
        <div style={{ textAlign: "center", marginTop: 24, fontSize: 12, color: "#94a3b8" }}>
          Need help with your invoice? <a href="#" style={{ color: "#3b82f6", textDecoration: "none" }}>Contact Billing Support</a>
        </div>

      </div>
    </div>
  );
}
