import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashShell from "../components/DashShell.jsx";

// Simple Check Icon
const Check = ({ dim }) => (
  <div className={`pcCheck ${dim ? "dim" : ""}`}>✓</div>
);

export default function UpgradePlans() {
  const navigate = useNavigate();
  const [billing, setBilling] = useState("monthly"); // monthly | annually

  const prices = useMemo(() => {
    return {
      basic: 0,
      pro: billing === "monthly" ? 49 : 470,
    };
  }, [billing]);

  function goCheckout(planId) {
    if (planId === "pro") {
      navigate("/upgrade/checkout", {
        state: {
          planId: "pro",
          planName: "Pro Growth",
          billing,
          amount: prices.pro,
        },
      });
    } else if (planId === "enterprise") {
      navigate("/enterprise/review");
    }
  }

  return (
    <DashShell>
      <div className="pricingCheckWrap">

        {/* Header */}
        <div className="pricingHeader">
          <div className="pricingBadge">Upgrade to Pro</div>
          <h1 className="pricingTitle">Choose the plan that fits your growth</h1>
          <p className="pricingSub">
            Unlock premium features to supercharge your fundraising journey.
            Detailed analytics, unlimited investor matching, and more.
          </p>

          <div className="billingControl">
            <div className="billingPill" data-active={billing}>
              <div className="billingGlider" />
              <div
                className={`billingOption ${billing === "monthly" ? "active" : ""}`}
                onClick={() => setBilling("monthly")}
              >
                Monthly
              </div>
              <div
                className={`billingOption ${billing === "annually" ? "active" : ""}`}
                onClick={() => setBilling("annually")}
              >
                Annually
              </div>
            </div>
            {billing === "annually" && <div className="saveBadge">SAVE 20%</div>}
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="pricingGrid">

          {/* 1. Basic */}
          <div className="priceCard">
            <div className="pcHeader">
              <div className="pcTitle">Basic</div>
              <div className="pcDesc">Essential tools for early-stage founders to get started.</div>
            </div>
            <div className="pcPrice">
              <div className="pcAmount">$0</div>
              <div className="pcPeriod">/mo</div>
            </div>
            <button className="pcBtn outline" disabled style={{ opacity: 0.6, cursor: "default" }}>
              Current Plan
            </button>
            <div className="pcFeatures">
              <div className="pcFeature"><Check /> 3 Active Pitches</div>
              <div className="pcFeature"><Check /> Basic Analytics</div>
              <div className="pcFeature"><Check /> Export to PDF</div>
              <div className="pcFeature"><Check dim /> No Investor Matching</div>
            </div>
          </div>

          {/* 2. Pro (Featured) */}
          <div className="priceCard featured">
            <div className="popularTag">MOST POPULAR</div>
            <div className="pcHeader">
              <div className="pcTitle">Pro Growth</div>
              <div className="pcDesc">Advanced tools for serious fundraising and networking.</div>
            </div>
            <div className="pcPrice">
              <div className="pcAmount">${prices.pro}</div>
              <div className="pcPeriod">{billing === "monthly" ? "/mo" : "/yr"}</div>
            </div>
            <button className="pcBtn primary" onClick={() => goCheckout("pro")}>
              Upgrade to Pro
            </button>
            <div className="pcFeatures">
              <div className="pcFeature"><Check /> <strong>Unlimited</strong> Active Pitches</div>
              <div className="pcFeature"><Check /> Advanced Visitor Analytics</div>
              <div className="pcFeature"><Check /> AI Investor Matching (50/mo)</div>
              <div className="pcFeature"><Check /> Custom Branding & Domain</div>
              <div className="pcFeature"><Check /> Priority Email Support</div>
            </div>
          </div>

          {/* 3. Enterprise */}
          <div className="priceCard">
            <div className="pcHeader">
              <div className="pcTitle">Enterprise</div>
              <div className="pcDesc">For scaling startups with larger teams and custom needs.</div>
            </div>
            <div className="pcPrice">
              <div className="pcAmount">$299</div>
              <div className="pcPeriod">/mo</div>
            </div>
            <button className="pcBtn outline" onClick={() => goCheckout("enterprise")}>
              Contact Sales
            </button>
            <div className="pcFeatures">
              <div className="pcFeature"><Check /> Unlimited Team Members</div>
              <div className="pcFeature"><Check /> API Access</div>
              <div className="pcFeature"><Check /> Dedicated Success Manager</div>
              <div className="pcFeature"><Check /> SSO & Advanced Security</div>
            </div>
          </div>

        </div>
      </div>
    </DashShell>
  );
}