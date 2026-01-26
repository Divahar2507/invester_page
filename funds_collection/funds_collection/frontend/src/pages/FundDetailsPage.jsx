import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import PDFViewerModal from '../components/PDFViewerModal';
import { ArrowLeft } from 'lucide-react';
import './FundDetailsPage.css'; // We'll need to create this CSS

const FundDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [fund, setFund] = useState(null);
    const [loading, setLoading] = useState(true);

    const [showPdf, setShowPdf] = useState(false);

    useEffect(() => {
        const fetchFundDetails = async () => {
            try {
                const response = await fetch(`http://localhost:8001/funds/${id}`);
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

        fetchFundDetails();
    }, [id, navigate]);

    if (loading) return <div className="loading-state">Loading details...</div>;
    if (!fund) return null;

    return (
        <div className="page-container fade-in">
            <button
                className="btn-back"
                onClick={() => navigate('/funds')}
            >
                <ArrowLeft size={20} /> Back to Funds
            </button>

            <div className="fund-details-header">
                <div className="details-text">
                    <span className="category-tag">{fund.category}</span>
                    <h1 className="details-title">{fund.title}</h1>
                    <p className="details-desc">{fund.description}</p>

                    <div className="stats-row">
                        <div className="stat-item">
                            <span className="stat-label">Raised</span>
                            <span className="stat-value">₹{fund.current_amount.toLocaleString()}</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-label">Target</span>
                            <span className="stat-value">₹{fund.target_amount.toLocaleString()}</span>
                        </div>
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
