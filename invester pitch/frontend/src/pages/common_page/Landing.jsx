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
                        INVESTOR
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

            <header className="ic-hero">
                <div className="ic-badge">
                    <Zap size={14} />
                    <span>THE DEPLOYMENT SOVEREIGN LAYER</span>
                </div>
                <h1 className="ic-hero-title">High-Conviction <br />Capital Allocation.</h1>
                <p className="ic-hero-sub">
                    The institutional gateway where elite founders and strategic partners align with technical precision. Engineered for zero-noise deal flow.
                </p>
                <div style={{ display: 'flex', gap: 20, justifyContent: 'center' }}>
                    <Link to="/register/startup" className="btn-start" style={{ padding: '20px 48px', fontSize: '16px' }}>Connect as Founder</Link>
                    <Link to="/register/investor" className="btn-login" style={{ padding: '20px 48px', fontSize: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: '16px', opacity: 1 }}>Enter as Partner</Link>
                </div>
            </header>

            <div className="ic-marquee">
                <div className="ic-m-scroll">
                    {[1, 2].map(idx => (
                        <React.Fragment key={idx}>
                            <span className="ic-m-item"><div className="ic-m-dot" /> AEROAI RAISED $5M IN SEED ROUND</span>
                            <span className="ic-m-item"><div className="ic-m-dot" /> FINTECH PRO CLOSED 24 DEALS VIA NETWORK</span>
                            <span className="ic-m-item"><div className="ic-m-dot" /> CLEANTECH HUB GENERATED 2.5K+ LEADS</span>
                            <span className="ic-m-item"><div className="ic-m-dot" /> NEXUS VENTURES ALLOCATED $12M TO HEALTH-CORE</span>
                            <span className="ic-m-item"><div className="ic-m-dot" /> GLOBAL VC SHORTLISTED 15 STARTUPS</span>
                        </React.Fragment>
                    ))}
                </div>
            </div>

            <section className="ic-grid">
                <div className="ic-card">
                    <div className="ic-card-icon"><Rocket size={32} /></div>
                    <h3 className="ic-card-title">Institutional <br />Founders</h3>
                    <p className="ic-card-p">
                        Scale beyond cold pitching. Our architecture ensures your vision lands directly on the terminals of strategic partners ready to deploy.
                    </p>
                    <Link to="/register/startup" className="btn-card btn-c-white">Submit Pitch <ArrowRight size={18} /></Link>
                </div>

                <div className="ic-card">
                    <div className="ic-card-icon" style={{ color: '#60a5fa' }}><TrendingUp size={32} /></div>
                    <h3 className="ic-card-title">Strategic <br />Capital</h3>
                    <p className="ic-card-p">
                        Access a sovereign stream of verified projects and high-conviction founders scaling with mathematical precision.
                    </p>
                    <Link to="/register/investor" className="btn-card btn-c-primary">Open Terminal <ArrowUpRight size={18} /></Link>
                </div>
            </section>

            <section id="matrix" className="ic-matrix">
                <div className="ic-matrix-inner">
                    <div className="ic-badge">SYSTEM PROTOCOLS</div>
                    <h2 style={{ fontSize: '48px', marginBottom: '24px' }}>The Core Gateway Grid</h2>
                    <p style={{ maxWidth: '600px', margin: '0 auto' }}>Every connection made within the ecosystem is backed by institutional-grade intelligence and a global network of visionaries.</p>

                    <div className="ic-m-grid">
                        {[
                            { title: "Precision Matchmaking", icon: <Target size={32} />, p: "Our neural engine connects elite founders with specific capital sources, reducing the average fundraise cycle by 65%.", q: "Strategic alignment is the ultimate multiplier." },
                            { title: "LeadGen Matrix", icon: <Zap size={32} />, p: "Automated market analysis and B2B lead generation targeting high-intent prospects across 50+ institutional sectors.", q: "Data doesn't just inform; it executes." },
                            { title: "Founders Domain", icon: <Rocket size={32} />, p: "A mission control center for building traction, managing pitches, and tracking real-time growth metrics in dark mode.", q: "Success is the byproduct of discipline." },
                            { title: "Protocol Governance", icon: <ShieldCheck size={32} />, p: "Automated term sheets, NDAs, and MOU generation to ensure every deal is legally sound and lightning fast.", q: "Speed is the only non-negotiable." },
                            { title: "Network Liquidity", icon: <Users size={32} />, p: "Host exclusive demo days and networking mixers with auto-lead capture and high-engagement rsvp architecture.", q: "Network is the only true moats." },
                            { title: "Intelligence Edge", icon: <BarChart3 size={32} />, p: "In-depth market insights and sector-specific reports to help you navigate the ever-evolving capital landscape.", q: "Information is the currency of power." }
                        ].map((item, i) => (
                            <div key={i} className="ic-m-card">
                                <div className="ic-m-card-icon">{item.icon}</div>
                                <h3 className="ic-m-card-h3">{item.title}</h3>
                                <p className="ic-m-card-p">{item.p}</p>
                                <div className="ic-m-quote">
                                    <Quote size={12} style={{ opacity: 0.5 }} />
                                    <span>{item.q}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="ic-cases" style={{ padding: '120px 40px', maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{ textAlign: 'left', marginBottom: '60px' }}>
                    <div className="ic-badge">CASE STUDIES</div>
                    <h2 style={{ fontSize: '48px' }}>Institutional Success.</h2>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                    <div className="ic-card" style={{ padding: '48px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '32px' }}>
                            <div style={{ background: 'rgba(59,130,246,0.1)', padding: '12px', borderRadius: '12px', color: 'var(--brand-blue)' }}>
                                <TrendingUp size={24} />
                            </div>
                            <span style={{ fontSize: '11px', fontWeight: 900, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em' }}>SERIES A EXECUTED</span>
                        </div>
                        <h4 style={{ fontSize: '24px', marginBottom: '16px' }}>Project AeroAI</h4>
                        <p style={{ fontSize: '14px', lineHeight: 1.6, marginBottom: '24px' }}>How a specialized AI startup used the Protocol to identify and close a $5.2M round in under 45 days with strategic partners in the EU market.</p>
                        <div style={{ display: 'flex', gap: '40px' }}>
                            <div>
                                <div style={{ fontSize: '20px', fontWeight: 900, color: 'white' }}>$5.2M</div>
                                <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', fontWeight: 700 }}>FUNDING RAISED</div>
                            </div>
                            <div>
                                <div style={{ fontSize: '20px', fontWeight: 900, color: 'white' }}>45 Days</div>
                                <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', fontWeight: 700 }}>CLOSE TIME</div>
                            </div>
                        </div>
                    </div>
                    <div className="ic-card" style={{ padding: '48px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '32px' }}>
                            <div style={{ background: 'rgba(16,185,129,0.1)', padding: '12px', borderRadius: '12px', color: '#10b981' }}>
                                <Zap size={24} />
                            </div>
                            <span style={{ fontSize: '11px', fontWeight: 900, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em' }}>MARKET EXPANSION</span>
                        </div>
                        <h4 style={{ fontSize: '24px', marginBottom: '16px' }}>FinTech Core</h4>
                        <p style={{ fontSize: '14px', lineHeight: 1.6, marginBottom: '24px' }}>Leveraging the LeadGen Matrix to generate 2,500+ high-conviction institutional leads, resulting in a 40% uptick in enterprise partnerships.</p>
                        <div style={{ display: 'flex', gap: '40px' }}>
                            <div>
                                <div style={{ fontSize: '20px', fontWeight: 900, color: 'white' }}>2.5k+</div>
                                <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', fontWeight: 700 }}>DATA LEADS</div>
                            </div>
                            <div>
                                <div style={{ fontSize: '20px', fontWeight: 900, color: 'white' }}>+40%</div>
                                <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', fontWeight: 700 }}>REVENUE GROWTH</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section id="services" className="ic-pillar-sec">
                <style>{`
                    .ic-deep-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1px; background: var(--border); border: 1px solid var(--border); border-radius: 24px; overflow: hidden; margin-top: 60px; }
                    .ic-deep-item { background: var(--bg-black); padding: 40px; transition: 0.3s; }
                    .ic-deep-item:hover { background: rgba(255,255,255,0.02); }
                    .ic-deep-item h5 { font-size: 14px; color: var(--brand-blue); margin-bottom: 20px; text-transform: uppercase; letter-spacing: 0.1em; }
                    .ic-deep-item ul { list-style: none; padding: 0; margin: 0; }
                    .ic-deep-item li { font-size: 13px; color: var(--text-main); margin-bottom: 12px; display: flex; align-items: center; gap: 8px; }
                    .ic-deep-item li::before { content: ''; width: 4px; height: 4px; background: var(--brand-blue); border-radius: 50%; }
                `}</style>
                <div style={{ textAlign: 'center', marginBottom: '80px' }}>
                    <div className="ic-badge">TECHNICAL INFRASTRUCTURE</div>
                    <h2 style={{ fontSize: '48px' }}>Service Deep Dive</h2>
                </div>

                <div className="ic-deep-grid" style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <div className="ic-deep-item">
                        <h5>Network Protocl</h5>
                        <ul>
                            <li>Private Deal Rooms</li>
                            <li>Investor Relations CRM</li>
                            <li>Automated Intros</li>
                            <li>Verified Identity</li>
                        </ul>
                    </div>
                    <div className="ic-deep-item">
                        <h5>Capital Protocol</h5>
                        <ul>
                            <li>Cap Table Management</li>
                            <li>Crowdfund Engine</li>
                            <li>Debt Orchestration</li>
                            <li>Liquidity Tracking</li>
                        </ul>
                    </div>
                    <div className="ic-deep-item">
                        <h5>Legal Protocol</h5>
                        <ul>
                            <li>Smart Term Sheets</li>
                            <li>e-Signature Node</li>
                            <li>KYC/AML Vault</li>
                            <li>MOU Automation</li>
                        </ul>
                    </div>
                    <div className="ic-deep-item">
                        <h5>Intel Protocol</h5>
                        <ul>
                            <li>Sentiment Analysis</li>
                            <li>Market Heatmaps</li>
                            <li>Growth Benchmarking</li>
                            <li>Competitor Nodes</li>
                        </ul>
                    </div>
                </div>

                <div className="ic-p-grid">
                    <div className="ic-pillar" onClick={() => window.open('http://localhost:3009', '_blank')}>
                        <div className="ic-p-img" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1554224155-169641357599?auto=format&fit=crop&w=1200&q=80)' }}></div>
                        <div className="ic-p-content">
                            <h3 style={{ fontSize: '28px', marginBottom: '16px' }}>Capital Flows</h3>
                            <p style={{ lineHeight: 1.6 }}>The definitive high-security fundraising portal for crowdfunding and institutional debt financing setups.</p>
                            <div style={{ marginTop: '24px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--brand-blue)', fontWeight: 800, fontSize: '13px', textTransform: 'uppercase' }}>
                                View Portal <ArrowUpRight size={14} />
                            </div>
                        </div>
                    </div>
                    <div className="ic-pillar" onClick={() => window.open('http://localhost:3006', '_blank')}>
                        <div className="ic-p-img" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=1200&q=80)' }}></div>
                        <div className="ic-p-content">
                            <h3 style={{ fontSize: '28px', marginBottom: '16px' }}>Network Ops</h3>
                            <p style={{ lineHeight: 1.6 }}>Super-connect with verified HNWIs and venture partners through exclusive globally-hosted private events.</p>
                            <div style={{ marginTop: '24px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--brand-blue)', fontWeight: 800, fontSize: '13px', textTransform: 'uppercase' }}>
                                Access Calendar <ArrowUpRight size={14} />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section id="vision" className="ic-vision">
                <Quote size={60} style={{ color: 'var(--brand-blue)', opacity: 0.1, marginBottom: '20px' }} />
                <p className="ic-v-quote">
                    "Innovation distinguishes between a leader and a follower. Our mission is to build the central nervous system for modern capital."
                </p>
                <div className="ic-v-author">— SYSTEM CORE ARCHITECTURE</div>
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
