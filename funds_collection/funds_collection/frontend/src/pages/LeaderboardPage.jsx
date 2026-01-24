import React from 'react';
import Leaderboard from '../components/Leaderboard';

const LeaderboardPage = () => {
    return (
        <div className="page-container fade-in">
            <div className="page-header" style={{ marginBottom: '2rem' }}>
                <h2 className="text-2xl font-bold mb-2">Global Leaderboard</h2>
                <p className="text-muted">Top performing startups and changemakers this month.</p>
            </div>

            <Leaderboard />
        </div>
    );
};

export default LeaderboardPage;
