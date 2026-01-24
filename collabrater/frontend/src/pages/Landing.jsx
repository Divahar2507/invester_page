import { ArrowRight, Globe, Shield, TrendingUp, CheckCircle, Mail, MapPin, Github, Twitter, Linkedin, Sun, Moon, Calendar, Users, Target, Layers, Rocket, CreditCard } from 'lucide-react';
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
                    <div className="brand-icon"></div>
                    <span>CONNECTOR</span>
                </div>
                <div className="nav-menu">
                    <a href="#about">About</a>
                    <a href="#services">Services</a>
                    <a href="#performance">Performance</a>
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
                        <p>Empowering founders and investors through bespoke deal flow management, strategic diligence, and high-precision matchmaking.</p>

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
                            {/* Image loaded via CSS background */}
                        </div>
                        <div className="floating-quote">
                            <p>"Efficiency is doing things right; effectiveness is doing the right things."</p>
                            <span>— Peter Drucker</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="stats-section">
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-icon blue-icon"><TrendingUp size={20} /> REVENUE IMPACT</div>
                        <h3>$120M+</h3>
                        <p className="positive">↗ +45% YoY Growth</p>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon blue-icon"><CheckCircle size={20} /> DEALS CLOSED</div>
                        <h3>500+</h3>
                        <p className="positive">◎ 98.4% Client Satisfaction</p>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon blue-icon"><Globe size={20} /> LEAD CONVERSION</div>
                        <h3>15k+</h3>
                        <p className="positive">⚡ +66% Acquisition Rate</p>
                    </div>
                </div>
            </section>

            {/* About / Summary Section */}
            <section id="about" className="about-section">
                <div className="about-container">
                    <div className="section-header center-aligned">
                        <span className="section-tag">WHO WE ARE</span>
                        <h2>The Central Nervous System <br /> of Innovation</h2>
                        <div className="underline center-line"></div>
                    </div>

                    <div className="about-content-grid">
                        <div className="about-text">
                            <h3>Bridging the Gap</h3>
                            <p>
                                Connector is more than just a platform; it's the bridge between high-potential ventures and institutional capital.
                                In a fragmented market, we provide the infrastructure that allows innovation to scale efficiently.
                            </p>
                            <p>
                                By leveraging AI-driven data intelligence and human-centric relationship building, we ensure that every connection
                                made on our platform has the highest probability of mutual success.
                            </p>
                            <ul className="about-list">
                                <li><CheckCircle size={16} className="list-icon" /> Curated Deal Flow</li>
                                <li><CheckCircle size={16} className="list-icon" /> Institutional-Grade Diligence</li>
                                <li><CheckCircle size={16} className="list-icon" /> Secure Data Rooms</li>
                            </ul>
                        </div>
                        <div className="about-visual">
                            <div className="visual-card">
                                <Target size={32} className="visual-icon" />
                                <h4>Precision Matching</h4>
                                <p>Our algorithm matches you with partners that align with your thesis.</p>
                            </div>
                            <div className="visual-card">
                                <Layers size={32} className="visual-icon" />
                                <h4>Full-Stack Integration</h4>
                                <p>From document prep to final close, we handle the workflow.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Service Pillars */}
            <section id="services" className="services-section">
                <div className="section-header">
                    <span className="section-tag">CORE EXPERTISE</span>
                    <h2>Our Service Pillars</h2>
                    <div className="underline"></div>
                </div>

                <div className="pillars-grid">
                    {/* 1. Investor Platform */}
                    <div className="pillar-card" onClick={() => window.open('http://localhost', '_blank')} style={{ cursor: 'pointer' }}>
                        <div className="pillar-image img-1"></div>
                        <div className="pillar-content">
                            <div className="icon-box"><Shield size={20} /></div>
                            <h3>Investor & Startup</h3>
                            <p>Unified platform for pitching ideas, finding investors, and managing portfolios.</p>
                        </div>
                    </div>

                    {/* 2. FounderDash (NEW) */}
                    <div className="pillar-card" onClick={() => window.open('http://localhost:3007', '_blank')} style={{ cursor: 'pointer' }}>
                        <div className="pillar-image img-startup"></div>
                        <div className="pillar-content">
                            <div className="icon-box"><Rocket size={20} /></div>
                            <h3>FounderDash</h3>
                            <p>Comprehensive command center for startup founders to tracking growth and metrics.</p>
                        </div>
                    </div>

                    {/* 3. LeadGen */}
                    <div className="pillar-card" onClick={() => window.open('http://localhost:3003', '_blank')} style={{ cursor: 'pointer' }}>
                        <div className="pillar-image img-3"></div>
                        <div className="pillar-content">
                            <div className="icon-box"><Globe size={20} /></div>
                            <h3>LeadGen Engine</h3>
                            <p>AI-powered lead generation and marketing automation tools.</p>
                        </div>
                    </div>

                    {/* 4. Innosphere (NEW) */}
                    <div className="pillar-card" onClick={() => window.open('http://localhost:3008', '_blank')} style={{ cursor: 'pointer' }}>
                        <div className="pillar-image img-collab"></div>
                        <div className="pillar-content">
                            <div className="icon-box"><Users size={20} /></div>
                            <h3>Innosphere Admin</h3>
                            <p>Centralized portal for team collaboration and project oversight.</p>
                        </div>
                    </div>

                    {/* 5. Funds Collection (NEW) */}
                    <div className="pillar-card" onClick={() => window.open('http://localhost:3009', '_blank')} style={{ cursor: 'pointer' }}>
                        <div className="pillar-image img-funds"></div>
                        <div className="pillar-content">
                            <div className="icon-box"><CreditCard size={20} /></div>
                            <h3>Funds Collection</h3>
                            <p>Secure payment processing and automated capital flow management.</p>
                        </div>
                    </div>

                    {/* 6. Events */}
                    <div className="pillar-card" onClick={() => window.open('http://localhost:3006', '_blank')} style={{ cursor: 'pointer' }}>
                        <div className="pillar-image img-2"></div>
                        <div className="pillar-content">
                            <div className="icon-box"><Calendar size={20} /></div>
                            <h3>Community & Events</h3>
                            <p>Exclusive access to demo days, roundtables, and networking mixers.</p>
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
                    <span>CONNECTOR</span>
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
