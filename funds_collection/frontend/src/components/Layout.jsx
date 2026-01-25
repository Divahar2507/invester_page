import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, Wallet, Trophy, FileText, Settings, LogOut } from 'lucide-react';
import './Layout.css';

const Layout = () => {
    return (
        <div className="app-layout">
            {/* Sidebar */}
            <aside className="sidebar">
                <div className="sidebar-header">
                    <div className="logo-icon">I</div>
                    <h1 className="logo-text">INVESTOR</h1>
                </div>

                <nav className="sidebar-nav">
                    <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                        <LayoutDashboard size={20} />
                        <span>Dashboard</span>
                    </NavLink>

                    <NavLink to="/funding" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                        <Wallet size={20} />
                        <span>Raise Funds</span>
                    </NavLink>

                    <NavLink to="/leaderboard" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                        <Trophy size={20} />
                        <span>Leaderboard</span>
                    </NavLink>

                    <NavLink to="/success-stories" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                        <FileText size={20} />
                        <span>Success Stories</span>
                    </NavLink>
                </nav>

                <div className="sidebar-footer">
                    <div className="nav-item">
                        <Settings size={20} />
                        <span>Settings</span>
                    </div>
                    <div className="user-profile">
                        <div className="avatar">A</div>
                        <div className="user-info">
                            <span className="user-name">Alex Sterling</span>
                            <span className="user-role">Founder</span>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="main-content">
                <header className="top-header">
                    <h2 className="current-page-title">Overview</h2>
                    <button className="btn-logout"><LogOut size={16} /> Logout</button>
                </header>
                <div className="content-scroll">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default Layout;
