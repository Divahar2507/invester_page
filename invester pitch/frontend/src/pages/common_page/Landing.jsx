import * as React from 'react';
import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
    ArrowRight,
    TrendingUp,
    Rocket,
    CheckCircle2,
    DollarSign,
    Lock,
    Network,
    ArrowUpRight,
    ShieldCheck,
    BarChart3,
    MessageSquare,
    Users,
    Zap,
    Globe,
    Layers,
    Search,
    Quote,
    Target,
    Shield,
    Star,
    Calendar,
    CreditCard,
    Linkedin,
    Twitter
} from 'lucide-react';

const Landing = () => {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="ic-landing-root">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
                
                :root {
                    --bg-black: #050505;
                    --text-main: #94a3b8;
                    --text-white: #ffffff;
                    --brand-blue: #3b82f6;
                    --glass: rgba(255, 255, 255, 0.02);
                    --border: rgba(255, 255, 255, 0.08);
                }

                .ic-landing-root {
                    background-color: var(--bg-black);
                    color: var(--text-main);
                    font-family: 'Plus Jakarta Sans', sans-serif;
                    min-height: 100vh;
                    overflow-x: hidden;
                    margin: 0;
                    padding: 0;
                    -webkit-font-smoothing: antialiased;
                }

                h1, h2, h3, h4 { margin: 0; font-weight: 900; letter-spacing: -0.04em; color: white; }

                /* NAVIGATION */
                .ic-nav {
                    position: fixed; top: 0; left: 0; right: 0; z-index: 1000;
                    height: 80px; display: flex; align-items: center; justify-content: center;
                    transition: 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                }
                .ic-nav.scrolled {
                    background: rgba(5, 5, 5, 0.8);
                    backdrop-filter: blur(20px);
                    border-bottom: 1px solid var(--border);
                    height: 70px;
                }
                .ic-nav-inner {
                    width: 100%; max-width: 1300px; padding: 0 40px;
                    display: flex; align-items: center; justify-content: space-between;
                }
                .ic-logo {
                    display: flex; align-items: center; gap: 10px; text-decoration: none; color: white;
                    font-weight: 900; font-size: 18px; letter-spacing: -0.04em; font-style: italic;
                }
                .ic-logo-dot { width: 8px; height: 8px; background: var(--brand-blue); border-radius: 50%; box-shadow: 0 0 10px var(--brand-blue); }

                .ic-nav-links { display: flex; gap: 40px; }
                .ic-nav-link { color: var(--text-main); text-decoration: none; font-size: 14px; font-weight: 500; transition: 0.3s; }
                .ic-nav-link:hover { color: white; }

                .ic-nav-cta { display: flex; align-items: center; gap: 24px; }
                .btn-login { text-decoration: none; color: white; font-size: 14px; font-weight: 600; opacity: 0.7; transition: 0.2s; }
                .btn-login:hover { opacity: 1; }
                .btn-start {
                    background: white; color: black; padding: 12px 24px; border-radius: 12px;
                    text-decoration: none; font-size: 14px; font-weight: 700; transition: 0.3s;
                }
                .btn-start:hover { transform: translateY(-2px); box-shadow: 0 10px 20px rgba(255,255,255,0.1); }

                /* HERO */
                .ic-hero {
                    padding: 200px 20px 140px; text-align: center; position: relative;
                    max-width: 1100px; margin: 0 auto;
                }
                .ic-badge {
                    display: inline-flex; align-items: center; gap: 8px;
                    background: rgba(59, 130, 246, 0.05); border: 1px solid rgba(59, 130, 246, 0.2);
                    padding: 8px 16px; border-radius: 100px; margin-bottom: 40px;
                    font-size: 12px; font-weight: 700; color: var(--brand-blue);
                }
                .ic-hero-title {
                    font-size: clamp(32px, 6vw, 72px); line-height: 1.05; margin-bottom: 32px;
                    background: linear-gradient(180deg, #FFFFFF 0%, rgba(255, 255, 255, 0.6) 100%);
                    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
                }
                .ic-hero-sub {
                    font-size: 20px; color: var(--text-main); max-width: 650px; margin: 0 auto 56px; line-height: 1.6;
                }

                /* MARQUEE */
                .ic-marquee {
                    background: var(--glass); border-top: 1px solid var(--border); border-bottom: 1px solid var(--border);
                    padding: 20px 0; overflow: hidden; white-space: nowrap; margin-bottom: 100px;
                }
                .ic-m-scroll {
                    display: inline-block; animation: marquee 30s linear infinite;
                }
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .ic-m-item {
                    display: inline-flex; align-items: center; gap: 12px;
                    margin: 0 40px; color: white; font-weight: 700; font-size: 14px;
                }
                .ic-m-dot { width: 6px; height: 6px; background: var(--brand-blue); border-radius: 50%; opacity: 0.5; }

                /* GRID CARDS */
                .ic-grid {
                    max-width: 1200px; margin: 0 auto 100px; display: grid; grid-template-columns: 1fr 1fr; gap: 32px;
                    padding: 0 40px;
                }
                @media (max-width: 900px) { .ic-grid { grid-template-columns: 1fr; } }
                .ic-card {
                    background: var(--glass); border: 1px solid var(--border);
                    border-radius: 32px; padding: 60px; text-align: left; transition: 0.4s;
                    position: relative; overflow: hidden;
                }
                .ic-card:hover { border-color: var(--brand-blue); transform: translateY(-8px); }
                .ic-card-icon { width: 56px; height: 56px; background: rgba(59, 130, 246, 0.1); border-radius: 16px; display: flex; align-items: center; justify-content: center; color: var(--brand-blue); margin-bottom: 40px; }
                .ic-card-title { font-size: 36px; margin-bottom: 24px; }
                .ic-card-p { font-size: 16px; line-height: 1.7; color: var(--text-main); margin-bottom: 40px; }
                
                /* MATRIX SECTION */
                .ic-matrix { padding: 120px 40px; background: linear-gradient(180deg, transparent, rgba(37,99,235,0.03) 50%, transparent); }
                .ic-matrix-inner { max-width: 1200px; margin: 0 auto; text-align: center; }
                .ic-m-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; margin-top: 80px; }
                @media (max-width: 1000px) { .ic-m-grid { grid-template-columns: repeat(2, 1fr); } }
                @media (max-width: 700px) { .ic-m-grid { grid-template-columns: 1fr; } }
                
                .ic-m-card {
                    background: var(--glass); border: 1px solid var(--border); border-radius: 24px;
                    padding: 40px; text-align: left; transition: 0.3s; display: flex; flex-direction: column;
                }
                .ic-m-card:hover { border-color: rgba(255,255,255,0.2); background: rgba(255,255,255,0.03); }
                .ic-m-card-icon { color: var(--brand-blue); margin-bottom: 24px; }
                .ic-m-card-h3 { font-size: 20px; margin-bottom: 12px; }
                .ic-m-card-p { font-size: 14px; line-height: 1.6; flex: 1; margin-bottom: 24px; }
                .ic-m-quote { border-top: 1px solid var(--border); padding-top: 20px; display: flex; align-items: flex-start; gap: 10px; font-size: 12px; font-style: italic; color: #64748b; }

                /* PILLARS */
                .ic-pillar-sec { padding: 120px 40px; }
                .ic-p-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 40px; max-width: 1200px; margin: 80px auto 0; }
                @media (max-width: 900px) { .ic-p-grid { grid-template-columns: 1fr; } }
                .ic-pillar {
                    border-radius: 40px; overflow: hidden; background: var(--glass); border: 1px solid var(--border);
                    display: flex; flex-direction: column; cursor: pointer; transition: 0.4s;
                }
                .ic-pillar:hover { transform: scale(1.02); border-color: var(--brand-blue); }
                .ic-p-img { height: 300px; background-size: cover; background-position: center; filter: grayscale(1) brightness(0.7); transition: 0.4s; }
                .ic-pillar:hover .ic-p-img { filter: grayscale(0) brightness(1); }
                .ic-p-content { padding: 40px; }

                /* QUOTES */
                .ic-vision { padding: 140px 40px; text-align: center; max-width: 800px; margin: 0 auto; }
                .ic-v-quote { font-size: 32px; font-weight: 700; color: white; line-height: 1.4; margin-bottom: 40px; position: relative; }
                .ic-v-quote::before { content: '“'; position: absolute; left: -50px; top: -20px; font-size: 120px; opacity: 0.1; color: var(--brand-blue); }
                .ic-v-author { font-size: 14px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.2em; color: var(--brand-blue); }

                /* FOOTER */
                .ic-footer { padding: 100px 40px 60px; border-top: 1px solid var(--border); background: #000; }
                .ic-f-inner { max-width: 1200px; margin: 0 auto; display: flex; justify-content: space-between; }
                @media (max-width: 800px) { .ic-f-inner { flex-direction: column; gap: 60px; } }
                .ic-f-copy { margin-top: 80px; padding-top: 40px; border-top: 1px solid var(--border); display: flex; justify-content: space-between; font-size: 11px; color: #444; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; }
            `}</style>

            <nav className={`ic-nav ${isScrolled ? 'scrolled' : ''}`}>
                <div className="ic-nav-inner">
                    <Link to="/" className="ic-logo">
                        <div className="ic-logo-dot" />
                        INVESTOR CONNECT
                    </Link>
                    <div className="ic-nav-links">
                        <a href="#matrix" className="ic-nav-link">Protocols</a>
                        <a href="#services" className="ic-nav-link">Ecosystem</a>
                        <a href="#vision" className="ic-nav-link">Vision</a>
                    </div>
                    <div className="ic-nav-cta">
                        <Link to="/login" className="btn-login">Terminal Access</Link>
                        <Link to="/register" className="btn-start">Join Network</Link>
                    </div>
                </div>
            </nav>

            <div style={{ height: '140px' }} /> {/* Spacer for fixed nav */}

            <section id="portals" className="ic-grid" style={{ marginTop: '0' }}>
                <div className="ic-card" style={{ '--accent': '#8957e5' }}>
                    <div className="ic-card-icon" style={{ background: 'rgba(137, 87, 229, 0.1)', color: '#8957e5' }}><Rocket size={32} /></div>
                    <span style={{ color: '#8957e5', fontSize: 10, fontWeight: 900, letterSpacing: '0.3em', marginBottom: 12, display: 'block' }}>FOUNDER OPS</span>
                    <h3 className="ic-card-title">Startup <br />Portal</h3>
                    <p className="ic-card-p">
                        Premium infrastructure designed to empower founders. Build your pitch, connect with verified investors, and manage your venture growth from seed to liquidity.
                    </p>
                    <div style={{ marginBottom: 40 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'white', fontSize: 13, marginBottom: 12, fontWeight: 500 }}>
                            <CheckCircle2 size={16} color="#8957e5" /> Advanced Pitch Builder
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'white', fontSize: 13, marginBottom: 12, fontWeight: 500 }}>
                            <CheckCircle2 size={16} color="#8957e5" /> Investor Matchmaking
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'white', fontSize: 13, marginBottom: 12, fontWeight: 500 }}>
                            <CheckCircle2 size={16} color="#8957e5" /> Unified Messaging Hub
                        </div>
                    </div>
                    <Link to="/register/startup" className="btn-start" style={{ background: 'linear-gradient(135deg, #8957e5 0%, #f62d8f 100%)', color: 'white', display: 'flex', justifyContent: 'center', gap: 10 }}>
                        Initialize Startup Gate <ArrowRight size={18} />
                    </Link>
                </div>

                <div className="ic-card" style={{ '--accent': '#3b82f6' }}>
                    <div className="ic-card-icon"><TrendingUp size={32} /></div>
                    <span style={{ color: '#3b82f6', fontSize: 10, fontWeight: 900, letterSpacing: '0.3em', marginBottom: 12, display: 'block' }}>CAPITAL INTEL</span>
                    <h3 className="ic-card-title">Investor <br />Portal</h3>
                    <p className="ic-card-p">
                        Access a sovereign stream of high-conviction deal flow. Discover verified pitches, manage your portfolio, and export institutional reports.
                    </p>
                    <div style={{ marginBottom: 40 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'white', fontSize: 13, marginBottom: 12, fontWeight: 500 }}>
                            <CheckCircle2 size={16} color="#3b82f6" /> Dynamic Pitch Discovery
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'white', fontSize: 13, marginBottom: 12, fontWeight: 500 }}>
                            <CheckCircle2 size={16} color="#3b82f6" /> Portfolio Intelligence
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'white', fontSize: 13, marginBottom: 12, fontWeight: 500 }}>
                            <CheckCircle2 size={16} color="#3b82f6" /> Institutional Reporting
                        </div>
                    </div>
                    <Link to="/register/investor" className="btn-start" style={{ background: 'linear-gradient(135deg, #2f81f7 0%, #17cf97 100%)', color: 'white', display: 'flex', justifyContent: 'center', gap: 10 }}>
                        Enter Partner Terminal <ArrowUpRight size={18} />
                    </Link>
                </div>
            </section>



            <footer className="ic-footer">
                <div className="ic-f-inner">
                    <div style={{ textAlign: 'left' }}>
                        <div className="ic-logo" style={{ marginBottom: 24 }}>
                            <div className="ic-logo-dot" />
                            <span style={{ fontSize: 24, fontWeight: 900, letterSpacing: '-0.04em', fontStyle: 'italic' }}>INVESTOR</span>
                        </div>
                        <p style={{ maxWidth: 400, fontSize: '14px', lineHeight: 1.7 }}>Building the global sovereign protocol for high-conviction venture deployment and ecosystem growth.</p>
                    </div>
                    <div style={{ display: 'flex', gap: 80 }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                            <h4 style={{ color: 'white', fontSize: 11, textTransform: 'uppercase', marginBottom: 10, letterSpacing: '0.1em' }}>Protocols</h4>
                            <a href="#" style={{ color: 'var(--text-main)', textDecoration: 'none', fontSize: 13, fontWeight: 600 }}>Network</a>
                            <a href="#" style={{ color: 'var(--text-main)', textDecoration: 'none', fontSize: 13, fontWeight: 600 }}>Capital</a>
                            <a href="#" style={{ color: 'var(--text-main)', textDecoration: 'none', fontSize: 13, fontWeight: 600 }}>Compliance</a>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                            <h4 style={{ color: 'white', fontSize: 11, textTransform: 'uppercase', marginBottom: 10, letterSpacing: '0.1em' }}>Access</h4>
                            <a href="#" style={{ color: 'var(--text-main)', textDecoration: 'none', fontSize: 13, fontWeight: 600 }}>Terminal</a>
                            <a href="#" style={{ color: 'var(--text-main)', textDecoration: 'none', fontSize: 13, fontWeight: 600 }}>Founders</a>
                            <a href="#" style={{ color: 'var(--text-main)', textDecoration: 'none', fontSize: 13, fontWeight: 600 }}>Research</a>
                        </div>
                    </div>
                </div>
                <div className="ic-f-copy">
                    <span>© 2026 INVESTOR GLOBAL ARCHITECTURE GRP.</span>
                    <div style={{ display: 'flex', gap: 24 }}>
                        <span>ALL SYSTEMS OPERATIONAL // v4.2.0</span>
                        <div style={{ display: 'flex', gap: 16 }}>
                            <Linkedin size={14} style={{ opacity: 0.5 }} />
                            <Twitter size={14} style={{ opacity: 0.5 }} />
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Landing;
