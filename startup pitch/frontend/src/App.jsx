import React, { useEffect } from "react";
import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";

import Dashboard from "./pages/Dashboard.jsx";
// ... (keep other component imports if they are needed, but for replacement I'm replacing the top block)

import UpgradePlans from "./pages/UpgradePlans.jsx";
import UpgradeCheckout from "./pages/UpgradeCheckout.jsx";
import UpgradeSuccess from "./pages/UpgradeSuccess.jsx";
import EnterpriseSuccess from "./pages/EnterpriseSuccess.jsx";
import MyPitches from "./pages/MyPitches.jsx";
import Notifications from "./pages/Notifications.jsx";
import CompanyProfile from "./pages/CompanyProfile.jsx";
import EditProfile from "./pages/EditProfile.jsx";
import Opportunities from "./pages/Opportunities.jsx";
import Settings from "./pages/Settings.jsx";
import ContactSales from "./pages/ContactSales.jsx";
import EnterpriseReview from "./pages/EnterpriseReview.jsx";
import Investors from "./pages/Investors.jsx";
import InvestorProfile from "./pages/InvestorProfile.jsx";
import Messages from "./pages/Messages.jsx";
import { getToken, setAuth } from "./auth.js";

function ProtectedRoute({ children }) {
  const token = getToken();
  if (!token) {
    // Redirect to Main Portal Login if not authenticated
    window.location.href = "http://localhost/login/startup";
    return null;
  }
  return children;
}

function TokenCapture() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    if (token) {
      setAuth({ token });
      // Clear URL and go to dashboard
      navigate("/dashboard", { replace: true });
    }
  }, [location, navigate]);

  return null;
}

export default function App() {
  return (
    <>
      <TokenCapture />
      <Routes>
        {/* Redirect root to Dashboard, which is protected */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* If user tries to access /login or /signup on this port, send them to main portal */}
        <Route path="/login" element={<Navigate to="/" replace />} />
        <Route path="/signup" element={<Navigate to="/" replace />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-pitches"
          element={
            <ProtectedRoute>
              <MyPitches />
            </ProtectedRoute>
          }
        />

        <Route
          path="/company-profile"
          element={
            <ProtectedRoute>
              <CompanyProfile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <Notifications />
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />

        <Route
          path="/edit-profile"
          element={
            <ProtectedRoute>
              <EditProfile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/opportunities"
          element={
            <ProtectedRoute>
              <Opportunities />
            </ProtectedRoute>
          }
        />

        <Route
          path="/investors"
          element={
            <ProtectedRoute>
              <Investors />
            </ProtectedRoute>
          }
        />

        <Route
          path="/investor/:id"
          element={
            <ProtectedRoute>
              <InvestorProfile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/messages"
          element={
            <ProtectedRoute>
              <Messages />
            </ProtectedRoute>
          }
        />

        <Route
          path="/upgrade"
          element={
            <ProtectedRoute>
              <UpgradePlans />
            </ProtectedRoute>
          }
        />

        <Route
          path="/upgrade/checkout"
          element={
            <ProtectedRoute>
              <UpgradeCheckout />
            </ProtectedRoute>
          }
        />

        <Route
          path="/upgrade/success"
          element={
            <ProtectedRoute>
              <EnterpriseSuccess />
            </ProtectedRoute>
          }
        />
        <Route
          path="/contact-sales"
          element={
            <ProtectedRoute>
              <ContactSales />
            </ProtectedRoute>
          }
        />

        <Route
          path="/enterprise/review"
          element={
            <ProtectedRoute>
              <EnterpriseReview />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/signup" replace />} />
      </Routes>
    </>
  );
}