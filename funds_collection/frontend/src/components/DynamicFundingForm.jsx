import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Paperclip, Check } from 'lucide-react';
import './DynamicFundingForm.css';

const DynamicFundingForm = ({ selectedType }) => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({});

    if (!selectedType) return null;

    const renderSpecificFields = () => {
        switch (selectedType) {
            case 'crowd':
                return (
                    <>
                        <div className="form-group full-width">
                            <label>Campaign Title</label>
                            <input type="text" placeholder="e.g. Eco-friendly Water Bottle" />
                        </div>
                        <div className="form-group full-width">
                            <label>Short Pitch (150 chars)</label>
                            <textarea maxLength="150" placeholder="Describe your idea in a tweet..."></textarea>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>End Date</label>
                                <input type="date" />
                            </div>
                            <div className="form-group">
                                <label>Reward Type</label>
                                <select>
                                    <option>Early Access</option>
                                    <option>Merchandise</option>
                                    <option>Equity</option>
                                    <option>None (Donation)</option>
                                </select>
                            </div>
                        </div>
                    </>
                );
            case 'research':
                return (
                    <>
                        <div className="form-group">
                            <label>Research Area</label>
                            <select>
                                <option>Artificial Intelligence</option>
                                <option>Biotechnology</option>
                                <option>Sustainable Energy</option>
                                <option>Materials Science</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Timeline</label>
                            <select>
                                <option>3 Months</option>
                                <option>6 Months</option>
                                <option>1 Year</option>
                                <option>2+ Years</option>
                            </select>
                        </div>
                        <div className="form-group full-width file-upload">
                            <label>Upload Research Proposal (PDF)</label>
                            <div className="upload-box">
                                <Upload size={24} />
                                <span>Drag & drop or click to upload proposal</span>
                            </div>
                        </div>
                    </>
                );
            case 'growth':
                return (
                    <>
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
                        <div className="form-group full-width">
                            <label>Traction Metrics</label>
                            <textarea placeholder="e.g. 20% MoM growth, 5k active users..."></textarea>
                        </div>
                        <div className="form-group full-width file-upload">
                            <label>Upload Pitch Deck</label>
                            <div className="upload-box">
                                <Paperclip size={24} />
                                <span>Attach Pitch Deck (PDF/PPT)</span>
                            </div>
                        </div>
                    </>
                );
            case 'public':
                return (
                    <>
                        <div className="form-group">
                            <label>Organization Type</label>
                            <select>
                                <option>NGO</option>
                                <option>Registered Startup</option>
                                <option>Educational Institution</option>
                            </select>
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

                <form className="dynamic-form">
                    <div className="form-grid">
                        {/* Common Fields */}
                        <div className="form-group">
                            <label>Startup Name</label>
                            <input type="text" placeholder="Enter startup name" />
                        </div>
                        <div className="form-group">
                            <label>Founder Name</label>
                            <input type="text" placeholder="Your full name" />
                        </div>
                        <div className="form-group">
                            <label>Email Address</label>
                            <input type="email" placeholder="name@company.com" />
                        </div>
                        <div className="form-group">
                            <label>Phone Number</label>
                            <input type="tel" placeholder="+91 98765 43210" />
                        </div>
                        <div className="form-group">
                            <label>Current Stage</label>
                            <select>
                                <option>Idea Phase</option>
                                <option>MVP</option>
                                <option>Early Revenue</option>
                                <option>Growth/Scaling</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Amount Required (₹)</label>
                            <input type="number" placeholder="5,00,000" />
                        </div>
                    </div>

                    <div className="specific-fields-container">
                        <h4 className="divider-title"><span>{selectedType.toUpperCase()} DETAILS</span></h4>
                        <div className="form-grid specific-grid">
                            {renderSpecificFields()}
                        </div>
                    </div>

                    <div className="form-footer">
                        <button type="button" className="btn btn-primary full-btn" onClick={() => window.location.href = '#payment'}>
                            Continue to Payment
                            <Check size={18} />
                        </button>
                    </div>
                </form>
            </div>
        </motion.section>
    );
};

export default DynamicFundingForm;
