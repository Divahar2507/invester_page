// Use import * as React to ensure JSX intrinsic elements are recognized
import * as React from 'react';
import { HashRouter as Router, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import BrowsePitches from './pages/BrowsePitches';
import Portfolio from './pages/Portfolio';
import InReview from './pages/InReview';
import Messages from './pages/Messages';
import Login from './pages/Login';
import Register from './pages/Register';
// Placeholder for missing components to ensure build works
import Settings from './pages/Settings';
import LogInvestment from './pages/LogInvestment';
import ExportReports from './pages/ExportReports';
import Profile from './pages/Profile';
import ChangePhoto from './pages/ChangePhoto';
import ChangePassword from './pages/ChangePassword';
import NotificationsPage from './pages/Notifications';
import WatchlistManagement from './pages/WatchlistManagement';
import PitchDeckView from './pages/PitchDeckView';
import ScheduleMeeting from './pages/ScheduleMeeting';
import Landing from './pages/Landing';
import ContactSupport from './pages/ContactSupport';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

// const SettingsPage = () => <div className="p-8 text-2xl font-bold">Settings Page (Coming Soon)</div>; // Removed placeholder

const MainLayout = () => (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 antialiased">
        <Sidebar />
        <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden pt-16">
            <Navbar />
            <main className="flex-1">
                <Outlet />
            </main>
        </div>
    </div>
);

const RequireAuth = ({ children }) => {
    const token = localStorage.getItem('token');
    if (!token) {
        return <Navigate to="/login" replace />;
    }
    return children;
};

import { GoogleOAuthProvider } from '@react-oauth/google';

const App = () => {
    return (
        <GoogleOAuthProvider clientId="835532330363-8lohj8uk8bvqd37nnlpsfl4rslul8nff.apps.googleusercontent.com">
            <Router>
                <Routes>
                    <Route path="/" element={<Landing />} />

                    {/* Unified Login/Register Routes that accept logic via props or URL params */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/login/investor" element={<Login role="investor" />} />
                    <Route path="/login/startup" element={<Login role="startup" />} />

                    <Route path="/register" element={<Register />} />
                    <Route path="/register/investor" element={<Register role="investor" />} />
                    <Route path="/register/startup" element={<Register role="startup" />} />

                    <Route path="/contact-support" element={<ContactSupport />} />

                    {/* Password Recovery */}
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/reset-password" element={<ResetPassword />} />

                    <Route element={<RequireAuth><MainLayout /></RequireAuth>}>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/browse" element={<BrowsePitches />} />
                        <Route path="/portfolio" element={<Portfolio />} />
                        <Route path="/in-review" element={<InReview />} />
                        <Route path="/messages" element={<Messages />} />
                        <Route path="/settings" element={<Settings />} />
                        <Route path="/log-investment" element={<LogInvestment />} />
                        <Route path="/export-reports" element={<ExportReports />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/change-photo" element={<ChangePhoto />} />
                        <Route path="/change-password" element={<ChangePassword />} />
                        <Route path="/notifications" element={<NotificationsPage />} />
                        <Route path="/watchlist" element={<WatchlistManagement />} />
                        <Route path="/pitch/:id" element={<PitchDeckView />} />
                        <Route path="/schedule-meeting/:id" element={<ScheduleMeeting />} />
                    </Route>
                </Routes>
            </Router>
        </GoogleOAuthProvider>
    );
};

export default App;
