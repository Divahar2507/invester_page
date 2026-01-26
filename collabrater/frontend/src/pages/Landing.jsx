import React, { useState } from 'react';
import { ArrowRight, Globe, Shield, TrendingUp, CheckCircle, Mail, MapPin, Github, Twitter, Linkedin, Sun, Moon, Calendar, Users, Target, Layers, Rocket, CreditCard, MessageSquare, Quote, Star, Zap } from 'lucide-react';
import './Landing.css';

const Landing = () => {
    // State for theme, defaulting to 'dark'
    const [theme, setTheme] = useState('dark');

    // Toggle theme function
    const toggleTheme = () => {
        setTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark');
    };

    return (
        <div className="landing-container" data-theme={theme}>
            {/* Navbar */}
            <nav className="navbar">
                <div className="nav-brand">
                    <img src="/assets/company_logo.png" alt="INVESTOR" className="nav-logo" />
                    <span>INVESTOR</span>
                </div>
                <div className="nav-menu">
                    <a href="#about">About</a>
                    <a href="#services">Services</a>
                    <a href="#impact">Impact</a>
                    <a href="#contact">Contact</a>
                </div>
                <div className="nav-cta">
                    <button className="theme-toggle" onClick={toggleTheme} style={{ background: 'none', border: 'none', color: 'var(--text-main)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                        {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                    </button>
                    <button className="btn-primary">Consultation</button>
                    <div className="user-avatar"></div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-grid">
                    <div className="hero-text">
                        <div className="tag-pill">STRATEGIC CAPITAL PARTNERS</div>
                        <h1>Scalable Solutions for <br /> <span className="text-highlight">Modern Capital</span></h1>
                        <p>
                            "Innovation distinguishes between a leader and a follower." INVESTOR is the central nervous system for founders and investors, providing 360° deal flow management and strategic growth automation.
                        </p>

                        <div className="hero-buttons">
                            <button className="btn-primary">Get Started Today</button>
                            <button className="btn-secondary">View Case Studies</button>
                        </div>
                    </div>

                    <div className="hero-visual">
                        <div className="hero-image-container" style={{
                            backgroundImage: 'url("https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80")',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center'
                        }}>
                        </div>
                        <div className="floating-quote">
                            <p>"Efficiency is doing things right; effectiveness is doing the right things."</p>
                            <span>— Peter Drucker</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Growth Grid Section (NEW) */}
            <section id="impact" className="impact-grid-section">
                <div className="section-header center-aligned">
                    <span className="section-tag">PROJECT ECOSYSTEM</span>
                    <h2>The Gateway Growth Grid</h2>
                    <p>Every connection made here is backed by institutional-grade data and a global network of visionaries.</p>
                </div>

                <div className="infinite-grid">
                    {[
                        {
                            title: "Investor Matchmaking",
                            desc: "Our neural matching engine connects elite founders with precision capital, reducing the fundraising cycle by 3x.",
                            icon: <Target />,
                            stats: "92% Accuracy"
                        },
                        {
                            title: "LeadGen Engine",
                            desc: "Automated market analysis and B2B lead generation targeting high-intent prospects across 50+ sectors.",
                            icon: <Zap />,
                            stats: "15k+ Leads/Mo"
                        },
                        {
                            title: "Founders Hub",
                            desc: "A mission control center for building traction, managing pitches, and tracking real-time data metrics.",
                            icon: <Rocket />,
                            stats: "1.2k+ Founders"
                        }
                    ].map((item, i) => (
                        <div key={i} className="grid-item-card">
                            <div className="card-top">
                                <div className="card-icon-box">{item.icon}</div>
                                <div className="card-stat-pill">{item.stats}</div>
                            </div>
                            <h3>{item.title}</h3>
                            <p>{item.desc}</p>
                            <div className="card-footer">
                                <Quote size={14} className="q-icon" />
                                <span>"Impact starts with one connection."</span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="infinite-grid" style={{ marginTop: '2rem' }}>
                    {[
                        {
                            title: "Legal & Compliance",
                            desc: "Automated term sheets, NDAs, and MOU generation to ensure every deal is legally sound and lightning fast.",
                            icon: <Shield />,
                            stats: "Zero-Risk Flow"
                        },
                        {
                            title: "Community Events",
                            desc: "Host demo days and networking mixers with auto-lead capture and high-engagement RSVP protocols.",
                            icon: <Users />,
                            stats: "160+ Events"
                        },
                        {
                            title: "Growth Research",
                            desc: "In-depth market insights and sector-specific reports to help you navigate the ever-evolving capital landscape.",
                            icon: <BarChart3 />,
                            stats: "Data-Driven"
                        }
                    ].map((item, i) => (
                        <div key={i} className="grid-item-card">
                            <div className="card-top">
                                <div className="card-icon-box">{item.icon}</div>
                                <div className="card-stat-pill">{item.stats}</div>
                            </div>
                            <h3>{item.title}</h3>
                            <p>{item.desc}</p>
                            <div className="card-footer">
                                <Quote size={14} className="q-icon" />
                                <span>"Impact starts with one connection."</span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Stories Strip */}
            <section className="stories-strip">
                <div className="story-label">SUCCESS STORIES</div>
                <div className="marquee">
                    <div className="marquee-content">
                        <span>• AeroAI raised $5M in Seed •</span>
                        <span>• FinTech Pro closed 24 deals this quarter •</span>
                        <span>• CleanTech Hub generated 2,000+ leads •</span>
                        <span>• Global VC shortlisted 15 startups via Bridge •</span>
                        <span>• AeroAI raised $5M in Seed •</span>
                        <span>• FinTech Pro closed 24 deals this quarter •</span>
                    </div>
                </div>
            </section>

            {/* Service Pillars */}
            <section id="services" className="services-section">
                <div className="section-header">
                    <span className="section-tag">SERVICES</span>
                    <h2>Investor Solutions</h2>
                    <p>We provide the full stack of tools needed to manage the entire lifecycle of capital deployment and startup growth.</p>
                    <div className="underline"></div>
                </div>

                <div className="pillars-grid">
                    {/* ... (existing pillar cards remain same but I'll update their titles/descriptions in the full render) */}
                    <div className="pillar-card" onClick={() => window.open('http://localhost', '_blank')} style={{ cursor: 'pointer' }}>
                        <div className="pillar-image img-1"></div>
                        <div className="pillar-content">
                            <div className="icon-box"><Shield size={20} /></div>
                            <h3>Matchmaking Hub</h3>
                            <p>The definitive platform for pitching and deploying capital with algorithmic precision.</p>
                        </div>
                    </div>

                    <div className="pillar-card" onClick={() => window.open('http://localhost:3007', '_blank')} style={{ cursor: 'pointer' }}>
                        <div className="pillar-image img-startup"></div>
                        <div className="pillar-content">
                            <div className="icon-box"><Rocket size={20} /></div>
                            <h3>FounderDash</h3>
                            <p>The cockpit for startup founders to navigate growth, traction, and investor relations.</p>
                        </div>
                    </div>

                    <div className="pillar-card" onClick={() => window.open('http://localhost:3003', '_blank')} style={{ cursor: 'pointer' }}>
                        <div className="pillar-image img-3"></div>
                        <div className="pillar-content">
                            <div className="icon-box"><Globe size={20} /></div>
                            <h3>LeadGen Matrix</h3>
                            <p>Supercharge your prospecting with AI-driven market analysis and automated reach-out.</p>
                        </div>
                    </div>

                    <div className="pillar-card" onClick={() => window.open('http://localhost:3008', '_blank')} style={{ cursor: 'pointer' }}>
                        <div className="pillar-image img-collab"></div>
                        <div className="pillar-content">
                            <div className="icon-box"><Users size={20} /></div>
                            <h3>Innosphere Portal</h3>
                            <p>Institutional collaboration for team management, project oversight, and secure data rooms.</p>
                        </div>
                    </div>

                    <div className="pillar-card" onClick={() => window.open('http://localhost:3009', '_blank')} style={{ cursor: 'pointer' }}>
                        <div className="pillar-image img-funds"></div>
                        <div className="pillar-content">
                            <div className="icon-box"><CreditCard size={20} /></div>
                            <h3>Capital Flows</h3>
                            <p>Secure global fundraising portals including crowdfunding and debt-financing setups.</p>
                        </div>
                    </div>

                    <div className="pillar-card" onClick={() => window.open('http://localhost:3006', '_blank')} style={{ cursor: 'pointer' }}>
                        <div className="pillar-image img-2"></div>
                        <div className="pillar-content">
                            <div className="icon-box"><Calendar size={20} /></div>
                            <h3>Events & Network</h3>
                            <p>Connect with high-net-worth individuals and VCs through exclusive globally hosted events.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Open Source / Transparency */}
            <section className="transparency-section">
                <div className="wide-card">
                    <div className="card-left">
                        <div className="small-label"><Globe size={16} /> TRANSPARENCY & INNOVATION</div>
                        <h3>Commitment to Open Source</h3>
                        <p>Our proprietary lead-scoring frameworks are open-sourced to foster community growth and technical transparency in the B2B landscape.</p>
                    </div>
                    <div className="card-right">
                        <button className="btn-dark"><Github size={18} /> View on GitHub</button>
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section id="contact" className="contact-section">
                <div className="contact-grid">
                    <div className="contact-info">
                        <h2>Ready to <br /><span className="text-highlight">Scale Up?</span></h2>
                        <p>Partner with experts who prioritize ROI and measurable metrics. Reach out today for a discovery session with our consultants.</p>

                        <div className="contact-item">
                            <div className="icon-square"><Mail size={18} /></div>
                            <div>
                                <span className="label">EMAIL ADDRESS</span>
                                <h5>partners@connector.com</h5>
                            </div>
                        </div>

                        <div className="contact-item">
                            <div className="icon-square"><MapPin size={18} /></div>
                            <div>
                                <span className="label">MAIN OFFICE</span>
                                <h5>Business District, New York, NY</h5>
                            </div>
                        </div>
                    </div>

                    <div className="contact-form-card">
                        <div className="form-row">
                            <div className="form-group">
                                <label>NAME</label>
                                <input type="text" placeholder="John Doe" />
                            </div>
                            <div className="form-group">
                                <label>INDUSTRY</label>
                                <input type="text" placeholder="Tech / Finance" />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>EMAIL ADDRESS</label>
                            <input type="email" placeholder="john@enterprise.com" />
                        </div>

                        <div className="form-group">
                            <label>YOUR OBJECTIVE</label>
                            <textarea placeholder="Tell us about your growth goals..."></textarea>
                        </div>

                        <button className="btn-submit">Submit Inquiry</button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer-bar">
                <div className="footer-left">
                    <div className="brand-icon small"></div>
                    <span>INVESTOR</span>
                </div>
                <div className="footer-center">
                    <a href="#">Privacy Policy</a>
                    <a href="#">Terms & Conditions</a>
                    <a href="#">Compliance</a>
                    <a href="#">Careers</a>
                </div>
                <div className="footer-right">
                    <Linkedin size={20} />
                    <Twitter size={20} />
                </div>
            </footer>
        </div>
    );
};

export default Landing;
