import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashShell from "../components/DashShell.jsx";
import { api } from "../api.js";

export default function ContactSales() {
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    full_name: "",
    work_email: "",
    company_name: "",
    mobile_number: "",
    team_size: "1-10 employees",
    specific_needs: "",
  });

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);

    try {
      await api.contactSales(form);
      setSuccess(true);
    } catch (err) {
      setError(err.message || "Failed to send inquiry. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  if (success) {
    return (
      <DashShell>
        <div className="dash-content" style={{ display: 'grid', placeItems: 'center', height: '100%' }}>
          <div className="card" style={{ padding: 40, textAlign: 'center', maxWidth: 480 }}>
            <div style={{ fontSize: 48, marginBottom: 20 }}>🚀</div>
            <h2 style={{ fontSize: 24, margin: '0 0 10px 0' }}>Inquiry Sent!</h2>
            <p style={{ color: '#64748b', lineHeight: 1.6 }}>
              Thanks for reaching out, <b>{form.full_name}</b>. <br/>
              Our sales team will review your requirements and get back to you at <b>{form.work_email}</b> within 24 hours.
            </p>
            <button 
              className="btnPrimary" 
              style={{ marginTop: 24, width: '100%', justifyContent: 'center' }}
              onClick={() => navigate("/dashboard")}
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      </DashShell>
    );
  }

  return (
    <DashShell>
      <div className="dash-content">
        {/* Back Link */}
        <button 
          className="backLink" 
          type="button" 
          onClick={() => navigate("/settings")} // or /upgrade based on flow
          style={{ marginBottom: 20 }}
        >
          ← Back
        </button>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 40, alignItems: 'start' }}>
          
          {/* Left Side: Info */}
          <div style={{ paddingRight: 20 }}>
            <div style={{ 
              display: 'inline-block', 
              background: '#eff6ff', 
              color: '#1f4ed8', 
              fontWeight: 800, 
              fontSize: 11, 
              padding: '4px 10px', 
              borderRadius: 6, 
              marginBottom: 12 
            }}>
              ENTERPRISE
            </div>
            
            <h1 style={{ fontSize: 36, margin: '0 0 16px 0', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
              Contact Sales
            </h1>
            
            <p style={{ color: '#64748b', fontSize: 16, lineHeight: 1.6, maxWidth: 360 }}>
              Ready to scale? Our Enterprise plan offers unlimited team members, advanced API access, and dedicated support tailored to your startup’s growth.
            </p>

            <div style={{ marginTop: 40 }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: '#94a3b8', letterSpacing: '0.05em', marginBottom: 20 }}>
                WHAT TO EXPECT NEXT
              </div>

              <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
                <div style={{ 
                  width: 40, height: 40, borderRadius: '50%', background: '#ecfdf5', 
                  color: '#059669', display: 'grid', placeItems: 'center', fontSize: 18 
                }}>
                  📨
                </div>
                <div>
                  <div style={{ fontWeight: 700, color: '#0f172a' }}>Quick Response</div>
                  <div style={{ fontSize: 13, color: '#64748b', marginTop: 4, lineHeight: 1.5 }}>
                    Our team will review your inquiry and reach out within 24 hours.
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 16 }}>
                <div style={{ 
                  width: 40, height: 40, borderRadius: '50%', background: '#eff6ff', 
                  color: '#1d4ed8', display: 'grid', placeItems: 'center', fontSize: 18 
                }}>
                  🎧
                </div>
                <div>
                  <div style={{ fontWeight: 700, color: '#0f172a' }}>Custom Consultation</div>
                  <div style={{ fontSize: 13, color: '#64748b', marginTop: 4, lineHeight: 1.5 }}>
                    We’ll schedule a call to understand your specific needs.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Form */}
          <div className="card" style={{ padding: 32 }}>
            <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {error && <div className="alert error">{error}</div>}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="field">
                  <label>Full Name *</label>
                  <input 
                    required 
                    value={form.full_name} 
                    onChange={e => setForm({...form, full_name: e.target.value})}
                    placeholder="e.g. Alex Morgan" 
                  />
                </div>
                <div className="field">
                  <label>Work Email *</label>
                  <input 
                    required 
                    type="email"
                    value={form.work_email} 
                    onChange={e => setForm({...form, work_email: e.target.value})}
                    placeholder="alex@company.com" 
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="field">
                  <label>Company Name *</label>
                  <input 
                    required 
                    value={form.company_name} 
                    onChange={e => setForm({...form, company_name: e.target.value})}
                    placeholder="e.g. PitchDeck AI" 
                  />
                </div>
                <div className="field">
                  <label>Mobile Number</label>
                  <input 
                    value={form.mobile_number} 
                    onChange={e => setForm({...form, mobile_number: e.target.value})}
                    placeholder="+1 (555) 000-0000" 
                  />
                </div>
              </div>

              <div className="field">
                <label>Current Team Size</label>
                <select 
                  style={{ 
                    width: '100%', height: 44, padding: '0 14px', border: '1px solid #e2e8f0', 
                    borderRadius: 8, background: '#fff', color: '#0f172a' 
                  }}
                  value={form.team_size}
                  onChange={e => setForm({...form, team_size: e.target.value})}
                >
                  <option>1-10 employees</option>
                  <option>11-50 employees</option>
                  <option>51-200 employees</option>
                  <option>201+ employees</option>
                </select>
              </div>

              <div className="field">
                <label>Specific Needs / Questions</label>
                <textarea 
                  rows={4}
                  style={{ 
                    width: '100%', padding: 14, border: '1px solid #e2e8f0', 
                    borderRadius: 8, resize: 'vertical', fontFamily: 'inherit' 
                  }}
                  placeholder="Tell us about your custom requirements, expected volume, or any questions regarding the Enterprise features..."
                  value={form.specific_needs}
                  onChange={e => setForm({...form, specific_needs: e.target.value})}
                />
              </div>

              <button className="btnPrimary" style={{ height: 46, marginTop: 10, justifyContent: 'center' }} disabled={busy}>
                {busy ? "Sending..." : "Submit Inquiry ➤"}
              </button>
              
              <div style={{ fontSize: 12, color: '#94a3b8', textAlign: 'center', marginTop: 8 }}>
                By submitting this form, you agree to our <a href="#" style={{ color: '#94a3b8', textDecoration: 'underline' }}>Privacy Policy</a>.
              </div>
            </form>
          </div>
        </div>
      </div>
    </DashShell>
  );
}