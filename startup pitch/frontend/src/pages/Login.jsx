import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api.js";
import { setAuth } from "../auth.js";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setMsg("");
    setBusy(true);
    try {
      const data = await api.login({ email, password });
      const token = data.access_token || data.token || data.jwt || data?.data?.access_token;
      const name = data.name || data.user?.name || "Alex";
      if (!token) throw new Error("No token returned from server.");

      setAuth({ token, name });
      navigate("/dashboard");
    } catch (err) {
      setMsg(err.message || "Login failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="loginAuth">
      <div className="loginLeft">
        <div className="loginBrand">
          <div className="loginBrandMark">
            <span className="loginBrandMarkInner" />
            <span className="loginBrandMarkDot" />
          </div>
          <div className="loginBrandName">PitchDeck AI</div>
        </div>

        <div className="loginLeftCenter">
          <h1 className="loginTitle">Sign in</h1>
          <p className="loginSubtitle">Access your pitches, analytics, and investor matches.</p>

          {msg ? <div className="alert error">{msg}</div> : null}

          <form className="loginForm" onSubmit={onSubmit}>
            <div className="field">
              <span>Email</span>
              <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" />
            </div>

            <div className="field">
              <span>Password</span>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
            </div>

            <div className="loginMetaRow">
              <a className="loginForgot" href="#" onClick={(e) => e.preventDefault()}>
                Forgot password?
              </a>
            </div>

            <button className="primary loginPrimary" disabled={busy}>
              {busy ? "Signing in..." : "Sign in"}
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '16px 0' }}>
              <div style={{ height: '1px', background: '#e2e8f0', flex: 1 }}></div>
              <span style={{ fontSize: '13px', color: '#64748b' }}>OR</span>
              <div style={{ height: '1px', background: '#e2e8f0', flex: 1 }}></div>
            </div>

            <a
              href="http://localhost:8000/auth/linkedin/login"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                height: '46px',
                borderRadius: '10px',
                border: '1px solid #0077b5',
                background: '#fff',
                color: '#0077b5',
                fontSize: '14px',
                fontWeight: '600',
                textDecoration: 'none',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => { e.currentTarget.style.background = '#f0f9ff'; }}
              onMouseOut={(e) => { e.currentTarget.style.background = '#fff'; }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#0077b5">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
              Sign in with LinkedIn
            </a>

            <div className="loginBottomLink">
              Don’t have an account? <Link to="/signup">Create one</Link>
            </div>
          </form>
        </div>

        <div className="loginFooter">
          <a href="#" onClick={(e) => e.preventDefault()}>Privacy</a>
          <a href="#" onClick={(e) => e.preventDefault()}>Terms</a>
          <a href="#" onClick={(e) => e.preventDefault()}>Support</a>
        </div>
      </div>

      <div className="loginRight">
        <div className="loginRightOverlay" />
        <div className="loginHeroContent">
          <div className="loginHeroBadge">✳️</div>
          <h2 className="loginHeroTitle">Build investor-ready decks faster</h2>
          <p className="loginHeroText">
            Track views, find matches, and refine your pitch with clear analytics.
          </p>
          <div className="loginJoined">
            <div className="loginAvatars">
              <div className="avatar a1" />
              <div className="avatar a2" />
              <div className="avatar a3" />
              <div className="avatar a4">+3k</div>
            </div>
            <div className="loginJoinedText">Trusted by founders and teams worldwide</div>
          </div>
        </div>
      </div>
    </div>
  );
}