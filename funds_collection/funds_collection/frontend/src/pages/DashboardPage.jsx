import React from 'react';
import Hero from '../components/Hero';

const DashboardPage = () => {
    return (
        <div className="page-container fade-in">
            <Hero />
            <div className="dashboard-widgets" style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                {/* Placeholder Quick Stats to look like a Dashboard */}
                <div className="glass-card padding-lg" style={{ padding: '1.5rem' }}>
                    <h3 style={{ fontSize: '1rem', color: '#a0a0a0', marginBottom: '0.5rem' }}>Total Funds Deployed</h3>
                    <p style={{ fontSize: '2rem', fontWeight: '700', color: '#2ecc71' }}>₹12.5L</p>
                </div>
                <div className="glass-card padding-lg" style={{ padding: '1.5rem' }}>
                    <h3 style={{ fontSize: '1rem', color: '#a0a0a0', marginBottom: '0.5rem' }}>Active Investments</h3>
                    <p style={{ fontSize: '2rem', fontWeight: '700', color: '#3498db' }}>8</p>
                </div>
                <div className="glass-card padding-lg" style={{ padding: '1.5rem' }}>
                    <h3 style={{ fontSize: '1rem', color: '#a0a0a0', marginBottom: '0.5rem' }}>Pending Requests</h3>
                    <p style={{ fontSize: '2rem', fontWeight: '700', color: '#e67e22' }}>3</p>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
