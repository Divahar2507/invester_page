import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import PDFViewerModal from '../components/PDFViewerModal';
import { ArrowLeft, Heart, CheckCircle, AlertCircle } from 'lucide-react';
import './FundDetailsPage.css';

const FundDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [fund, setFund] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [showPdf, setShowPdf] = useState(false);
    const [donationAmount, setDonationAmount] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    const fetchFundDetails = async () => {
        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8007';
            const response = await fetch(`${apiUrl}/funds/${id}`);
            if (response.ok) {
                const data = await response.json();
                setFund(data);
            } else {
                console.error('Fund not found');
                navigate('/funds');
            }
        } catch (error) {
            console.error('Error fetching fund details:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFundDetails();
    }, [id, navigate]);

    const handleDonation = async (e) => {
        e.preventDefault();
        if (!donationAmount || isNaN(donationAmount) || donationAmount <= 0) return;

        setSubmitting(true);
        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8007';
            const response = await fetch(`${apiUrl}/funds/${id}/donate?amount=${donationAmount}`, {
                method: 'POST',
            });
            if (response.ok) {
                const updatedFund = await response.json();
                setFund(updatedFund);
                setSuccessMsg(`Successfully donated ₹${donationAmount}!`);
                setDonationAmount('');
                setTimeout(() => setSuccessMsg(''), 5000);
            }
        } catch (error) {
            console.error('Error processing donation:', error);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="loading-state">Loading details...</div>;
    if (!fund) return null;

    const progress = Math.min((fund.current_amount / fund.target_amount) * 100, 100);

    return (
        <div className="page-container fade-in">
            <button className="btn-back" onClick={() => navigate('/funds')}>
                <ArrowLeft size={20} /> Back to Funds
            </button>

            <div className="fund-details-header">
                <div className="details-text">
                    <span className="category-tag">{fund.category}</span>
                    <h1 className="details-title">{fund.title}</h1>
                    <p className="details-desc">{fund.description}</p>

                    <div className="fund-progress-section" style={{ margin: '2rem 0' }}>
                        <div className="progress-labels">
                            <span>Raised: ₹{fund.current_amount.toLocaleString()}</span>
                            <span>Target: ₹{fund.target_amount.toLocaleString()}</span>
                        </div>
                        <div className="progress-bar-bg">
                            <motion.div
                                className="progress-bar-fill"
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 1 }}
                            />
                        </div>
                        <span className="percent-text">{progress.toFixed(1)}% of goal reached</span>
                    </div>

                    <div className="donation-card glass-card">
                        <h3 className="flex items-center gap-2 mb-4">
                            <Heart size={20} className="text-primary" /> Support this Project
                        </h3>
                        <form onSubmit={handleDonation} className="donation-form">
                            <div className="input-group">
                                <span className="currency-symbol">₹</span>
                                <input
                                    type="number"
                                    placeholder="Enter donation amount"
                                    value={donationAmount}
                                    onChange={(e) => setDonationAmount(e.target.value)}
                                    required
                                    className="donation-input"
                                />
                            </div>
                            <button
                                type="submit"
                                className="btn btn-primary w-full"
                                disabled={submitting}
                            >
                                {submitting ? 'Processing...' : 'Donate Now'}
                            </button>
                        </form>
                        <AnimatePresence>
                            {successMsg && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    className="success-badge"
                                >
                                    <CheckCircle size={16} /> {successMsg}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {fund.pdf_url && (
                        <div style={{ marginTop: '2rem' }}>
                            <button
                                onClick={() => setShowPdf(true)}
                                className="btn btn-outline"
                                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
                            >
                                📄 View Project Proposal
                            </button>
                        </div>
                    )}
                </div>
                <div className="details-image-container">
                    <img
                        src={fund.image_url || 'https://via.placeholder.com/600x400'}
                        alt={fund.title}
                        className="details-image"
                    />
                </div>
            </div>

            <PDFViewerModal
                isOpen={showPdf}
                onClose={() => setShowPdf(false)}
                pdfUrl={fund.pdf_url}
                title={`${fund.title} - Proposal`}
            />
        </div>
    );
};

export default FundDetailsPage;
