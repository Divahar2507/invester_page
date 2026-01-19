import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashShell from "../components/DashShell.jsx";

function money(n) {
  return `$${Number(n).toFixed(0)}`;
}

export default function UpgradePlans() {
  const navigate = useNavigate();
  const [billing, setBilling] = useState("annually"); // monthly | annually

  const prices = useMemo(() => {
    const pro = billing === "monthly" ? 49 : 470; // like your image
    return {
      basic: 0,
      pro,
      enterprise: billing === "monthly" ? 299 : 299 * 10, // placeholder yearly
    };
  }, [billing]);

  function goCheckout(planId) {
    if (planId !== "pro") return;

    navigate("/upgrade/checkout", {
      state: {
        planId: "pro",
        planName: "Pro Growth",
        billing,
        amount: prices.pro,
      },
    });
  }

  return (
    <DashShell>
      <div className="dash-content">
        <div className="upgradeHeader">
          <div className="upgradeKicker">UPGRADE NOW</div>
          <h1 className="upgradeTitle">Choose the plan that fits your growth</h1>
          <p className="upgradeSub">
            Unlock premium features to supercharge your fundraising journey. Detailed analytics, unlimited investor matching, and more.
          </p>

          <div className="billingRow">
            <div className="billingToggle">
              <button
                type="button"
                className={`billingBtn ${billing === "monthly" ? "active" : ""}`}
                onClick={() => setBilling("monthly")}
              >
                Monthly
              </button>
              <button
                type="button"
                className={`billingBtn ${billing === "annually" ? "active" : ""}`}
                onClick={() => setBilling("annually")}
              >
                Annually
              </button>
            </div>
            <div className="billingHint">Save 20% with annual billing</div>
          </div>
        </div>

        <div className="planGrid">
          {/* Basic */}
          <div className="planCard">
            <div className="planTop">
              <div>
                <div className="planName">Basic</div>
                <div className="planDesc">Essential tools for early-stage founders to get started.</div>
              </div>
              <div className="planPill">Current Plan</div>
            </div>

            <div className="planPrice">
              {money(prices.basic)} <span>/mo</span>
            </div>

            <button className="planBtn disabled" type="button" disabled>
              Current Plan
            </button>

            <div className="planSectionTitle">FEATURES INCLUDED:</div>
            <ul className="planList">
              <li>✓ 3 Active Pitches</li>
              <li>✓ Basic Analytics</li>
              <li>✓ Export to PDF</li>
              <li className="muted">✕ Investor Matching</li>
            </ul>
          </div>

          {/* Pro */}
          <div className="planCard popular">
            <div className="popularBadge">MOST POPULAR</div>

            <div className="planTop">
              <div>
                <div className="planName">Pro Growth</div>
                <div className="planDesc">Advanced tools for serious fundraising and networking.</div>
              </div>
            </div>

            <div className="planPrice">
              {money(prices.pro)} <span>/{billing === "monthly" ? "mo" : "yr"}</span>
            </div>

            <button className="planBtn primary" type="button" onClick={() => goCheckout("pro")}>
              Upgrade to Pro
            </button>

            <div className="planSectionTitle">EVERYTHING IN BASIC, PLUS:</div>
            <ul className="planList">
              <li>✓ Unlimited Active Pitches</li>
              <li>✓ Advanced Visitor Analytics</li>
              <li>✓ AI Investor Matching (50/mo)</li>
              <li>✓ Custom Branding & Domain</li>
              <li>✓ Priority Email Support</li>
            </ul>
          </div>

          {/* Enterprise */}
          <div className="planCard">
            <div className="planTop">
              <div>
                <div className="planName">Enterprise</div>
                <div className="planDesc">For scaling startups with larger teams and custom needs.</div>
              </div>
            </div>

            <div className="planPrice">
              {money(prices.enterprise)} <span>/mo</span>
            </div>

            <button className="planBtn outline" type="button" onClick={() => navigate("/enterprise/review")} >
              Contact Sales
            </button>

            <div className="planSectionTitle">EVERYTHING IN PRO, PLUS:</div>
            <ul className="planList">
              <li>✓ Unlimited Team Members</li>
              <li>✓ API Access</li>
              <li>✓ Dedicated Success Manager</li>
              <li>✓ SSO & Advanced Security</li>
            </ul>
          </div>
        </div>
      </div>
    </DashShell>
  );
}