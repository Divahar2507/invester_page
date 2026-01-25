import React, { useState } from 'react';
import { Trophy, TrendingUp, Users, ArrowRight, Crown } from 'lucide-react';
import { motion } from 'framer-motion';
import './Leaderboard.css';

const startups = [
    {
        id: 1,
        name: 'TechNova AI',
        category: 'SaaS / AI',
        raised: 4500000,
        supporters: 1240,
        growth: 92,
        rank: 1,
        logo: 'TN'
    },
    {
        id: 2,
        name: 'GreenEarth Energy',
        category: 'CleanTech',
        raised: 3200000,
        supporters: 850,
        growth: 85,
        rank: 2,
        logo: 'GE'
    },
    {
        id: 3,
        name: 'MediCare Plus',
        category: 'HealthTech',
        raised: 2800000,
        supporters: 640,
        growth: 78,
        rank: 3,
        logo: 'MP'
    },
    {
        id: 4,
        name: 'EdLearn Pro',
        category: 'EdTech',
        raised: 1200000,
        supporters: 420,
        growth: 65,
        rank: 4,
        logo: 'EL'
    },
    {
        id: 5,
        name: 'Urban Move',
        category: 'Logistics',
        raised: 950000,
        supporters: 310,
        growth: 55,
        rank: 5,
        logo: 'UM'
    },
];

const Leaderboard = () => {
    const [filter, setFilter] = useState('month');

    return (
        <section className="section container" id="leaderboard">
            <div className="section-header">
                <h2 className="section-title">Top Performing <span className="text-gradient">Startups</span></h2>
                <div className="filter-tabs">
                    {['Today', 'This Week', 'This Month'].map((f) => (
                        <button
                            key={f}
                            className={`filter-btn ${filter === f.toLowerCase().replace(' ', '') ? 'active' : ''}`}
                            onClick={() => setFilter(f.toLowerCase().replace(' ', ''))}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            <div className="leaderboard-grid">
                {startups.map((startup, index) => (
                    <motion.div
                        key={startup.id}
                        className={`startup-card ${index < 3 ? 'featured-card' : ''}`}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                    >
                        {index === 0 && (
                            <div className="rank-badge gold">
                                <Crown size={20} fill="#f1c40f" color="#f1c40f" /> #1
                            </div>
                        )}
                        {index === 1 && <div className="rank-badge silver">#2</div>}
                        {index === 2 && <div className="rank-badge bronze">#3</div>}

                        <div className="card-header">
                            <div className={`logo-placeholder logo-${index + 1}`}>{startup.logo}</div>
                            <div>
                                <h3 className="startup-name">{startup.name}</h3>
                                <span className="startup-cat">{startup.category}</span>
                            </div>
                        </div>

                        <div className="card-stats">
                            <div className="stat">
                                <span className="label">Raised</span>
                                <span className="value text-gradient">₹{(startup.raised / 100000).toFixed(1)}L</span>
                            </div>
                            <div className="stat">
                                <span className="label">Supporters</span>
                                <span className="value">{startup.supporters}</span>
                            </div>
                        </div>

                        <div className="growth-bar-container">
                            <div className="growth-info">
                                <span>Growth Score</span>
                                <span className="growth-val">+{startup.growth}%</span>
                            </div>
                            <div className="progress-bg">
                                <div className="progress-fill" style={{ width: `${startup.growth}%` }}></div>
                            </div>
                        </div>

                        <div className="card-actions">
                            <button className="btn btn-outline small">View</button>
                            <button className="btn btn-primary small">
                                Fund Now <ArrowRight size={14} />
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};

export default Leaderboard;
