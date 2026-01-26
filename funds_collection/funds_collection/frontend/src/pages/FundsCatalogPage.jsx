import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, ArrowRight, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import CustomDropdown from '../components/CustomDropdown';
import './FundsCatalogPage.css';

const FundsCatalogPage = () => {
    const [funds, setFunds] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchFunds();
    }, []);

    const fetchFunds = async (category = 'All') => {
        try {
            let url = 'http://localhost:8001/funds';
            if (category && category !== 'All') {
                url += `?category=${category}`;
            }
            const response = await fetch(url);
            if (response.ok) {
                const data = await response.json();
                setFunds(data);
            }
        } catch (error) {
            console.error('Error fetching funds:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredFunds = funds.filter(fund =>
        fund.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        fund.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="page-container fade-in">
            <div className="catalog-header">
                <div>
                    <h2 className="text-3xl font-bold mb-2">Explore <span className="text-gradient">Funds</span></h2>
                    <p className="text-muted">Discover and support innovative projects.</p>
                </div>
                <button
                    className="btn btn-primary flex items-center gap-2"
                    onClick={() => navigate('/funding')}
                >
                    <Plus size={20} />
                    Create Fund
                </button>
            </div>

            <div className="search-bar-container glass-card">
                <Search className="search-icon" size={20} />
                <input
                    type="text"
                    placeholder="Search funds by name or description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
                <div style={{ minWidth: '220px' }}>
                    <CustomDropdown
                        options={[
                            { value: 'All', label: 'All Categories' },
                            { value: 'Crowd', label: 'Crowd Funding' },
                            { value: 'Research', label: 'Research Funding' },
                            { value: 'Growth', label: 'Growth Funding' },
                            { value: 'Startup', label: 'Startup Funding' },
                            { value: 'Public', label: 'Public Funding' },
                        ]}
                        value="All"
                        onChange={(value) => fetchFunds(value)}
                        placeholder="Filter by Category"
                    />
                </div>
            </div>

            {loading ? (
                <div className="loading-state">Loading funds...</div>
            ) : (
                <div className="funds-grid">
                    {filteredFunds.map((fund) => (
                        <motion.div
                            key={fund.id}
                            className="fund-card glass-card"
                            whileHover={{ y: -5 }}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <div className="fund-image-container">
                                <img
                                    src={fund.image_url || 'https://via.placeholder.com/400x200'}
                                    alt={fund.title}
                                    className="fund-image"
                                />
                                <div className="fund-category-badge">
                                    {fund.category}
                                </div>
                            </div>
                            <div className="fund-content">
                                <h3 className="fund-title">{fund.title}</h3>
                                <p className="fund-desc">{fund.description}</p>

                                <div className="fund-progress-section">
                                    <div className="progress-labels">
                                        <span>Raised: ₹{fund.current_amount.toLocaleString()}</span>
                                        <span>Target: ₹{fund.target_amount.toLocaleString()}</span>
                                    </div>
                                    <div className="progress-bar-bg">
                                        <div
                                            className="progress-bar-fill"
                                            style={{ width: `${Math.min((fund.current_amount / fund.target_amount) * 100, 100)}%` }}
                                        ></div>
                                    </div>
                                </div>

                                <div className="fund-actions">
                                    <button
                                        className="btn btn-outline flex-1"
                                        onClick={() => navigate(`/funds/${fund.id}`)}
                                    >
                                        View Details
                                    </button>

                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default FundsCatalogPage;
