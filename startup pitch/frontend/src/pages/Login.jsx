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