import React, { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DashShell from "../components/DashShell.jsx";
import { getName } from "../auth.js";

function money(n) {
  return `$${Number(n).toFixed(2)}`;
}

function nextBillingDate(billing) {
  const d = new Date();
  if (billing === "monthly") d.setMonth(d.getMonth() + 1);
  else d.setFullYear(d.getFullYear() + 1);
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "2-digit" });
}

export default function UpgradeCheckout() {
  const navigate = useNavigate();
  const location = useLocation();
  const name = getName();

  const initial = location.state || {
    planId: "pro",
    planName: "Pro Growth",
    billing: "monthly",
    amount: 49,
  };

  const [billing, setBilling] = useState(initial.billing);
  const [payment, setPayment] = useState("card"); // card | paypal

  const amount = useMemo(() => {
    if (billing === "monthly") return 49;
    return 470;
  }, [billing]);

  const [form, setForm] = useState({
    cardName: `${name} Morgan`,
    cardNumber: "",
    exp: "",
    cvc: "",
    save: false,
  });

  function onConfirm() {
    // Demo purchase success
    navigate("/upgrade/success", {
      state: {
        planName: initial.planName,
        billing,
        amount,
        nextDate: nextBillingDate(billing),
      },
    });
  }

  return (
    <DashShell>
      <div className="dash-content">
        <button className="backLink" type="button" onClick={() => navigate("/upgrade")}>
          ← Back to Plans
        </button>

        <div className="checkoutHead">
          <h1 className="checkoutTitle">Checkout</h1>
          <p className="checkoutSub">Complete your upgrade to unlock premium features.</p>
        </div>

        <div className="checkoutGrid">
          <div className="checkoutLeft">
            <div className="checkoutCard">
              <div className="cardTitle">Billing Cycle</div>

              <div className="billChoices">
                <button
                  type="button"
                  className={`billChoice ${billing === "monthly" ? "active" : ""}`}
                  onClick={() => setBilling("monthly")}
                >
                  <div>
                    <div className="billLabel">Monthly</div>
                    <div className="billHint">Billed monthly</div>
                  </div>
                  <div className="billPrice">${49}</div>
                </button>

                <button
                  type="button"
                  className={`billChoice ${billing === "annually" ? "active" : ""}`}
                  onClick={() => setBilling("annually")}
                >
                  <div>
                    <div className="billLabel">Annually</div>
                    <div className="billHint green">Save 20%</div>
                  </div>
                  <div className="billPrice">${470}</div>
                </button>
              </div>
            </div>

            <div className="checkoutCard">
              <div className="cardTitle">Payment Method</div>

              <div className="payTabs">
                <button
                  type="button"
                  className={`payTab ${payment === "card" ? "active" : ""}`}
                  onClick={() => setPayment("card")}
                >
                  Credit Card
                </button>
                <button
                  type="button"
                  className={`payTab ${payment === "paypal" ? "active" : ""}`}
                  onClick={() => setPayment("paypal")}
                >
                  PayPal
                </button>
              </div>

              {payment === "card" ? (
                <div className="payForm">
                  <label className="payField">
                    <span>Cardholder Name</span>
                    <input
                      value={form.cardName}
                      onChange={(e) => setForm((s) => ({ ...s, cardName: e.target.value }))}
                      placeholder="Alex Morgan"
                    />
                  </label>

                  <label className="payField">
                    <span>Card Number</span>
                    <input
                      value={form.cardNumber}
                      onChange={(e) => setForm((s) => ({ ...s, cardNumber: e.target.value }))}
                      placeholder="0000 0000 0000 0000"
                    />
                  </label>

                  <div className="payRow2">
                    <label className="payField">
                      <span>Expiry Date</span>
                      <input
                        value={form.exp}
                        onChange={(e) => setForm((s) => ({ ...s, exp: e.target.value }))}
                        placeholder="MM / YY"
                      />
                    </label>

                    <label className="payField">
                      <span>CVC / CVC2</span>
                      <input
                        value={form.cvc}
                        onChange={(e) => setForm((s) => ({ ...s, cvc: e.target.value }))}
                        placeholder="123"
                      />
                    </label>
                  </div>

                  <label className="saveRow">
                    <input
                      type="checkbox"
                      checked={form.save}
                      onChange={(e) => setForm((s) => ({ ...s, save: e.target.checked }))}
                    />
                    <span>Save this card for future billing</span>
                  </label>
                </div>
              ) : (
                <div className="paypalBox">
                  PayPal checkout (demo). Click “Confirm Upgrade” to continue.
                </div>
              )}
            </div>

            <div className="checkoutActions">
              <button className="confirmBtn" type="button" onClick={onConfirm}>
                Confirm Upgrade →
              </button>
              <button className="cancelBtn" type="button" onClick={() => navigate("/upgrade")}>
                Cancel
              </button>
              <div className="secureNote">🔒 Encrypted & Secure</div>
            </div>
          </div>

          <div className="checkoutRight">
            <div className="checkoutCard">
              <div className="summaryTop">
                <div>
                  <div className="summaryTitle">Order Summary</div>
                  <div className="summaryPlan">{initial.planName}</div>
                  <div className="summaryCycle">{billing === "monthly" ? "Monthly Plan" : "Annual Plan"}</div>
                </div>
                <div className="summaryAmount">{money(amount)}</div>
              </div>

              <div className="summaryLine" />
              <div className="sumRow">
                <span>Subtotal</span>
                <span>{money(amount)}</span>
              </div>
              <div className="sumRow muted">
                <span>Tax (0%)</span>
                <span>{money(0)}</span>
              </div>

              <div className="summaryLine" />
              <div className="sumRow total">
                <span>Total Due</span>
                <span className="totalNum">{money(amount)}</span>
              </div>

              <div className="walletBox">
                <div className="walletTitle">YOU’LL GET:</div>
                <ul className="walletList">
                  <li>✓ Unlimited Active Pitches</li>
                  <li>✓ Advanced Visitor Analytics</li>
                  <li>✓ AI Investor Matching (50/mo)</li>
                  <li>✓ Custom Branding & Domain</li>
                </ul>
                <div className="walletFoot">
                  By confirming your subscription, you allow PitchDeckAI to charge your card in accordance with our Terms.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashShell>
  );
}