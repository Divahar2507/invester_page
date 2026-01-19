import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashShell from "../components/DashShell.jsx";
import { api } from "../api.js";
import { getName } from "../auth.js";

// Simple Icons
const CheckCircle = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="#155eef">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
  </svg>
);

const DocIcon = () => (
  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
  </svg>
);

const BankIcon = () => (
  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M3 21h18M5 21v-7M19 21v-7M4 10h16v4h-16zM2 10l10-7 10 7" />
  </svg>
);

const CardIcon = () => (
  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
    <line x1="1" y1="10" x2="23" y2="10" />
  </svg>
);

export default function EnterpriseReview() {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState("invoice"); // invoice | wire | card
  const [loading, setLoading] = useState(false);
  const [companyName, setCompanyName] = useState("Acme Corp");

  // Fetch real company name
  useEffect(() => {
    api.me().then(u => {
      if(u.company_name) setCompanyName(u.company_name);
    }).catch(() => {});
  }, []);

  async function onConfirm() {
    setLoading(true);
    try {
      if (paymentMethod === "card") {
        // Here you would initialize Razorpay
        // const options = { key: "rzp_test_...", ... };
        // const rzp1 = new Razorpay(options);
        // rzp1.open();
        alert("Razorpay integration coming soon! (Mock Success)");
      }
      
      await api.confirmEnterprise({ payment_method: paymentMethod });
      
      // Navigate to success page
      navigate("/upgrade/success", {
        state: {
          planName: "Enterprise Custom",
          billing: "annually",
          amount: "25,000",
          nextDate: "Oct 24, 2024"
        }
      });
    } catch (e) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  }

  // Styles for the option cards
  const optionStyle = (type) => ({
    display: "flex",
    alignItems: "flex-start",
    gap: 14,
    padding: 16,
    border: paymentMethod === type ? "2px solid #155eef" : "1px solid #e2e8f0",
    borderRadius: 12,
    background: paymentMethod === type ? "#eff4ff" : "#fff",
    cursor: "pointer",
    transition: "all 0.2s",
    marginBottom: 12
  });

  return (
    <DashShell>
      <div className="dash-content">
        
        {/* Header */}
        <div style={{ marginBottom: 30 }}>
          <h1 style={{ fontSize: 32, margin: "0 0 6px 0", letterSpacing: "-0.02em" }}>Review Your Enterprise Agreement</h1>
          <div style={{ color: "#64748b" }}>Prepared for <b style={{ color: "#155eef" }}>{companyName}</b> on {new Date().toLocaleDateString()}</div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 30, alignItems: "start" }}>
          
          {/* Left Column: Agreement Details */}
          <div className="card" style={{ padding: 30, background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <h2 style={{ fontSize: 20, margin: 0, fontWeight: 700 }}>Enterprise Custom Plan</h2>
                <div style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>Quote ID: #Q-2023-8842</div>
              </div>
              <div style={{ background: "#eff6ff", color: "#155eef", fontSize: 11, fontWeight: 800, padding: "6px 10px", borderRadius: 6 }}>
                CUSTOM QUOTE
              </div>
            </div>

            <div style={{ margin: "24px 0", borderBottom: "1px solid #f1f5f9", paddingBottom: 24 }}>
              <div style={{ fontSize: 48, fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1 }}>
                $25,000 <span style={{ fontSize: 16, fontWeight: 600, color: "#64748b", letterSpacing: "0" }}>/ year</span>
              </div>
              <div style={{ marginTop: 10, color: "#64748b", fontSize: 14 }}>
                Billed annually. Next billing date: Oct 24, 2024.
              </div>
            </div>

            <div style={{ marginBottom: 30 }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: "#94a3b8", letterSpacing: "0.05em", marginBottom: 16 }}>
                INCLUDED IN YOUR PLAN
              </div>
              
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px 24px" }}>
                {[
                  "Dedicated Account Manager", "Unlimited Pitch Deck Export",
                  "Investor Matching Algorithm", "White-glove Deck Design",
                  "Full API Access", "SSO & Advanced Security"
                ].map((item) => (
                  <div key={item} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, fontWeight: 500, color: "#334155" }}>
                    <CheckCircle /> {item}
                  </div>
                ))}
              </div>
            </div>

            <button 
              type="button" 
              style={{ background: "transparent", border: 0, color: "#155eef", fontWeight: 700, fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Download Official Quote (PDF)
            </button>
          </div>

          {/* Right Column: Payment Method */}
          <div>
            <div className="card" style={{ padding: 24, background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16 }}>
              <h3 style={{ margin: "0 0 20px 0", fontSize: 18 }}>Select Payment Method</h3>

              {/* Invoice Option */}
              <div onClick={() => setPaymentMethod("invoice")} style={optionStyle("invoice")}>
                <div style={{ 
                  width: 20, height: 20, borderRadius: "50%", border: paymentMethod === "invoice" ? "6px solid #155eef" : "2px solid #cbd5e1",
                  flexShrink: 0, marginTop: 2 
                }} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <div style={{ fontWeight: 700, color: "#0f172a" }}>Invoice / Net 30</div>
                    <div style={{ color: "#64748b" }}><DocIcon /></div>
                  </div>
                  <div style={{ fontSize: 13, color: "#64748b", marginTop: 4, lineHeight: 1.4 }}>
                    Generate an official invoice for your finance team. Due in 30 days.
                  </div>
                </div>
              </div>

              {/* Wire Option */}
              <div onClick={() => setPaymentMethod("wire")} style={optionStyle("wire")}>
                <div style={{ 
                  width: 20, height: 20, borderRadius: "50%", border: paymentMethod === "wire" ? "6px solid #155eef" : "2px solid #cbd5e1",
                  flexShrink: 0, marginTop: 2 
                }} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <div style={{ fontWeight: 700, color: "#0f172a" }}>Wire Transfer</div>
                    <div style={{ color: "#64748b" }}><BankIcon /></div>
                  </div>
                  <div style={{ fontSize: 13, color: "#64748b", marginTop: 4, lineHeight: 1.4 }}>
                    View banking details (ACH/Swift) for direct wire transfer.
                  </div>
                </div>
              </div>

              {/* Card Option */}
              <div onClick={() => setPaymentMethod("card")} style={optionStyle("card")}>
                <div style={{ 
                  width: 20, height: 20, borderRadius: "50%", border: paymentMethod === "card" ? "6px solid #155eef" : "2px solid #cbd5e1",
                  flexShrink: 0, marginTop: 2 
                }} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <div style={{ fontWeight: 700, color: "#0f172a" }}>Corporate Credit Card</div>
                    <div style={{ color: "#64748b" }}><CardIcon /></div>
                  </div>
                  <div style={{ fontSize: 13, color: "#64748b", marginTop: 4, lineHeight: 1.4 }}>
                    Securely pay via Stripe/Razorpay portal with a corporate card (+3% fee).
                  </div>
                </div>
              </div>

              {/* Actions */}
              <button 
                className="btnPrimary" 
                style={{ width: "100%", height: 48, justifyContent: "center", marginTop: 12, fontSize: 15 }}
                onClick={onConfirm}
                disabled={loading}
              >
                {loading ? "Processing..." : "Confirm Custom Plan"}
              </button>
              
              <button 
                type="button"
                onClick={() => navigate("/upgrade")}
                style={{ 
                  width: "100%", height: 48, marginTop: 12, background: "#fff", border: "1px solid #e2e8f0", 
                  borderRadius: 10, fontWeight: 700, color: "#0f172a", cursor: "pointer" 
                }}
              >
                Back to Sales Form
              </button>

            </div>

            {/* Footer Badges */}
            <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 24 }}>
              {["SOC2 Type II", "GDPR Ready", "256-bit SSL"].map(txt => (
                <div key={txt} style={{ border: "1px solid #e2e8f0", borderRadius: 4, padding: "4px 8px", fontSize: 10, color: "#94a3b8", background: "#fff" }}>
                  {txt}
                </div>
              ))}
            </div>
            <div style={{ textAlign: "center", marginTop: 10, fontSize: 11, color: "#cbd5e1" }}>
              All transactions are secure and encrypted.
            </div>
          </div>
        </div>

      </div>
    </DashShell>
  );
}
