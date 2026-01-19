import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashShell from "../components/DashShell.jsx";
import { api } from "../api.js";
import { getToken } from "../auth.js";
import AddTeamMemberModal from "../components/AddTeamMemberModal.jsx";

// --- Icons ---
const ShareIcon = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
  </svg>
);

const EditIcon = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const LinkIcon = () => (
  <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);

const RocketIcon = () => (
  <svg width="18" height="18" fill="none" stroke="#7c3aed" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.48-.56.93-1.23 1.35-2h-4.35z" />
    <path d="M12 15l-3-3" />
    <path d="M15 12l-3-3" />
    <path d="M6.5 9.5c.34-.38.74-.75 1.15-1.12 3.12-2.83 8.35-4.38 12.35 1.62 4 6 2.45 11.23-.38 14.35-.37.41-.74.81-1.12 1.15" />
  </svg>
);

const LinkedInIcon = () => (
  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const CopyIcon = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);

const MailIcon = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

const LinkChainIcon = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </svg>
);

// --- Share Modal Component ---
function ShareModal({ onClose }) {
  const navigate = useNavigate();
  const [publicAccess, setPublicAccess] = useState(true);
  const [copied, setCopied] = useState(false);
  const [sending, setSending] = useState(false);
  
  const [form, setForm] = useState({
    recipients: "",
    subject: "Check out TechNova's profile",
    message: ""
  });

  const publicLink = "https://technova.io/p/share/8f92a...";

  function handleCopy() {
    navigator.clipboard.writeText(publicLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleSend() {
    const token = getToken();
    if (!token) {
      alert("You must be signed in to share the profile. Please sign in and try again.");
      return;
    }

    setSending(true);
    try {
      await api.shareProfile(form);
      onClose(); // Close on success
      alert("Invites sent successfully!");
    } catch (e) {
      // If server indicates auth problem, redirect to login after informing the user
      const msg = e.message || "Failed to send invites.";
      alert("Failed to send invites: " + msg);
      if (msg.toLowerCase().includes("unauthorized") || msg.toLowerCase().includes("expired")) {
        // Redirect to login so user can re-authenticate
        navigate('/login');
      }
    } finally {
      setSending(false);
    }
  }

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 999,
      background: "rgba(15, 23, 42, 0.6)", backdropFilter: "blur(4px)",
      display: "grid", placeItems: "center", padding: 20
    }}>
      <div style={{
        background: "#fff", borderRadius: 16, width: 600, maxWidth: "100%",
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
      }}>
        {/* Modal Header */}
        <div style={{ padding: "20px 24px", borderBottom: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#0f172a" }}>Share Company Profile</h3>
          <button onClick={onClose} style={{ border: 0, background: "transparent", fontSize: 24, color: "#94a3b8", cursor: "pointer", padding: 0, lineHeight: 1 }}>×</button>
        </div>

        <div style={{ padding: "24px" }}>
          
          {/* Public Link Section */}
          <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 16 }}>
             <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#eff6ff", color: "#1d4ed8", display: "grid", placeItems: "center", flexShrink: 0 }}>
               <LinkChainIcon />
             </div>
             <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: "#0f172a" }}>Public Link</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 12, color: "#64748b" }}>Public Access</span>
                    {/* Toggle Switch */}
                    <button 
                      onClick={() => setPublicAccess(!publicAccess)}
                      style={{ 
                        width: 36, height: 20, borderRadius: 999, padding: 2, border: "none", cursor: "pointer",
                        background: publicAccess ? "#1d4ed8" : "#e2e8f0", position: "relative", transition: "0.2s"
                      }}
                    >
                      <div style={{ 
                        width: 16, height: 16, borderRadius: "50%", background: "#fff", 
                        transform: publicAccess ? "translateX(16px)" : "translateX(0)", transition: "0.2s" 
                      }} />
                    </button>
                  </div>
                </div>
                <div style={{ fontSize: 13, color: "#64748b" }}>Share your profile with a direct link</div>
             </div>
          </div>

          <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
            <input 
              readOnly 
              value={publicLink} 
              style={{ flex: 1, padding: "10px 12px", borderRadius: 8, border: "1px solid #e2e8f0", background: "#f8fafc", color: "#475569", outline: "none" }}
            />
            <button 
              onClick={handleCopy}
              style={{ 
                padding: "0 16px", borderRadius: 8, border: "1px solid #e2e8f0", background: "#fff", 
                fontWeight: 600, color: "#334155", cursor: "pointer", display: "flex", alignItems: "center", gap: 6 
              }}
            >
              <CopyIcon /> {copied ? "Copied" : "Copy Link"}
            </button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
            <div>
              <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#64748b", marginBottom: 6 }}>LINK EXPIRATION</label>
              <select style={{ width: "100%", padding: "8px 10px", borderRadius: 6, border: "1px solid #e2e8f0", fontSize: 13, color: "#0f172a", outline: "none" }}>
                <option>Never</option>
                <option>1 Week</option>
                <option>1 Month</option>
              </select>
            </div>
            <div>
              <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#64748b", marginBottom: 6 }}>ACCESS CONTROL</label>
              <select style={{ width: "100%", padding: "8px 10px", borderRadius: 6, border: "1px solid #e2e8f0", fontSize: 13, color: "#0f172a", outline: "none" }}>
                <option>Anyone with link</option>
                <option>Password protected</option>
              </select>
            </div>
          </div>

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
            <div style={{ height: 1, flex: 1, background: "#e2e8f0" }} />
            <span style={{ fontSize: 12, color: "#94a3b8" }}>OR</span>
            <div style={{ height: 1, flex: 1, background: "#e2e8f0" }} />
          </div>

          {/* Email Invite Section */}
          <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 16 }}>
             <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#f3edff", color: "#7c3aed", display: "grid", placeItems: "center", flexShrink: 0 }}>
               <MailIcon />
             </div>
             <div>
                <div style={{ fontWeight: 700, fontSize: 14, color: "#0f172a" }}>Invite via Email</div>
                <div style={{ fontSize: 13, color: "#64748b" }}>Send an invitation directly to investors</div>
             </div>
          </div>

          <div style={{ marginBottom: 12 }}>
            <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#64748b", marginBottom: 6 }}>RECIPIENTS</label>
            <input 
              placeholder="investor@example.com, partner@fund.vc"
              value={form.recipients}
              onChange={e => setForm({...form, recipients: e.target.value})}
              style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #e2e8f0", outline: "none" }}
            />
          </div>

          <div style={{ marginBottom: 12 }}>
            <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#64748b", marginBottom: 6 }}>SUBJECT</label>
            <input 
              value={form.subject}
              onChange={e => setForm({...form, subject: e.target.value})}
              style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #e2e8f0", outline: "none" }}
            />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#64748b", marginBottom: 6 }}>MESSAGE <span style={{ fontWeight: 400, color: "#94a3b8" }}>(Optional)</span></label>
            <textarea 
              rows={3}
              placeholder="Add a personal note..."
              value={form.message}
              onChange={e => setForm({...form, message: e.target.value})}
              style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #e2e8f0", outline: "none", resize: "vertical", fontFamily: "inherit" }}
            />
          </div>

          {/* Footer Actions */}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
            <button 
              onClick={onClose}
              style={{ padding: "10px 16px", borderRadius: 8, background: "transparent", border: "none", fontWeight: 600, color: "#64748b", cursor: "pointer" }}
            >
              Cancel
            </button>
            <button 
              onClick={handleSend}
              disabled={sending}
              style={{ 
                padding: "10px 20px", borderRadius: 8, background: "#1d4ed8", border: "none", 
                fontWeight: 700, color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", gap: 8,
                opacity: sending ? 0.7 : 1
              }}
            >
              {sending ? "Sending..." : <>
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
                Send Invite
              </>}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

// --- Main Page Component ---
export default function CompanyProfile() {
  const navigate = useNavigate();
  const [showShare, setShowShare] = useState(false);
  const [profile, setProfile] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  React.useEffect(() => {
    api.getProfile().then(setProfile).catch(() => setProfile(null));
  }, []);

  const companyName = profile?.company_name || "TechNova";
  const vision = profile?.vision || "Empowering the next generation of creators through AI-driven design tools. We envision a world where anyone can bring their ideas to life instantly, removing the technical barriers to creativity.";
  const problem = profile?.problem || "Professional design software is too complex, expensive, and time-consuming for non-designers, creating a bottleneck in content creation.";
  const solution = profile?.solution || "An intuitive, prompt-to-design platform that leverages generative AI to produce professional-grade assets in seconds, not hours.";

  return (
    <DashShell>
      {/* Show Modal if state is true */}
      {showShare && <ShareModal onClose={() => setShowShare(false)} />}

      <div className="dash-content" style={{ maxWidth: 1100, margin: "0 auto", padding: "32px" }}>
        
          {/* Page Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
            <div>
              <h1 style={{ fontSize: 28, fontWeight: 800, margin: "0 0 8px 0", color: "#0f172a" }}>{companyName} Profile</h1>
              <p style={{ color: "#64748b", margin: 0 }}>Showcase your startup’s vision, traction, and team to investors.</p>
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              <button 
                onClick={() => setShowShare(true)}
                style={{ 
                  background: "#fff", border: "1px solid #e2e8f0", padding: "10px 16px", borderRadius: 8, 
                  fontWeight: 700, color: "#0f172a", display: "flex", alignItems: "center", gap: 8, cursor: "pointer"
                }}
              >
                <ShareIcon /> Share Profile
              </button>
              <button 
                onClick={() => navigate('/edit-profile')}
                style={{ 
                  background: "#1d4ed8", border: "none", padding: "10px 16px", borderRadius: 8, 
                  fontWeight: 700, color: "#fff", display: "flex", alignItems: "center", gap: 8, cursor: "pointer"
                }}
              >
                <EditIcon /> Edit Profile
              </button>
            </div>
          </div>

          {/* ... Rest of the Profile UI (Same as previous turn) ... */}
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 24, alignItems: "start" }}>
            
            <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e2e8f0", padding: 32 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
                <div style={{ display: "flex", gap: 16 }}>
                  <div style={{ width: 64, height: 64, background: "#0f172a", borderRadius: 12, display: "grid", placeItems: "center" }}>
                     <div style={{ display: "flex" }}>
                       <div style={{ width: 12, height: 12, background: "#f43f5e", borderRadius: "50%", opacity: 0.8 }} />
                       <div style={{ width: 12, height: 12, background: "#3b82f6", borderRadius: "50%", marginLeft: -6, mixBlendMode: "screen" }} />
                     </div>
                  </div>
                  <div>
                    <h2 style={{ margin: "0 0 4px 0", fontSize: 22, fontWeight: 800 }}>TechNova</h2>
                    <div style={{ color: "#64748b", fontSize: 14 }}>San Francisco, CA • Founded 2021</div>
                  </div>
                </div>
                <div style={{ background: "#eff6ff", color: "#1d4ed8", fontWeight: 700, fontSize: 12, padding: "4px 10px", borderRadius: 6, border: "1px solid #dbeafe" }}>
                  {profile?.funding_stage || "Series A"}
                </div>
              </div>

              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: "#94a3b8", letterSpacing: "0.05em", marginBottom: 8 }}>VISION</div>
                <p style={{ lineHeight: 1.6, color: "#334155", margin: 0 }}>{vision}</p>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 800, color: "#94a3b8", letterSpacing: "0.05em", marginBottom: 8 }}>PROBLEM</div>
                  <p style={{ lineHeight: 1.6, color: "#334155", margin: 0, fontSize: 14 }}>{problem}</p>
                </div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 800, color: "#94a3b8", letterSpacing: "0.05em", marginBottom: 8 }}>SOLUTION</div>
                  <p style={{ lineHeight: 1.6, color: "#334155", margin: 0, fontSize: 14 }}>{solution}</p>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e2e8f0", padding: 24 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, margin: "0 0 16px 0" }}>Company Details</h3>
                
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 12, color: "#64748b", marginBottom: 6 }}>Industry</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {["SaaS", "Artificial Intelligence", "Design Tools"].map(tag => (
                      <span key={tag} style={{ background: "#f1f5f9", padding: "4px 8px", borderRadius: 6, fontSize: 12, color: "#475569", fontWeight: 500 }}>{tag}</span>
                    ))}
                  </div>
                </div>

                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 12, color: "#64748b", marginBottom: 2 }}>Website</div>
                  <a href="#" style={{ fontSize: 14, fontWeight: 600, color: "#1d4ed8", display: "flex", alignItems: "center", gap: 4, textDecoration: "none" }}>
                    technova.io <LinkIcon />
                  </a>
                </div>

                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 12, color: "#64748b", marginBottom: 2 }}>Total Funding</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#0f172a" }}>$3.5M USD</div>
                </div>

                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 12, color: "#64748b", marginBottom: 2 }}>Employee Count</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#0f172a" }}>12 - 20</div>
                </div>

                <div>
                  <div style={{ fontSize: 12, color: "#64748b", marginBottom: 2 }}>Contact</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#0f172a" }}>founders@technova.io</div>
                </div>
              </div>

              <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e2e8f0", padding: 24 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                  <div style={{ width: 32, height: 32, background: "#f3edff", borderRadius: "50%", display: "grid", placeItems: "center" }}>
                    <RocketIcon />
                  </div>
                  <div style={{ fontWeight: 700, color: "#0f172a" }}>Fundraising Status</div>
                </div>
                
                <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.5, marginBottom: 16 }}>
                  Currently raising Series A round to scale operations and marketing.
                </p>

                <div style={{ height: 8, background: "#e2e8f0", borderRadius: 999, overflow: "hidden", marginBottom: 8 }}>
                  <div style={{ width: "42%", height: "100%", background: "#1d4ed8", borderRadius: 999 }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontWeight: 700 }}>
                  <span style={{ color: "#0f172a" }}>$3M Committed</span>
                  <span style={{ color: "#64748b" }}>Target: $7M</span>
                </div>
              </div>
            </div>
          </div>

          <div style={{ marginTop: 32 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, margin: "0 0 16px 0", color: "#0f172a" }}>Traction & Metrics</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
              {[
                { label: "Annual Recurring Revenue", val: profile?.arr || "$0", delta: "+0% MoM", good: null },
                { label: "Total Users", val: profile?.users || "0", delta: "+0% MoM", good: null },
                { label: "CAC", val: profile?.cac || "$0", delta: "-", good: null },
                { label: "Retention Rate", val: (profile?.retention || "0") + "%", delta: "Stable", good: null },
              ].map((m, i) => (
                <div key={i} style={{ background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0", padding: 20 }}>
                  <div style={{ fontSize: 12, color: "#64748b", marginBottom: 8 }}>{m.label}</div>
                  <div style={{ fontSize: 26, fontWeight: 800, color: "#0f172a", marginBottom: 8 }}>{m.val}</div>
                  <div style={{ 
                    fontSize: 13, fontWeight: 700, 
                    color: m.good === true ? "#16a34a" : m.good === false ? "#dc2626" : "#475569" 
                  }}>
                    {m.good === true && "↗ "} {m.delta}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginTop: 32 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, margin: 0, color: "#0f172a" }}>Our Team</h3>
              <button style={{ 
                background: "#fff", border: "1px solid #e2e8f0", padding: "8px 12px", borderRadius: 8, 
                fontSize: 13, fontWeight: 600, color: "#334155", cursor: "pointer" 
              }}>
                + Add Team Member
              </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
              {[
                { name: "Alex Morgan", role: "Co-Founder & CEO", avColor: "#fde68a", bio: "Former Product Lead at Google. Serial entrepreneur with 10+ years in SaaS." },
                { name: "Sarah Jenkins", role: "CTO", avColor: "#e9d5ff", bio: "PhD in Computer Vision from Stanford. Expert in generative adversarial networks." },
                { name: "David Chen", role: "Head of Growth", avColor: "#bfdbfe", bio: "Growth hacker with a track record of scaling startups from 0 to 1M users." },
              ].map((p, i) => (
                <div key={i} style={{ background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0", padding: 24, textAlign: "center" }}>
                  <div style={{ width: 64, height: 64, borderRadius: "50%", background: p.avColor, margin: "0 auto 16px auto", border: "3px solid #fff", boxShadow: "0 4px 10px rgba(0,0,0,0.05)" }} />
                  <div style={{ fontWeight: 700, color: "#0f172a", fontSize: 16 }}>{p.name}</div>
                  <div style={{ color: "#1d4ed8", fontSize: 12, fontWeight: 600, margin: "4px 0 12px 0" }}>{p.role}</div>
                  <p style={{ fontSize: 12, color: "#64748b", lineHeight: 1.5, margin: "0 0 16px 0" }}>{p.bio}</p>
                  <div style={{ display: "flex", justifyContent: "center", gap: 12, color: "#64748b" }}>
                    <LinkedInIcon />
                  </div>
                </div>
              ))}
               <div style={{ 
                background: "#fff", borderRadius: 12, border: "2px dashed #e2e8f0", 
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                cursor: "pointer", color: "#64748b", minHeight: 240
              }}>
                <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#f1f5f9", display: "grid", placeItems: "center", marginBottom: 12, color: "#1d4ed8" }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                </div>
                <div onClick={() => setIsModalOpen(true)} style={{ fontWeight: 700, color: "#0f172a" }}>Add Member</div>
                <div style={{ fontSize: 12 }}>Join the team</div>
              </div>

              {/* Add Team Member Modal */}
              <AddTeamMemberModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
            </div>
          </div>

        </div>
      </DashShell>
    );
}
