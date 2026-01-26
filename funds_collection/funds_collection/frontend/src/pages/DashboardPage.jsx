import React, { useState, useEffect } from 'react';
import Hero from '../components/Hero';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, Users, Wallet, ArrowRight, PieChart } from 'lucide-react';
import './DashboardPage.css';

const DashboardPage = () => {
    const [funds, setFunds] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchFunds = async () => {
            try {
                const response = await fetch('http://localhost:8001/funds');
                if (response.ok) {
                    const data = await response.json();
                    setFunds(data);
                }
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchFunds();
    }, []);

    // Metrics Calculation
    const totalRaised = funds.reduce((acc, fund) => acc + fund.current_amount, 0);
    const activeProjects = funds.length;
    const avgFunding = activeProjects > 0 ? totalRaised / activeProjects : 0;

    // Trending Logic (Top 3 by % funded)
    const trendingFunds = [...funds]
        .sort((a, b) => (b.current_amount / b.target_amount) - (a.current_amount / a.target_amount))
        .slice(0, 3);

    // Category Distribution
    const categories = funds.reduce((acc, fund) => {
        acc[fund.category] = (acc[fund.category] || 0) + 1;
        return acc;
    }, {});

    const formatCurrency = (amount) => {
        if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)}Cr`;
        if (amount >= 100000) return `₹${(amount / 100000).toFixed(2)}L`;
        return `₹${amount.toLocaleString()}`;
    };

    if (loading) return <div className="loading-state">Loading dashboard...</div>;

    return (
        <div className="page-container fade-in">
            <div className="dashboard-header">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Dashboard Overview</h1>
                    <p className="text-muted">Welcome back, Alex. Here's what's happening today.</p>
                </div>
                <button
                    className="btn btn-primary"
                    onClick={() => navigate('/funds')}
                >
                    Browse All Funds
                </button>
            </div>

            {/* Key Metrics Grid */}
            <div className="metrics-grid">
                <div className="metric-card glass-card">
                    <div className="metric-icon" style={{ background: 'rgba(46, 204, 113, 0.2)', color: '#2ecc71' }}>
                        <Wallet size={24} />
                    </div>
                    <div>
                        <p className="metric-label">Total Capital Raised</p>
                        <h3 className="metric-value">{formatCurrency(totalRaised)}</h3>
                    </div>
                </div>
                <div className="metric-card glass-card">
                    <div className="metric-icon" style={{ background: 'rgba(52, 152, 219, 0.2)', color: '#3498db' }}>
                        <TrendingUp size={24} />
                    </div>
                    <div>
                        <p className="metric-label">Active Projects</p>
                        <h3 className="metric-value">{activeProjects}</h3>
                    </div>
                </div>
                <div className="metric-card glass-card">
                    <div className="metric-icon" style={{ background: 'rgba(155, 89, 182, 0.2)', color: '#9b59b6' }}>
                        <PieChart size={24} />
                    </div>
                    <div>
                        <p className="metric-label">Avg. Funding / Project</p>
                        <h3 className="metric-value">{formatCurrency(avgFunding)}</h3>
                    </div>
                </div>
            </div>

            <div className="dashboard-content-grid">
                {/* Trending Section */}
                <div className="trending-section glass-card">
                    <div className="section-header-row">
                        <h3 className="section-title">Trending Projects</h3>
                        <span className="text-link" onClick={() => navigate('/funds')}>View All</span>
                    </div>
                    <div className="trending-list">
                        {trendingFunds.map(fund => (
                            <div key={fund.id} className="trending-item" onClick={() => navigate(`/funds/${fund.id}`)}>
                                <img src={fund.image_url} alt={fund.title} className="trending-thumb" />
                                <div className="trending-info">
                                    <h4>{fund.title}</h4>
                                    <div className="mini-progress">
                                        <div
                                            className="mini-bar"
                                            style={{ width: `${Math.min((fund.current_amount / fund.target_amount) * 100, 100)}%` }}
                                        ></div>
                                    </div>
                                    <span className="trending-meta">
                                        {((fund.current_amount / fund.target_amount) * 100).toFixed(0)}% Funded
                                    </span>
                                </div>
                                <ArrowRight size={16} className="arrow-icon" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Categories Section */}
                <div className="categories-section glass-card">
                    <h3 className="section-title">Funds by Category</h3>
                    <div className="category-list">
                        {Object.entries(categories).map(([cat, count]) => (
                            <div key={cat} className="category-row">
                                <span className="cat-name">{cat}</span>
                                <div className="cat-bar-container">
                                    <div className="cat-bar" style={{ width: `${(count / activeProjects) * 100}%` }}></div>
                                </div>
                                <span className="cat-count">{count}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
