import React, { useState, useEffect } from 'react';
import { Trophy, Medal } from 'lucide-react';
import CustomDropdown from '../components/CustomDropdown';
import './LeaderboardPage.css';

const LeaderboardPage = () => {
    const [funds, setFunds] = useState([]);
    const [filter, setFilter] = useState('All');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFunds = async () => {
            setLoading(true);
            try {
                const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8007';
                let url = `${apiUrl}/funds`;
                if (filter !== 'All') {
                    url += `?category=${filter}`;
                }
                const response = await fetch(url);
                if (response.ok) {
                    const data = await response.json();
                    // Sort by percent funded desc
                    const sortedData = data.sort((a, b) => {
                        const pctA = a.current_amount / a.target_amount;
                        const pctB = b.current_amount / b.target_amount;
                        return pctB - pctA;
                    });
                    setFunds(sortedData);
                }
            } catch (error) {
                console.error('Error fetching leaderboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchFunds();
    }, [filter]);

    const getRankClass = (index) => {
        if (index === 0) return 'rank-1';
        if (index === 1) return 'rank-2';
        if (index === 2) return 'rank-3';
        return 'rank-other';
    };

    const getMedalIcon = (index) => {
        if (index === 0) return <Trophy size={18} />;
        if (index === 1) return <Medal size={18} />;
        if (index === 2) return <Medal size={18} />;
        return <span className="rank-number">#{index + 1}</span>;
    };

    return (
        <div className="page-container fade-in leaderboard-container">
            <div className="leaderboard-header">
                <div className="leaderboard-title">
                    <h2>Global Leaderboard</h2>
                    <p className="text-muted">Celebrating the most impactful projects.</p>
                </div>

                <div className="custom-select-wrapper">
                    <CustomDropdown
                        options={[
                            { value: 'All', label: 'All Categories' },
                            { value: 'Crowd', label: 'Crowd Funding' },
                            { value: 'Research', label: 'Research Funding' },
                            { value: 'Growth', label: 'Growth Funding' },
                            { value: 'Startup', label: 'Startup Funding' },
                            { value: 'Public', label: 'Public Funding' },
                        ]}
                        value={filter}
                        onChange={(value) => setFilter(value)}
                        placeholder="Filter by Category"
                    />
                </div>
            </div>

            {loading ? (
                <div className="loading-state">Loading ranks...</div>
            ) : (
                <div className="glass-table-container">
                    <div className="table-header">
                        <span>Rank</span>
                        <span>Project Details</span>
                        <span>Category</span>
                        <span>Progress</span>
                        <span>Raised</span>
                    </div>
                    {funds.map((fund, index) => {
                        const progress = Math.min((fund.current_amount / fund.target_amount) * 100, 100);
                        return (
                            <div key={fund.id} className={`table-row ${getRankClass(index)}`}>
                                <div className="rank-cell">
                                    {getMedalIcon(index)}
                                </div>
                                <div className="project-info">
                                    <img
                                        src={fund.image_url || 'https://via.placeholder.com/40'}
                                        alt=""
                                        className="project-thumb"
                                    />
                                    <span className="project-name">{fund.title}</span>
                                </div>
                                <div>
                                    <span className="category-badge">{fund.category}</span>
                                </div>
                                <div className="progress-cell">
                                    <div className="progress-track">
                                        <div className="progress-bar" style={{ width: `${progress}%` }}></div>
                                    </div>
                                    <span className="progress-text">{progress.toFixed(0)}%</span>
                                </div>
                                <div className="raised-amount">
                                    ₹{fund.current_amount.toLocaleString()}
                                </div>
                            </div>
                        );
                    })}
                    {funds.length === 0 && (
                        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                            No funds found for this category.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default LeaderboardPage;
