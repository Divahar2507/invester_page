import React from 'react';

export default function SettingsView() {
    // Basic settings placeholders for now


    return (
        <div style={{ maxWidth: 640 }}>
            <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 24 }}>
                Settings
            </h1>



            <div className="dashboard-section">
                <h3>Account</h3>
                <p style={{ fontSize: 13, color: '#64748b' }}>
                    Account settings (email, password) are managed by your admin.
                </p>
            </div>
        </div>
    );
}
