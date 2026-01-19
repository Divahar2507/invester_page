import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { clearAuth, getName } from "../auth.js";


export function Icon({ name }) {
  const common = { width: 18, height: 18, viewBox: "0 0 24 24", fill: "none" };
  const stroke = { stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" };

  switch (name) {
    case "grid":
      return (
        <svg {...common}>
          <path {...stroke} d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" />
        </svg>
      );
    case "doc":
      return (
        <svg {...common}>
          <path {...stroke} d="M14 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
          <path {...stroke} d="M14 2v6h6" />
        </svg>
      );
    case "spark":
      return (
        <svg {...common}>
          <path {...stroke} d="M12 2l2.2 6.6L21 11l-6.8 2.4L12 20l-2.2-6.6L3 11l6.8-2.4L12 2z" />
        </svg>
      );
    case "users":
      return (
        <svg {...common}>
          <path {...stroke} d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
          <path {...stroke} d="M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />
          <path {...stroke} d="M21 21v-2a4 4 0 0 0-3-3.87" />
          <path {...stroke} d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      );
    case "bell":
      return (
        <svg {...common}>
          <path {...stroke} d="M18 8a6 6 0 1 0-12 0c0 7-3 7-3 7h18s-3 0-3-7" />
          <path {...stroke} d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
      );
    case "search":
      return (
        <svg {...common}>
          <path {...stroke} d="M21 21l-4.3-4.3" />
          <path {...stroke} d="M11 18a7 7 0 1 1 0-14 7 7 0 0 1 0 14z" />
        </svg>
      );
    case "plus":
      return (
        <svg {...common}>
          <path {...stroke} d="M12 5v14M5 12h14" />
        </svg>
      );
    case "arrowLeft":
      return (
        <svg {...common}>
          <path {...stroke} d="M15 18l-6-6 6-6" />
        </svg>
      );
    default:
      return null;
  }
}

export default function DashLayout({ children }) {
  const navigate = useNavigate();
  const name = getName();

  function onLogout() {
    clearAuth();
    navigate("/login");
  }

  return (
    <div className="dash">
      <aside className="dash-side">
        <div className="dash-brand">
          <div className="dash-mark" />
          <div className="dash-brand-text">PitchDeck AI</div>
        </div>

        <nav className="dash-nav">
          <NavLink
            to="/dashboard"
            className={({ isActive }) => `dash-link${isActive ? " active" : ""}`}
          >
            <span className="dash-link-ic"><Icon name="grid" /></span>
            Dashboard
          </NavLink>

          <button className="dash-link" type="button" onClick={() => navigate("/dashboard")}>
            <span className="dash-link-ic"><Icon name="doc" /></span>
            My Pitches
          </button>

          <button className="dash-link" type="button" onClick={() => navigate("/dashboard")}>
            <span className="dash-link-ic"><Icon name="spark" /></span>
            Opportunities
            <span className="pillCount">3</span>
          </button>

          <button className="dash-link" type="button" onClick={() => navigate("/dashboard")}>
            <span className="dash-link-ic"><Icon name="users" /></span>
            Investors
          </button>
        </nav>

        <div className="dash-side-bottom">
          <button className="dash-link" type="button" onClick={() => navigate("/dashboard")}>
            <NavLink
              to="/settings"
              className={({ isActive }) => `dash-link${isActive ? " active" : ""}`}
            >
            <span className="dash-link-ic">⚙</span>
            Settings
            </NavLink>
          </button>

          <button className="dash-link logoutBtn" type="button" onClick={onLogout}>
            <span className="dash-link-ic">⎋</span>
            Logout
          </button>

          <div className="dash-user">
            <div className="avatarSmall" />
            <div>
              <div className="dash-user-name">{name} Morgan</div>
              <div className="dash-user-sub">Founder Workspace</div>
            </div>
          </div>
        </div>
      </aside>

      <section className="dash-main">
        <header className="dash-top">
          <div className="dash-search">
            <span className="dash-search-ic"><Icon name="search" /></span>
            <input placeholder="Search pitches, investors, or files..." />
          </div>

          <div className="dash-top-right">
            <button className="bellBtn" type="button" aria-label="Notifications">
              <Icon name="bell" />
              <span className="notifDot" />
            </button>

            <button className="btnPrimary" type="button" onClick={() => navigate("/dashboard")}>
              <Icon name="plus" />
              Create New Pitch
            </button>
          </div>
        </header>

        <div className="dash-content">{children}</div>
      </section>
    </div>
  );
}