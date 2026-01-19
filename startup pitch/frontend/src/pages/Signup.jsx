import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api.js";

export default function Signup() {
  const navigate = useNavigate();
  
  // Form State
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);

  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setMsg("");

    // Basic client-side validation
    if (password !== confirmPassword) {
      setMsg("Passwords do not match");
      return;
    }
    if (!agreeTerms) {
      setMsg("You must agree to the terms");
      return;
    }

    setBusy(true);
    try {
      // Construct payload matching backend schema
      await api.register({ 
        full_name: `${firstName} ${lastName}`.trim(), 
        company_name: companyName,
        email, 
        mobile_number: mobile,
        password,
        confirm_password: confirmPassword,
        agree_terms: agreeTerms 
      });
      navigate("/login");
    } catch (err) {
      setMsg(err.message || "Signup failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="auth">
      <div className="auth-left">
        <div className="bg-overlay" />
        <div className="brand">
          <span className="brand-mark" />
          PitchDeck AI
        </div>

        <div className="hero">
          <h1>Launch-ready pitches, fast.</h1>
          <p>
            Build decks, track engagement, and match with investors—all in one workspace.
          </p>

          <div className="trusted">
            <div className="avatars">
              <div className="avatar a1" />
              <div className="avatar a2" />
              <div className="avatar a3" />
              <div className="avatar a4">+3k</div>
            </div>
            <div className="trusted-text">Trusted by founders worldwide</div>
          </div>
        </div>

        <div className="auth-left-footer">
          <a href="#" onClick={(e) => e.preventDefault()}>Privacy</a>
          <a href="#" onClick={(e) => e.preventDefault()}>Terms</a>
          <a href="#" onClick={(e) => e.preventDefault()}>Support</a>
        </div>
      </div>

      <div className="auth-right">
        <div className="form-wrap">
          <h2>Create account</h2>
          <p className="sub">Start building your investor-ready pitch today.</p>

          {msg ? <div className="alert error">{msg}</div> : null}

          <form className="form" onSubmit={onSubmit}>
            {/* Name Fields */}
            <div className="grid2">
              <div className="field">
                <span>First name</span>
                <input required value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Alex" />
              </div>
              <div className="field">
                <span>Last name</span>
                <input required value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Morgan" />
              </div>
            </div>

            {/* Company & Mobile */}
            <div className="grid2">
              <div className="field">
                <span>Company Name</span>
                <input required value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="Acme Inc" />
              </div>
              <div className="field">
                <span>Mobile Number</span>
                <input required value={mobile} onChange={(e) => setMobile(e.target.value)} placeholder="+1 555 000 0000" />
              </div>
            </div>

            <div className="field">
              <span>Email</span>
              <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" />
            </div>

            {/* Password Fields */}
            <div className="grid2">
              <div className="field">
                <span>Password</span>
                <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
              </div>
              <div className="field">
                <span>Confirm Password</span>
                <input required type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••" />
              </div>
            </div>
            <div className="hint">Use 8+ characters.</div>

            {/* Terms Checkbox */}
            <label className="check" style={{ marginTop: 8, cursor: "pointer" }}>
              <input type="checkbox" checked={agreeTerms} onChange={(e) => setAgreeTerms(e.target.checked)} />
              <span>I agree to the Terms of Service and Privacy Policy.</span>
            </label>

            <button className="primary" disabled={busy} style={{ marginTop: 10 }}>
              {busy ? "Creating..." : "Create account"}
            </button>

            <div className="bottom">
              Already have an account? <Link to="/login">Sign in</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}