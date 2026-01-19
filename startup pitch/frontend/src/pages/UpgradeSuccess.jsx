import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DashShell from "../components/DashShell.jsx";

export default function UpgradeSuccess() {
  const navigate = useNavigate();
  const location = useLocation();

  const state = location.state || {
    planName: "Pro Growth",
    billing: "monthly",
    amount: 49,
    nextDate: "Nov 24, 2023",
  };

  return (
    <DashShell>
      <div className="dash-content">
        <div className="successWrap">
          <div className="successIcon">✓</div>

          <h1 className="successTitle">Upgrade Confirmed!</h1>
          <p className="successSub">
            Welcome to <b>{state.planName}</b>. Your payment was successful and your new features are ready to use.
          </p>

          <div className="successCard">
            <div className="successRow">
              <div>
                <div className="successLabel">CURRENT PLAN</div>
                <div className="successValue">
                  {state.planName} <span className="muted">({state.billing})</span>
                </div>
              </div>

              <div className="successDivider" />

              <div>
                <div className="successLabel">NEXT BILLING DATE</div>
                <div className="successValue">{state.nextDate}</div>
              </div>
            </div>

            <div className="successLine" />

            <div className="unlockTitle">You’ve unlocked:</div>
            <div className="unlockGrid">
              <div className="unlockItem">
                <span className="unlockCheck">✓</span>
                <div>
                  <div className="unlockName">Unlimited Active Pitches</div>
                  <div className="unlockDesc">Create as many decks as you need.</div>
                </div>
              </div>

              <div className="unlockItem">
                <span className="unlockCheck">✓</span>
                <div>
                  <div className="unlockName">Advanced Analytics</div>
                  <div className="unlockDesc">See who views your slides.</div>
                </div>
              </div>

              <div className="unlockItem">
                <span className="unlockCheck">✓</span>
                <div>
                  <div className="unlockName">AI Investor Matching</div>
                  <div className="unlockDesc">50 matches per month.</div>
                </div>
              </div>

              <div className="unlockItem">
                <span className="unlockCheck">✓</span>
                <div>
                  <div className="unlockName">Custom Branding</div>
                  <div className="unlockDesc">Remove watermark & use own domain.</div>
                </div>
              </div>
            </div>
          </div>

          <div className="successActions">
            <button className="goDashBtn" type="button" onClick={() => navigate("/dashboard")}>
              Go to Dashboard
            </button>
            <button className="manageBtn" type="button" onClick={() => navigate("/upgrade")}>
              Manage Subscription
            </button>
          </div>
        </div>
      </div>
    </DashShell>
  );
}