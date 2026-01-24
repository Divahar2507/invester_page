import React, { useState } from 'react';
import { CreditCard, Smartphone, Building, Wallet, CheckCircle, ShieldCheck } from 'lucide-react';
import './PaymentSection.css';

const PaymentSection = () => {
    const [amount, setAmount] = useState(1000);
    const [method, setMethod] = useState('upi');

    const handleAmountClick = (val) => setAmount(val);

    return (
        <section className="section container" id="payment">
            <div className="payment-layout">
                <div className="payment-left">
                    <h2 className="section-title">Secure <span className="text-gradient">Contribution</span></h2>
                    <p className="payment-subtitle">100% Secure payment gateways. Your funds reach the startup directly.</p>

                    <div className="amount-selector">
                        <p className="label">Select Amount</p>
                        <div className="amount-grid">
                            {[100, 500, 1000, 5000].map((val) => (
                                <button
                                    key={val}
                                    className={`amount-btn ${amount === val ? 'active' : ''}`}
                                    onClick={() => handleAmountClick(val)}
                                >
                                    ₹{val}
                                </button>
                            ))}
                            <input
                                type="number"
                                placeholder="Custom"
                                className="custom-amount-input"
                                onChange={(e) => setAmount(Number(e.target.value))}
                            />
                        </div>
                    </div>

                    <div className="payment-methods">
                        <p className="label">Payment Method</p>
                        <div className="method-tabs">
                            <button
                                className={`method-tab ${method === 'upi' ? 'active' : ''}`}
                                onClick={() => setMethod('upi')}
                            >
                                <Smartphone size={20} /> UPI
                            </button>
                            <button
                                className={`method-tab ${method === 'card' ? 'active' : ''}`}
                                onClick={() => setMethod('card')}
                            >
                                <CreditCard size={20} /> Card
                            </button>
                            <button
                                className={`method-tab ${method === 'net' ? 'active' : ''}`}
                                onClick={() => setMethod('net')}
                            >
                                <Building size={20} /> NetBanking
                            </button>
                            <button
                                className={`method-tab ${method === 'wallet' ? 'active' : ''}`}
                                onClick={() => setMethod('wallet')}
                            >
                                <Wallet size={20} /> Wallet
                            </button>
                        </div>

                        <div className="method-content glass-card">
                            {method === 'upi' && (
                                <div className="upi-content">
                                    <div className="qr-placeholder">
                                        <span>QR Code</span>
                                    </div>
                                    <div className="upi-input-group">
                                        <label>Enter UPI ID</label>
                                        <input type="text" placeholder="username@okhdfc" />
                                        <button className="btn-verify">Verify</button>
                                    </div>
                                </div>
                            )}
                            {method === 'card' && (
                                <div className="card-form">
                                    <input type="text" placeholder="Card Number" className="full-width" />
                                    <div className="card-row">
                                        <input type="text" placeholder="MM/YY" />
                                        <input type="text" placeholder="CVV" />
                                    </div>
                                    <input type="text" placeholder="Cardholder Name" className="full-width" />
                                </div>
                            )}
                            {/* Add other placeholders if needed, keeping it simple for demo */}
                        </div>
                    </div>
                </div>

                <div className="payment-right">
                    <div className="summary-card glass-card">
                        <div className="summary-header">
                            <h3>Contribution Summary</h3>
                        </div>
                        <div className="summary-row">
                            <span>Selected Fund</span>
                            <span className="summary-val">Growth Funding</span>
                        </div>
                        <div className="summary-row">
                            <span>Startup</span>
                            <span className="summary-val highlight">TechNova AI Solutions</span>
                        </div>
                        <div className="summary-divider"></div>
                        <div className="summary-row">
                            <span>Amount</span>
                            <span className="summary-val">₹{amount}</span>
                        </div>
                        <div className="summary-row">
                            <span>Platform Fee (2%)</span>
                            <span className="summary-val">₹{(amount * 0.02).toFixed(2)}</span>
                        </div>
                        <div className="summary-divider"></div>
                        <div className="summary-total">
                            <span>Total Payable</span>
                            <span className="total-val">₹{(amount + amount * 0.02).toFixed(2)}</span>
                        </div>

                        <button className="btn btn-primary btn-pay">
                            Pay & Fund Now
                        </button>

                        <div className="trust-badge">
                            <ShieldCheck size={16} className="text-primary" />
                            <span>256-bit SSL Secured Payment</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PaymentSection;
