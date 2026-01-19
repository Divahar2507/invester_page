import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashShell from "../components/DashShell.jsx";
import { api } from "../api.js";

export default function EditProfile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form State
  const [form, setForm] = useState({
    company_name: "",
    industry: "",
    funding_stage: "Seed",
    contact_email: "",
    vision: "",
    problem: "",
    solution: "",
    arr: "",
    users: "",
    cac: "",
    retention: "",
  });

  // Load existing data
  useEffect(() => {
    api.getProfile()
      .then((data) => {
        setForm({
          company_name: data.company_name || "",
          industry: data.industry || "",
          funding_stage: data.funding_stage || "Seed",
          contact_email: data.contact_email || "",
          vision: data.vision || "",
          problem: data.problem || "",
          solution: data.solution || "",
          arr: data.arr || "",
          users: data.users || "",
          cac: data.cac || "",
          retention: data.retention || "",
        });
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  async function onSave(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await api.updateProfile(form);
      navigate("/company-profile"); // Return to profile page
    } catch (err) {
      alert("Failed to save: " + err.message);
    } finally {
      setSaving(false);
    }
  }

  const sectionStyle = {
    background: "#fff",
    border: "1px solid #e2e8f0",
    borderRadius: 12,
    padding: 24,
    marginBottom: 24,
  };

  const labelStyle = {
    display: "block",
    fontSize: 11,
    fontWeight: 700,
    color: "#64748b",
    letterSpacing: "0.05em",
    textTransform: "uppercase",
    marginBottom: 8,
  };

  const inputStyle = {
    width: "100%",
    height: 42,
    padding: "0 12px",
    border: "1px solid #e2e8f0",
    borderRadius: 8,
    fontSize: 14,
    color: "#0f172a",
    background: "#f8fafc",
  };

  const textAreaStyle = {
    ...inputStyle,
    height: "auto",
    padding: 12,
    minHeight: 100,
    resize: "vertical",
    lineHeight: 1.5,
  };

  if (loading) return <DashShell>Loading...</DashShell>;

  return (
    <DashShell>
      <div className="dash-content" style={{ maxWidth: 880, margin: "0 auto", padding: "32px 24px" }}>
        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, margin: "0 0 6px 0", color: "#0f172a" }}>Edit Profile</h1>
          <p style={{ color: "#64748b", margin: 0 }}>Update your startup's details, branding, and key metrics.</p>
        </div>

        <form onSubmit={onSave}>
          {/* Company Overview */}
          <div style={sectionStyle}>
            <h3 style={{ fontSize: 16, fontWeight: 700, margin: "0 0 20px 0" }}>Company Overview</h3>

            <div style={{ display: "grid", gridTemplateColumns: "100px 1fr 1fr", gap: 24, alignItems: "start" }}>
              {/* Logo Area */}
              <div>
                <div style={labelStyle}>Logo</div>
                <div style={{ width: 100, height: 100, background: "#0f172a", borderRadius: 12, display: "grid", placeItems: "center", marginBottom: 8 }}>
                  {/* Placeholder Logo */}
                  <div style={{ display: "flex" }}>
                    <div style={{ width: 12, height: 12, background: "#f43f5e", borderRadius: "50%", opacity: 0.8 }} />
                    <div style={{ width: 12, height: 12, background: "#3b82f6", borderRadius: "50%", marginLeft: -6, mixBlendMode: "screen" }} />
                  </div>
                </div>
                <button type="button" style={{ background: "transparent", border: "none", color: "#1d4ed8", fontWeight: 600, fontSize: 13, cursor: "pointer", padding: 0 }}>
                  Change Logo
                </button>
              </div>

              {/* Form Fields Column 1 */}
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div>
                  <label style={labelStyle}>Company Name</label>
                  <input style={inputStyle} value={form.company_name} onChange={(e) => setForm({ ...form, company_name: e.target.value })} />
                </div>
                <div>
                  <label style={labelStyle}>Funding Stage</label>
                  <select style={inputStyle} value={form.funding_stage} onChange={(e) => setForm({ ...form, funding_stage: e.target.value })}>
                    <option>Pre-Seed</option>
                    <option>Seed</option>
                    <option>Series A</option>
                    <option>Series B</option>
                  </select>
                </div>
              </div>

              {/* Form Fields Column 2 */}
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div>
                  <label style={labelStyle}>Industry</label>
                  <input style={inputStyle} value={form.industry} onChange={(e) => setForm({ ...form, industry: e.target.value })} placeholder="e.g. SaaS, AI" />
                </div>
                <div>
                  <label style={labelStyle}>Contact Email</label>
                  <input style={inputStyle} value={form.contact_email} onChange={(e) => setForm({ ...form, contact_email: e.target.value })} />
                </div>
              </div>
            </div>
          </div>

          {/* The Pitch */}
          <div style={sectionStyle}>
            <h3 style={{ fontSize: 16, fontWeight: 700, margin: "0 0 20px 0" }}>The Pitch</h3>

            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>Vision</label>
              <textarea style={textAreaStyle} value={form.vision} onChange={(e) => setForm({ ...form, vision: e.target.value })} />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              <div>
                <label style={labelStyle}>Problem Solved</label>
                <textarea style={textAreaStyle} value={form.problem} onChange={(e) => setForm({ ...form, problem: e.target.value })} />
              </div>
              <div>
                <label style={labelStyle}>Solution Offered</label>
                <textarea style={textAreaStyle} value={form.solution} onChange={(e) => setForm({ ...form, solution: e.target.value })} />
              </div>
            </div>
          </div>

          {/* Traction & Metrics */}
          <div style={sectionStyle}>
            <h3 style={{ fontSize: 16, fontWeight: 700, margin: "0 0 20px 0" }}>Traction & Metrics</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 16 }}>
              <div>
                <label style={labelStyle}>Annual Recurring Revenue</label>
                <input style={inputStyle} value={form.arr} onChange={(e) => setForm({ ...form, arr: e.target.value })} placeholder="$ 0" />
              </div>
              <div>
                <label style={labelStyle}>Total Users</label>
                <input style={inputStyle} value={form.users} onChange={(e) => setForm({ ...form, users: e.target.value })} placeholder="0" />
              </div>
              <div>
                <label style={labelStyle}>CAC</label>
                <input style={inputStyle} value={form.cac} onChange={(e) => setForm({ ...form, cac: e.target.value })} placeholder="$ 0" />
              </div>
              <div>
                <label style={labelStyle}>Retention Rate</label>
                <div style={{ position: "relative" }}>
                  <input style={inputStyle} value={form.retention} onChange={(e) => setForm({ ...form, retention: e.target.value })} placeholder="0" />
                  <span style={{ position: "absolute", right: 12, top: 12, color: "#64748b", fontSize: 13 }}>%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
            <button
              type="button"
              onClick={() => navigate("/company-profile")}
              style={{ background: "#fff", border: "1px solid #e2e8f0", padding: "10px 20px", borderRadius: 8, fontWeight: 700, color: "#334155", cursor: "pointer" }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              style={{ background: "#1d4ed8", border: "none", padding: "10px 24px", borderRadius: 8, fontWeight: 700, color: "#fff", cursor: "pointer", opacity: saving ? 0.7 : 1 }}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>

        </form>
      </div>
    </DashShell>
  );
}
