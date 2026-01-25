import React, { useState, useEffect } from 'react';
import {
  ArrowRight,
  ChevronRight,
  Shield,
  Zap,
  Network,
  Globe,
  Terminal,
  Activity,
  Briefcase,
  Users,
  Search,
  PieChart,
  Link as LinkIcon
} from 'lucide-react';

const LandingPage = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="conn-root">
      <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
                
                :root {
                    --bg: #050505;
                    --fg: #ffffff;
                    --slate: #94a3b8;
                    --brand: #3b82f6;
                    --brand-glow: rgba(59, 130, 246, 0.15);
                    --border: rgba(255, 255, 255, 0.08);
                    --glass: rgba(255, 255, 255, 0.02);
                }

                * { box-sizing: border-box; }

                .conn-root {
                    background-color: var(--bg);
                    color: var(--fg);
                    font-family: 'Plus Jakarta Sans', sans-serif;
                    min-height: 100vh;
                    overflow-x: hidden;
                    -webkit-font-smoothing: antialiased;
                    margin: 0;
                    padding: 0;
                }

                h1, h2, h3 { margin: 0; font-weight: 800; letter-spacing: -0.02em; }
                p { margin: 0; line-height: 1.6; color: var(--slate); }

                /* NAVIGATION */
                .conn-nav {
                    position: fixed; top: 0; left: 0; right: 0; z-index: 1000;
                    height: 80px; display: flex; align-items: center; justify-content: center;
                    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                }
                .conn-nav.scrolled {
                    background: rgba(5, 5, 5, 0.8);
                    backdrop-filter: blur(20px);
                    border-bottom: 1px solid var(--border);
                    height: 70px;
                }
                .conn-nav-inner {
                    width: 100%; max-width: 1300px; padding: 0 40px;
                    display: flex; align-items: center; justify-content: space-between;
                }
                .conn-logo {
                    display: flex; align-items: center; gap: 10px; text-decoration: none; color: var(--fg);
                    font-weight: 800; font-size: 18px; letter-spacing: -0.01em;
                }
                .conn-logo-dot { width: 8px; height: 8px; background: var(--brand); border-radius: 50%; box-shadow: 0 0 10px var(--brand); }
                
                .conn-nav-links { display: flex; gap: 40px; }
                .conn-nav-link { color: var(--slate); text-decoration: none; font-size: 14px; font-weight: 500; transition: 0.3s; }
                .conn-nav-link:hover { color: var(--fg); }
                
                .btn-login { font-size: 14px; font-weight: 600; color: var(--fg); text-decoration: none; margin-right: 24px; opacity: 0.7; transition: 0.2s; }
                .btn-login:hover { opacity: 1; }
                .btn-get-started {
                    background: var(--fg); color: var(--bg); padding: 12px 24px; border-radius: 12px;
                    font-size: 14px; font-weight: 700; text-decoration: none; transition: 0.3s cubic-bezier(0.16, 1, 0.3, 1);
                }
                .btn-get-started:hover { transform: translateY(-2px); box-shadow: 0 10px 20px rgba(255,255,255,0.1); }

                /* HERO SECTION */
                .conn-hero {
                    position: relative; padding: 200px 20px 140px; text-align: center;
                    max-width: 1100px; margin: 0 auto;
                }
                .conn-hero-glow {
                    position: absolute; top: 10%; left: 50%; transform: translateX(-50%);
                    width: 600px; height: 300px; background: var(--brand);
                    filter: blur(150px); opacity: 0.08; pointer-events: none; z-index: 0;
                }
                .conn-badge {
                    display: inline-flex; align-items: center; gap: 8px;
                    background: rgba(59, 130, 246, 0.05); border: 1px solid rgba(59, 130, 246, 0.2);
                    padding: 8px 16px; border-radius: 100px; margin-bottom: 40px;
                    font-size: 12px; font-weight: 700; color: var(--brand);
                }
                .conn-hero-title {
                    font-size: clamp(40px, 7vw, 90px); line-height: 1.05; margin-bottom: 32px;
                    background: linear-gradient(180deg, #FFFFFF 0%, rgba(255, 255, 255, 0.6) 100%);
                    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
                }
                .conn-hero-sub {
                    font-size: 20px; font-weight: 400; color: var(--slate);
                    max-width: 650px; margin: 0 auto 56px; line-height: 1.6;
                }

                .conn-hero-btns { display: flex; gap: 20px; justify-content: center; }
                .btn-primary { 
                    background: var(--brand); color: white; padding: 16px 36px; border-radius: 14px;
                    font-size: 16px; font-weight: 700; text-decoration: none; transition: 0.3s;
                    box-shadow: 0 10px 30px var(--brand-glow);
                }
                .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 15px 40px var(--brand-glow); }
                .btn-secondary {
                    background: var(--glass); border: 1px solid var(--border); color: var(--fg);
                    padding: 16px 36px; border-radius: 14px; font-size: 16px; font-weight: 700;
                    text-decoration: none; transition: 0.3s;
                }
                .btn-secondary:hover { background: rgba(255,255,255,0.05); border-color: rgba(255,255,255,0.2); }

                /* FEATURES GRID */
                .conn-section { padding: 120px 40px; position: relative; }
                .conn-container { max-width: 1200px; margin: 0 auto; }

                .conn-grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 32px; }
                @media (max-width: 1000px) { .conn-grid-3 { grid-template-columns: 1fr; } }
                
                .conn-f-card {
                    background: var(--glass); border: 1px solid var(--border);
                    border-radius: 24px; padding: 48px; transition: 0.4s;
                }
                .conn-f-card:hover { border-color: var(--brand); transform: translateY(-8px); }
                .conn-f-icon { width: 56px; height: 56px; background: rgba(59, 130, 246, 0.1); border-radius: 16px; display: flex; align-items: center; justify-content: center; color: var(--brand); margin-bottom: 32px; }
                .conn-f-h { font-size: 20px; margin-bottom: 16px; color: var(--fg); }
                .conn-f-p { font-size: 15px; color: var(--slate); }

                /* BENTO GRID SELECTION */
                .conn-bento { display: grid; grid-template-columns: 1.4fr 1fr; gap: 24px; margin-top: 80px; }
                @media (max-width: 900px) { .conn-bento { grid-template-columns: 1fr; } }
                
                .conn-bento-item { background: var(--glass); border: 1px solid var(--border); border-radius: 32px; padding: 60px; position: relative; overflow: hidden; }
                .conn-bento-item.blue { background: radial-gradient(circle at top right, rgba(59, 130, 246, 0.1), transparent); }
                
                .conn-cta-box {
                    margin-top: 40px; display: flex; align-items: center; gap: 12px;
                    font-size: 14px; font-weight: 700; color: var(--brand); text-decoration: none;
                }

                /* TIERS */
                .conn-tiers-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; margin-top: 64px; }
                @media (max-width: 900px) { .conn-tiers-grid { grid-template-columns: 1fr; } }
                
                .conn-tier {
                    padding: 40px; border: 1px solid var(--border); border-radius: 28px;
                    background: rgba(255,255,255,0.01); transition: 0.4s;
                }
                .conn-tier.featured { border-color: var(--brand); background: rgba(59, 130, 246, 0.03); transform: scale(1.05); z-index: 2; }
                .conn-tier-h { font-size: 14px; font-weight: 700; color: var(--slate); text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 24px; display: block; }
                .conn-tier-p { font-size: 44px; font-weight: 800; margin-bottom: 32px; }
                .conn-tier-p span { font-size: 16px; color: var(--slate); font-weight: 500; }
                
                .conn-t-list { list-style: none; padding: 0; margin: 0 0 40px 0; display: grid; gap: 16px; }
                .conn-t-item { display: flex; align-items: center; gap: 12px; font-size: 14px; color: var(--slate); font-weight: 500; }
                .conn-t-check { width: 18px; height: 18px; color: var(--brand); }

                /* FOOTER */
                .conn-footer { border-top: 1px solid var(--border); padding: 100px 40px 60px; }
                .conn-f-inner { max-width: 1200px; margin: 0 auto; display: flex; justify-content: space-between; }
                @media (max-width: 800px) { .conn-f-inner { flex-direction: column; gap: 60px; } }
                
                .conn-f-links { display: flex; gap: 80px; }
                .conn-f-col h4 { font-size: 14px; margin-bottom: 24px; color: var(--fg); text-transform: uppercase; letter-spacing: 0.05em; }
                .conn-f-col a { display: block; color: var(--slate); text-decoration: none; font-size: 14px; margin-bottom: 14px; transition: 0.2s; }
                .conn-f-col a:hover { color: var(--fg); }
                
                .conn-bottom { margin-top: 80px; padding-top: 40px; border-top: 1px solid var(--border); font-size: 12px; color: #444; font-weight: 600; display: flex; justify-content: space-between; }
            `}</style>

      <nav className={`conn-nav ${isScrolled ? 'scrolled' : ''}`}>
        <div className="conn-nav-inner">
          <a href="/" className="conn-logo">
            <div className="conn-logo-dot" />
            INVESTOR
          </a>
          <div className="conn-nav-links">
            <a href="#vision" className="conn-nav-link">Network</a>
            <a href="#ecosystem" className="conn-nav-link">Capital</a>
            <a href="#access" className="conn-nav-link">Intelligence</a>
          </div>
          <div className="conn-nav-actions">
            <a href="http://localhost:80/login" className="btn-login">Log In</a>
            <a href="http://localhost:80/register" className="btn-get-started">Get Started</a>
          </div>
        </div>
      </nav>

      <header className="conn-hero">
        <div className="conn-hero-glow" />
        <div className="conn-badge">
          <Zap size={14} />
          <span>The Global Venture Gateway</span>
        </div>
        <h1 className="conn-hero-title">Capital Meets <br />Innovation.</h1>
        <p className="conn-hero-sub">
          The elite unified ecosystem where founders and strategic capital align with precision. Built for high-conviction deal flow.
        </p>
        <div className="conn-hero-btns">
          <a href="http://localhost:80/register" className="btn-primary">Connect as Founder</a>
          <a href="http://localhost:80/register/investor" className="btn-secondary">Enter as Partner</a>
        </div>
      </header>

      <section className="conn-section">
        <div className="conn-container">
          <div className="conn-grid-3">
            <div className="conn-f-card">
              <div className="conn-f-icon"><Search size={24} /></div>
              <h3 className="conn-f-h">Smart Discovery</h3>
              <p className="conn-f-p">Algorithmic matching that filters noise and highlights high-signal opportunities matching your mandate.</p>
            </div>
            <div className="conn-f-card">
              <div className="conn-f-icon"><Shield size={24} /></div>
              <h3 className="conn-f-h">Verified Trust</h3>
              <p className="conn-f-p">Every participant in the INVESTOR network undergoes institutional-grade verification for maximum security.</p>
            </div>
            <div className="conn-f-card">
              <div className="conn-f-icon"><PieChart size={24} /></div>
              <h3 className="conn-f-h">Deep Intelligence</h3>
              <p className="conn-f-p">Real-time data streams and sentiment analysis powered by the core intelligence protocol.</p>
            </div>
          </div>

          <div className="conn-bento">
            <div className="conn-bento-item blue">
              <div className="conn-badge" style={{ marginBottom: 24 }}>FOR FOUNDERS</div>
              <h2 style={{ fontSize: 36, marginBottom: 24 }}>Deploy your vision to <br />the world's top funds.</h2>
              <p style={{ maxWidth: 400, marginBottom: 32 }}>Stop cold pitching. Our architecture ensures your pitch lands directly on the terminals of partners ready to deploy.</p>
              <LinkIcon size={24} color="var(--brand)" />
              <a href="http://localhost:80/register" className="conn-cta-box">Establish your portal <ArrowRight size={16} /></a>
            </div>
            <div className="conn-bento-item">
              <div className="conn-badge" style={{ marginBottom: 24, background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }}>FOR INVESTORS</div>
              <h2 style={{ fontSize: 28, marginBottom: 24 }}>Access sovereign <br />deal flow.</h2>
              <p style={{ marginBottom: 32 }}>Treat early-stage venture with the same rigor as public equity.</p>
              <a href="http://localhost:80/register/investor" className="conn-cta-box" style={{ color: '#fff' }}>Enter Terminal <ArrowRight size={16} /></a>
            </div>
          </div>
        </div>
      </section>

      <section id="access" className="conn-section" style={{ background: 'rgba(59, 130, 246, 0.02)' }}>
        <div className="conn-container">
          <div style={{ textAlign: 'center', marginBottom: 80 }}>
            <h2 style={{ fontSize: 48, marginBottom: 20 }}>Network Tiers</h2>
            <p>Select the access level that matches your strategic requirements.</p>
          </div>

          <div className="conn-tiers-grid">
            <div className="conn-tier">
              <span className="conn-tier-h">Standard</span>
              <div className="conn-tier-p">₹0 <span>/mo</span></div>
              <div className="conn-t-list">
                <div className="conn-t-item"><Activity className="conn-t-check" /> Global Profile Indexing</div>
                <div className="conn-t-item"><Activity className="conn-t-check" /> Community Events</div>
                <div className="conn-t-item"><Activity className="conn-t-check" /> Basic Analytics</div>
              </div>
              <a href="http://localhost:80/register" className="btn-secondary" style={{ display: 'block', textAlign: 'center', fontSize: 13 }}>Get Started</a>
            </div>

            <div className="conn-tier featured">
              <span className="conn-tier-h" style={{ color: 'var(--brand)' }}>Strategic</span>
              <div className="conn-tier-p">₹999 <span>/mo</span></div>
              <div className="conn-t-list">
                <div className="conn-t-item"><Activity className="conn-t-check" /> Direct Partner Protocol</div>
                <div className="conn-t-item"><Activity className="conn-t-check" /> AI Match Evaluation</div>
                <div className="conn-t-item"><Activity className="conn-t-check" /> Verified Signal Stream</div>
                <div className="conn-t-item"><Activity className="conn-t-check" /> Priority Feedback</div>
              </div>
              <a href="http://localhost:80/register" className="btn-primary" style={{ display: 'block', textAlign: 'center', fontSize: 13 }}>Go Strategic</a>
            </div>

            <div className="conn-tier">
              <span className="conn-tier-h">Institutional</span>
              <div className="conn-tier-p">₹1999 <span>/mo</span></div>
              <div className="conn-t-list">
                <div className="conn-t-item"><Activity className="conn-t-check" /> Full API Ecosystem</div>
                <div className="conn-t-item"><Activity className="conn-t-check" /> White-label Governance</div>
                <div className="conn-t-item"><Activity className="conn-t-check" /> Priority Lead Gen</div>
                <div className="conn-t-item"><Activity className="conn-t-check" /> Concierge Advisory</div>
              </div>
              <a href="http://localhost:80/register" className="btn-secondary" style={{ display: 'block', textAlign: 'center', fontSize: 13 }}>Enquire Now</a>
            </div>
          </div>
        </div>
      </section>

      <footer className="conn-footer">
        <div className="conn-f-inner">
          <div style={{ maxWidth: 300 }}>
            <a href="/" className="conn-logo" style={{ marginBottom: 32 }}>
              <div className="conn-logo-dot" />
              INVESTOR
            </a>
            <p style={{ fontSize: 14 }}>Revolutionizing how the world deploys capital through high-conviction architecture.</p>
          </div>
          <div className="conn-f-links">
            <div className="conn-f-col">
              <h4>Platform</h4>
              <a href="#">Network</a>
              <a href="#">Capital</a>
              <a href="#">Intelligence</a>
              <a href="#">Compliance</a>
            </div>
            <div className="conn-f-col">
              <h4>Legal</h4>
              <a href="#">Privacy</a>
              <a href="#">Terms</a>
              <a href="#">Cookies</a>
              <a href="#">Security</a>
            </div>
          </div>
        </div>
        <div className="conn-container">
          <div className="conn-bottom">
            <span>© 2026 INVESTOR GLOBAL ARCHITECTURE GRP.</span>
            <div style={{ display: 'flex', gap: 24 }}>
              <span>SYSTEM STATUS: ACTIVE</span>
              <span>VERSION v4.2.0</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
