import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FundingTypeSelector from '../components/FundingTypeSelector';
import DynamicFundingForm from '../components/DynamicFundingForm';


const RaiseFundsPage = () => {
    const [selectedFundingType, setSelectedFundingType] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleTypeSelect = (type) => {
        setSelectedFundingType(type);
        setTimeout(() => {
            const formElement = document.getElementById('funding-form-container');
            if (formElement) formElement.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };

    const handleFundCreation = async (fundData) => {
        setIsSubmitting(true);
        try {
            const response = await fetch('http://localhost:8001/funds', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(fundData)
            });

            if (response.ok) {
                // Redirect to funds catalog page after success
                navigate('/funds');
            } else {
                console.error("Failed to create fund");
            }
        } catch (error) {
            console.error("Error creating fund:", error);
        } finally {
            setIsSubmitting(false);
        }
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
                    <DynamicFundingForm
                        selectedType={selectedFundingType}
                        onSubmit={handleFundCreation}
                        loading={isSubmitting}
                    />
                </div>
            )}
        </div>
    );
};

export default RaiseFundsPage;
