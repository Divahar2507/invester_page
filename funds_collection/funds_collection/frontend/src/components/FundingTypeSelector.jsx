import React, { useState } from 'react';
import { Users, Microscope, Rocket, Globe, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import './FundingTypeSelector.css';

const fundingTypes = [
    {
        id: 'crowd',
        title: 'Crowd Funding',
        icon: <Users size={32} />,
        description: 'For public contributions & MVP launches. Min ₹100.',
        color: '#3498db'
    },
    {
        id: 'research',
        title: 'Research Funding',
        icon: <Microscope size={32} />,
        description: 'For tech research, AI & innovation. Proposal based.',
        color: '#9b59b6'
    },
    {
        id: 'growth',
        title: 'Growth Funding',
        icon: <Rocket size={32} />,
        description: 'For scaling, hiring & marketing. Revenue proof needed.',
        color: '#2ecc71'
    },
    {
        id: 'public',
        title: 'Public Funding',
        icon: <Globe size={32} />,
        description: 'Govt, NGO & CSR grants. Compliance required.',
        color: '#e67e22'
    }
];

const FundingTypeSelector = ({ selectedType, onSelect }) => {
    return (
        <section className="section container" id="start-funding">
            <div className="section-header">
                <h2 className="section-title">Choose Your <span className="text-gradient">Funding Path</span></h2>
                <p className="section-subtitle">Select the option that best fits your startup's current stage and needs.</p>
            </div>

            <div className="funding-grid">
                {fundingTypes.map((type) => (
                    <motion.div
                        key={type.id}
                        className={`funding-card ${selectedType === type.id ? 'active' : ''}`}
                        onClick={() => onSelect(type.id)}
                        whileHover={{ y: -5 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <div className="card-icon" style={{ backgroundColor: `${type.color}20`, color: type.color }}>
                            {type.icon}
                        </div>
                        <h3 className="card-title">{type.title}</h3>
                        <p className="card-desc">{type.description}</p>

                        {selectedType === type.id && (
                            <motion.div
                                className="check-badge"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                            >
                                <CheckCircle2 size={20} color={type.color} fill="white" />
                            </motion.div>
                        )}
                    </motion.div>
                ))}
            </div>
        </section>
    );
};

export default FundingTypeSelector;
