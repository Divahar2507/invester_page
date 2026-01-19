import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashLayout from "../components/DashLayout.jsx";
import { api } from "../api.js";

function formatMoney(amount) {
  // simple display helper
  const n = Number(amount);
  if (Number.isNaN(n)) return amount;
  return n.toFixed(2);
}

export default function Settings() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);

  const [form, setForm] = useState({
    full_name: "",
    company_name: "",
    mobile_number: "",
  });

  const [pw, setPw] = useState({
    current_password: "",
    new_password: "",
    confirm_new_password: "",
  });

  const [saving, setSaving] = useState(false);
  const [changingPw, setChangingPw] = useState(false);

  const [toast, setToast] = useState({ type: "", msg: "" });

  // Demo subscription data (no billing provider exists in your backend yet)
  const subscription = useMemo(() => {
    const plan = localStorage.getItem("plan_name") || "Pro Growth";
    const status = localStorage.getItem("plan_status") || "Active";
    const price = localStorage.getItem("plan_price") || "49";
    const interval = localStorage.getItem("plan_interval") || "mo";
    const nextBilling = localStorage.getItem("next_billing_date") || "November 24, 2023";

    return { plan, status, price, interval, nextBilling };
  }, []);

  const billingHistory = useMemo(() => {
    // Demo rows. If you later add DB tables, replace with real API.
    return [
      { date: "Oct 24, 2023", amount: 49.0, status: "Paid", invoice: "#" },
      { date: "Sep 24, 2023", amount: 49.0, status: "Paid", invoice: "#" },
      { date: "Aug 24, 2023", amount: 49.0, status: "Paid", invoice: "#" },
    ];
  }, []);

  function showToast(type, msg) {
    setToast({ type, msg });
    window.clearTimeout(showToast._t);
    showToast._t = window.setTimeout(() => setToast({ type: "", msg: "" }), 2500);
  }

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        const me = await api.me();
        if (!alive) return;

        setProfile(me);
        setForm({
          full_name: me.full_name || "",
          company_name: me.company_name || "",
          mobile_number: me.mobile_number || "",
        });
      } catch (e) {
        showToast("error", e.message || "Failed to load settings");
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  async function onSaveProfile(e) {
    e.preventDefault();
    try {
      setSaving(true);
      const updated = await api.updateMe({
        full_name: form.full_name,
        company_name: form.company_name,
        mobile_number: form.mobile_number,
      });
      setProfile(updated);
      showToast("success", "Profile updated");
    } catch (e2) {
      showToast("error", e2.message || "Could not update profile");
    } finally {
      setSaving(false);
    }
  }

  async function onChangePassword(e) {
    e.preventDefault();
    if (pw.new_password !== pw.confirm_new_password) {
      showToast("error", "New passwords do not match");
      return;
    }

    try {
      setChangingPw(true);
      await api.changePassword({
        current_password: pw.current_password,
        new_password: pw.new_password,
      });
      setPw({ current_password: "", new_password: "", confirm_new_password: "" });
      showToast("success", "Password updated");
    } catch (e2) {
      showToast("error", e2.message || "Could not change password");
    } finally {
      setChangingPw(false);
    }
  }

  return (
    <DashLayout>
      <div className="settingsWrap">
        
        <div className="settingsHead">
        <div>
            <div className="settingsTitle">Subscription & Billing</div>
            <div className="settingsSub">
            Manage your plan, payment details, and invoices.
            </div>
        </div>

        <button
            className="btnGhost"
            type="button"
            onClick={() => navigate("/contact-sales")} // Changed from mailto
        >
            Contact Sales / Support
        </button>
        </div>

        {toast.msg ? (
          <div className={`toast ${toast.type}`}>
            {toast.msg}
          </div>
        ) : null}

        <div className="settingsGrid">
          <div className="card">
            <div className="cardTop">
              <div>
                <div className="cardTitle">{subscription.plan}</div>
                <div className="pillRow">
                  <span className={`pill ${subscription.status === "Active" ? "ok" : ""}`}>
                    {subscription.status}
                  </span>
                  <span className="pill subtle">Monthly</span>
                </div>
              </div>

              <div className="priceBox">
                <div className="price">
                  ${subscription.price}
                  <span className="per">/{subscription.interval}</span>
                </div>
                <div className="muted">
                  Next billing date: <b>{subscription.nextBilling}</b>
                </div>
              </div>
            </div>

            <div className="cardActions">
              <button className="btnPrimary" type="button" onClick={() => navigate("/upgrade")}>
                Upgrade Plan
              </button>
              <button
                className="linkDanger"
                type="button"
                onClick={() => showToast("error", "Cancel subscription is not wired yet")}
              >
                Cancel Subscription
              </button>
            </div>
          </div>

          <div className="card">
            <div className="cardTop">
              <div className="cardTitle">Payment Method</div>
              <div className="muted">Saved card details (demo)</div>
            </div>

            <div className="pmRow">
              <div className="pmCard">
                <div className="pmBrand">VISA</div>
                <div className="pmDigits">•••• 4242</div>
                <div className="pmMeta">Expires 12/24</div>
              </div>

              <span className="pill subtle">PRIVATE</span>
            </div>

            <div className="cardActions">
              <button
                className="btnOutline"
                type="button"
                onClick={() => showToast("error", "Update payment is not wired yet")}
              >
                Update Payment Method
              </button>
            </div>
          </div>

          <div className="card span2">
            <div className="cardTop">
              <div className="cardTitle">Billing History</div>
              <div className="muted">Invoices and payment status (demo)</div>
            </div>

            <div className="tableWrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th style={{ textAlign: "right" }}>Invoice</th>
                  </tr>
                </thead>
                <tbody>
                  {billingHistory.map((row, idx) => (
                    <tr key={idx}>
                      <td>{row.date}</td>
                      <td>${formatMoney(row.amount)}</td>
                      <td>
                        <span className="pill ok">{row.status}</span>
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <button
                          className="iconBtn"
                          type="button"
                          onClick={() => showToast("error", "Invoice download is not wired yet")}
                          aria-label="Download invoice"
                        >
                          ⬇
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="card span2">
            <div className="cardTop">
              <div>
                <div className="cardTitle">Profile</div>
                <div className="muted">Update your account details.</div>
              </div>
            </div>

            {loading ? (
              <div className="muted">Loading...</div>
            ) : (
              <form className="formGrid" onSubmit={onSaveProfile}>
                <div className="field">
                  <label>Full Name</label>
                  <input
                    value={form.full_name}
                    onChange={(e) => setForm((s) => ({ ...s, full_name: e.target.value }))}
                    placeholder="Your name"
                  />
                </div>

                <div className="field">
                  <label>Company Name</label>
                  <input
                    value={form.company_name}
                    onChange={(e) => setForm((s) => ({ ...s, company_name: e.target.value }))}
                    placeholder="Company"
                  />
                </div>

                <div className="field">
                  <label>Email</label>
                  <input value={profile?.email || ""} readOnly className="readOnly" />
                </div>

                <div className="field">
                  <label>Mobile Number</label>
                  <input
                    value={form.mobile_number}
                    onChange={(e) => setForm((s) => ({ ...s, mobile_number: e.target.value }))}
                    placeholder="+1 555 123 4567"
                  />
                </div>

                <div className="formActions">
                  <button className="btnPrimary" type="submit" disabled={saving}>
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            )}
          </div>

          <div className="card span2">
            <div className="cardTop">
              <div>
                <div className="cardTitle">Security</div>
                <div className="muted">Change your password.</div>
              </div>
            </div>

            <form className="formGrid" onSubmit={onChangePassword}>
              <div className="field">
                <label>Current Password</label>
                <input
                  type="password"
                  value={pw.current_password}
                  onChange={(e) => setPw((s) => ({ ...s, current_password: e.target.value }))}
                  placeholder="••••••••"
                />
              </div>

              <div className="field">
                <label>New Password</label>
                <input
                  type="password"
                  value={pw.new_password}
                  onChange={(e) => setPw((s) => ({ ...s, new_password: e.target.value }))}
                  placeholder="At least 8 characters"
                />
              </div>

              <div className="field">
                <label>Confirm New Password</label>
                <input
                  type="password"
                  value={pw.confirm_new_password}
                  onChange={(e) => setPw((s) => ({ ...s, confirm_new_password: e.target.value }))}
                  placeholder="Repeat new password"
                />
              </div>

              <div className="formActions">
                <button className="btnOutline" type="submit" disabled={changingPw}>
                  {changingPw ? "Updating..." : "Update Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </DashLayout>
  );
}