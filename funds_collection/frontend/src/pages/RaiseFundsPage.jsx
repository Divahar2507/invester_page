import React, { useState } from 'react';
import FundingTypeSelector from '../components/FundingTypeSelector';
import DynamicFundingForm from '../components/DynamicFundingForm';
import PaymentSection from '../components/PaymentSection';

const RaiseFundsPage = () => {
    const [selectedFundingType, setSelectedFundingType] = useState(null);

    const handleTypeSelect = (type) => {
        setSelectedFundingType(type);
        setTimeout(() => {
            const formElement = document.getElementById('funding-form-container');
            if (formElement) formElement.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };

    return (
        <div className="page-container fade-in">
            <div className="page-header" style={{ marginBottom: '2rem' }}>
                <h2 className="text-2xl font-bold mb-2">Raise Capital</h2>
                <p className="text-muted">Select your funding model and start your journey.</p>
            </div>

            <FundingTypeSelector
                selectedType={selectedFundingType}
                onSelect={handleTypeSelect}
            />

            {selectedFundingType && (
                <div id="funding-form-container" style={{ marginTop: '3rem' }}>
                    <DynamicFundingForm selectedType={selectedFundingType} />
                </div>
            )}

            {/* Showing Payment Section only after some step or just at bottom for now as per previous single page flow */}
            {selectedFundingType && (
                <div style={{ marginTop: '3rem' }}>
                    <PaymentSection />
                </div>
            )}
        </div>
    );
};

export default RaiseFundsPage;
