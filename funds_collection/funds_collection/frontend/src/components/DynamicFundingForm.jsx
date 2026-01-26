
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Paperclip, Check } from 'lucide-react';
import FileUpload from './FileUpload';
import CustomDropdown from './CustomDropdown';
import './DynamicFundingForm.css';

const DynamicFundingForm = ({ selectedType, onSubmit, loading }) => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        target_amount: '',
        category: selectedType,
        image_url: ''
    });

    useEffect(() => {
        setFormData(prev => ({ ...prev, category: selectedType }));
    }, [selectedType]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Basic mapping for demo purposes
        const submissionData = {
            title: formData.title || "New Project",
            description: formData.description || "No description provided.",
            target_amount: parseFloat(formData.target_amount) || 0,
            category: selectedType,
            image_url: formData.image_url || "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=1000",
            pdf_url: formData.pdf_url
        };
        onSubmit(submissionData);
    };

    if (!selectedType) return null;

    const renderSpecificFields = () => {
        switch (selectedType) {
            case 'crowd':
                return (
                    <>
                        <div className="form-group full-width">
                            <label>Campaign Title</label>
                            <input name="title" value={formData.title} onChange={handleChange} type="text" placeholder="e.g. Eco-friendly Water Bottle" />
                        </div>
                        <div className="form-group full-width">
                            <label>Short Pitch (150 chars)</label>
                            <textarea name="description" value={formData.description} onChange={handleChange} maxLength="150" placeholder="Describe your idea in a tweet..."></textarea>
                        </div>
                        {/* Other fields omitted for brevity in demo logic, but UI remains */}
                        <div className="form-row">
                            <div className="form-group">
                                <label>End Date</label>
                                <input type="date" />
                            </div>
                            <div className="form-group">
                                <label>Reward Type</label>
                                <CustomDropdown
                                    options={[
                                        { value: 'Early Access', label: 'Early Access' },
                                        { value: 'Merchandise', label: 'Merchandise' },
                                        { value: 'Equity', label: 'Equity' },
                                        { value: 'None (Donation)', label: 'None (Donation)' },
                                    ]}
                                    value={formData.rewardType || 'Early Access'}
                                    onChange={(val) => setFormData(prev => ({ ...prev, rewardType: val }))}
                                    placeholder="Select Reward"
                                />
                            </div>
                        </div>
                    </>
                );
            case 'research':
                return (
                    <>
                        <div className="form-group full-width">
                            <label>Research Title</label>
                            <input name="title" value={formData.title} onChange={handleChange} type="text" placeholder="e.g. Cancer Research" />
                        </div>
                        <div className="form-group full-width">
                            <label>Research Summary</label>
                            <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Summary of your research..."></textarea>
                        </div>
                        {/* Visual only fields */}
                        <div className="form-group">
                            <label>Timeline</label>
                            <CustomDropdown
                                options={[
                                    { value: '3 Months', label: '3 Months' },
                                    { value: '6 Months', label: '6 Months' },
                                    { value: '1 Year', label: '1 Year' },
                                    { value: '2+ Years', label: '2+ Years' },
                                ]}
                                value={formData.timeline || '3 Months'}
                                onChange={(val) => setFormData(prev => ({ ...prev, timeline: val }))}
                                placeholder="Select Timeline"
                            />
                        </div>
                        <div className="form-group full-width file-upload">
                            <label>Upload Research Proposal (PDF)</label>
                            <FileUpload
                                label="Drop Proposal PDF Here"
                                onUploadComplete={(url) => setFormData(prev => ({ ...prev, pdf_url: url }))}
                            />
                        </div>
                    </>
                );
            case 'growth':
                return (
                    <>
                        <div className="form-group full-width">
                            <label>Company Name</label>
                            <input name="title" value={formData.title} onChange={handleChange} type="text" placeholder="Your Company Name" />
                        </div>
                        <div className="form-group full-width">
                            <label>Traction Metrics (Description)</label>
                            <textarea name="description" value={formData.description} onChange={handleChange} placeholder="e.g. 20% MoM growth, 5k active users..."></textarea>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Monthly Revenue (MRR)</label>
                                <input type="text" placeholder="₹" />
                            </div>
                            <div className="form-group">
                                <label>Team Size</label>
                                <input type="number" placeholder="e.g. 10" />
                            </div>
                        </div>
                        <div className="form-group full-width file-upload">
                            <label>Upload Pitch Deck</label>
                            <FileUpload
                                label="Drop Pitch Deck PDF Here"
                                onUploadComplete={(url) => setFormData(prev => ({ ...prev, pdf_url: url }))}
                            />
                        </div>
                    </>
                );
            case 'public':
                return (
                    <>
                        <div className="form-group full-width">
                            <label>Project Name</label>
                            <input name="title" value={formData.title} onChange={handleChange} type="text" placeholder="Project Name" />
                        </div>
                        <div className="form-group full-width">
                            <label>Impact Description</label>
                            <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Describe the social impact..."></textarea>
                        </div>
                        <div className="form-group">
                            <label>Organization Type</label>
                            <CustomDropdown
                                options={[
                                    { value: 'NGO', label: 'NGO' },
                                    { value: 'Registered Startup', label: 'Registered Startup' },
                                    { value: 'Educational Institution', label: 'Educational Institution' },
                                ]}
                                value={formData.orgType || 'NGO'}
                                onChange={(val) => setFormData(prev => ({ ...prev, orgType: val }))}
                                placeholder="Select Type"
                            />
                        </div>
                        <div className="form-group">
                            <label>Registration Number</label>
                            <input type="text" placeholder="Registration / License No." />
                        </div>
                        <div className="form-group full-width">
                            <label>Compliance Checklist</label>
                            <div className="checkbox-group">
                                <label><input type="checkbox" /> 80G Certified</label>
                                <label><input type="checkbox" /> FCRA Compliant</label>
                                <label><input type="checkbox" /> Annual Audit Reports Available</label>
                            </div>
                        </div>
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <motion.section
            className="section container form-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="glass-card form-container">
                <div className="form-header">
                    <h3>Submit Application</h3>
                    <span className="step-indicator">Step 1 of 2</span>
                </div>

                <form className="dynamic-form" onSubmit={handleSubmit}>
                    <div className="form-grid">
                        {/* Common Fields */}
                        {/* If specific type doesn't have title, we might need a fallback, but we added title to all above */}
                        <div className="form-group">
                            <label>Amount Required (₹)</label>
                            <input name="target_amount" value={formData.target_amount} onChange={handleChange} type="number" placeholder="5,00,000" />
                        </div>
                        <div className="form-group">
                            <label>Founder Name</label>
                            <input type="text" placeholder="Your full name" />
                        </div>
                        <div className="form-group">
                            <label>Current Stage</label>
                            <CustomDropdown
                                options={[
                                    { value: 'Idea Phase', label: 'Idea Phase' },
                                    { value: 'MVP', label: 'MVP' },
                                    { value: 'Early Revenue', label: 'Early Revenue' },
                                    { value: 'Growth/Scaling', label: 'Growth/Scaling' },
                                ]}
                                value={formData.stage || 'Idea Phase'}
                                onChange={(val) => setFormData(prev => ({ ...prev, stage: val }))}
                                placeholder="Select Stage"
                            />
                        </div>
                        <div className="form-group">
                            <label>Email Address</label>
                            <input type="email" placeholder="name@company.com" />
                        </div>
                    </div>

                    <div className="specific-fields-container">
                        <h4 className="divider-title"><span>{selectedType.toUpperCase()} DETAILS</span></h4>
                        <div className="form-grid specific-grid">
                            {renderSpecificFields()}
                        </div>
                    </div>

                    <div className="form-footer">
                        <button type="submit" className="btn btn-primary full-btn" disabled={loading}>
                            {loading ? 'Submitting...' : 'Create Fund'}
                            <Check size={18} />
                        </button>
                    </div>
                </form>
            </div>
        </motion.section>
    );
};

export default DynamicFundingForm;
