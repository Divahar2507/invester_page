import React, { useState, useEffect } from 'react';
import {
  ArrowRight,
  Shield,
  Zap,
  Network,
  Globe,
  Activity,
  Users,
  Search,
  MessageSquare,
  Database,
  Share2,
  TrendingUp,
  BarChart3,
  Rocket,
  Quote,
  Star,
  CheckCircle2,
  Lock,
  Cpu,
  ChevronLeft,
  FileText,
  CircleDollarSign,
  LineChart,
  ChevronRight,
  Menu,
  X,
  Plus,
  Sparkles,
  Command,
  ArrowUpRight
} from 'lucide-react';

const LandingPage = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const serviceKeywords = [
    { label: "Capital Intel", link: "http://localhost:80" },
    { label: "Node Connect", link: "http://localhost:3006" },
    { label: "Sovereign Data", link: "http://localhost:3001" },
    { label: "LeadGen AI", link: "http://localhost:3003" },
    { label: "Liquidity Net", link: "http://localhost:3009" },
    { label: "Alpha Research", link: "http://localhost:3007" }
  ];

  const services = [
    {
      title: "Investor & Startup",
      desc: "Direct deployment pipeline for high-conviction deal flow and venture capital.",
      icon: <Users size={22} />,
      image: "/service_investors.png",
      link: "http://localhost:80",
      keyword: "Capital Intel"
    },
    {
      title: "Networking Events",
      desc: "Architecting high-value connections through recursive ecosystem mapping.",
      icon: <Network size={22} />,
      image: "/service_events.png",
      link: "http://localhost:3006",
      keyword: "Node Connect"
    },
    {
      title: "Education & Research",
      desc: "Encrypted data rooms and automated institutional governance frameworks.",
      icon: <FileText size={22} />,
      image: "/service_docs.png",
      link: "http://localhost:3008",
      keyword: "Sovereign Data"
    },
    {
      title: "LeadGen AI",
      desc: "Verification-first lead generation powered by predictive sentiment analysis.",
      icon: <Rocket size={22} />,
      image: "/service_leadgen.png",
      link: "http://localhost:3003",
      keyword: "LeadGenAI"
    },
    {
      title: "Funding & Investment",
      desc: "Cross-border treasury tracking and decentralized financial architecture.",
      icon: <CircleDollarSign size={22} />,
      image: "/service_funds.png",
      link: "http://localhost:3009",
      keyword: "Liquidity Net"
    },
    {
      title: "Human Resources",
      desc: "Deep-stack market intelligence designed for institutional decision makers.",
      icon: <LineChart size={22} />,
      image: "/service_research.png",
      link: "http://localhost:3007",
      keyword: "Alpha Research"
    }
  ];

  return (
    <div className="bridge-root">
      <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Outfit:wght@300;400;500;600;700;800&display=swap');
                
                :root {
                    --bg: #02040a;
                    --bg-accent: #0d1117;
                    --bg-card: #0f172a;
                    --fg: #f0f6fc;
                    --slate: #8b949e;
                    --brand: #2f81f7;
                    --brand-glow: rgba(47, 129, 247, 0.3);
                    --border: rgba(48, 54, 61, 0.7);
                }

                * { box-sizing: border-box; scroll-behavior: smooth; }
                body { margin: 0; padding: 0; background: var(--bg); color: var(--fg); -webkit-font-smoothing: antialiased; }

                .bridge-root {
                    font-family: 'Plus Jakarta Sans', sans-serif;
                    min-height: 100vh;
                    background: var(--bg);
                    position: relative;
                    overflow-x: hidden;
                }

                /* GRID OVERLAY */
                .bridge-grid-bg {
                    position: absolute; inset: 0;
                    background-image: linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px);
                    background-size: 60px 60px;
                    opacity: 0.1;
                    mask-image: radial-gradient(circle at 50% 50%, black, transparent 90%);
                    z-index: 0; pointer-events: none;
                }

                /* NAVIGATION */
                .bridge-nav {
                    position: fixed; top: 0; left: 0; right: 0; z-index: 1000;
                    height: 100px; display: flex; align-items: center; justify-content: center;
                    transition: 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                }
                .bridge-nav.scrolled {
                    background: rgba(2, 4, 10, 0.8);
                    backdrop-filter: blur(20px);
                    border-bottom: 1px solid var(--border);
                    height: 80px;
                }
                .bridge-nav-inner {
                    width: 100%; max-width: 1400px; padding: 0 50px;
                    display: flex; align-items: center; justify-content: space-between;
                }
                
                /* BRAND SECTION - LEFT TOP (NEW DESIGN) */
                .bridge-brand-v { display: flex; flex-direction: column; line-height: 1.1; }
                .bridge-title-small { 
                    font-size: 10px; font-weight: 800; letter-spacing: 0.4em; 
                    text-transform: uppercase; color: #58a6ff; margin-bottom: 2px;
                }
                .bridge-logo-main {
                    display: flex; align-items: center; gap: 8px; text-decoration: none; color: var(--fg);
                    font-weight: 800; font-size: 18px; letter-spacing: -0.02em;
                }
                
                /* KEYWORD NAVIGATION */
                .bridge-keyword-list { display: flex; gap: 24px; }
                @media (max-width: 1100px) { .bridge-keyword-list { display: none; } }
                .bridge-k-link { 
                    color: var(--slate); text-decoration: none; font-size: 12px; 
                    font-weight: 700; text-transform: uppercase; letter-spacing: 0.12em;
                    transition: 0.3s; display: flex; align-items: center; gap: 4px;
                }
                .bridge-k-link:hover { color: #58a6ff; }
                .bridge-k-link span { opacity: 0; transform: translate(-4px, 4px); transition: 0.3s; color: #58a6ff; }
                .bridge-k-link:hover span { opacity: 1; transform: translate(0, 0); }

                .btn-launch {
                    background: var(--brand); color: white; padding: 12px 28px; border-radius: 12px;
                    font-size: 14px; font-weight: 700; border: none; cursor: pointer; transition: 0.5s;
                    box-shadow: 0 4px 20px rgba(47, 129, 247, 0.2);
                }
                .btn-launch:hover { transform: translateY(-3px); box-shadow: 0 10px 30px var(--brand-glow); background: #388bfd; }

                /* HERO SECTION - NEW BACKGROUND */
                .bridge-hero {
                    padding: 280px 40px 200px;
                    text-align: center;
                    position: relative;
                    z-index: 1;
                    background: radial-gradient(circle at 50% 10%, rgba(47, 129, 247, 0.15), transparent 60%);
                }

                .bridge-hero::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background-image: url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop');
                    background-size: cover;
                    background-position: center 20%;
                    opacity: 0.25;
                    z-index: -1;
                    mask-image: linear-gradient(to bottom, black 30%, transparent 95%);
                    pointer-events: none;
                }

                .bridge-hero::after {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: radial-gradient(circle at 50% 50%, transparent 0%, var(--bg) 90%);
                    z-index: -1;
                    pointer-events: none;
                }
                .bridge-container { max-width: 1200px; margin: 0 auto; }
                
                .bridge-badge {
                    display: inline-flex; align-items: center; gap: 8px;
                    background: rgba(47, 129, 247, 0.1); border: 1px solid rgba(47, 129, 247, 0.2);
                    padding: 8px 20px; border-radius: 100px;
                    color: #58a6ff; font-size: 11px; font-weight: 800;
                    margin-bottom: 40px; text-transform: uppercase; letter-spacing: 0.2em;
                }

                .bridge-h1 {
                    font-size: clamp(28px, 3.5vw, 40px);
                    font-weight: 600;
                    margin-bottom: 20px;
                    letter-spacing: -0.02em;
                    line-height: 1.2;
                    color: #fff;
                }

                .bridge-p {
                    font-size: 15px;
                    color: #8b949e;
                    max-width: 520px;
                    margin: 0 auto 40px;
                    line-height: 1.6;
                    font-weight: 400;
                }

                /* SERVICES GRID */
                .bridge-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 32px;
                    margin-bottom: 32px;
                }
                @media (max-width: 800px) { .bridge-grid { grid-template-columns: 1fr; } }

                .bridge-card {
                    background: #0d1117;
                    border: 1px solid #30363d;
                    border-radius: 32px;
                    padding: 0;
                    transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
                    text-align: left;
                    overflow: hidden;
                    text-decoration: none;
                    display: flex;
                    flex-direction: column;
                }
                .bridge-card:hover { border-color: #58a6ff; transform: translateY(-15px); background: #161b22; }

                .bridge-card-img {
                    height: 260px;
                    position: relative;
                    overflow: hidden;
                    background: #010409;
                }
                .bridge-card-img img { width: 100%; height: 100%; object-fit: cover; opacity: 0.45; transition: 0.8s; }
                .bridge-card:hover .bridge-card-img img { transform: scale(1.1) rotate(1deg); opacity: 0.7; }
                
                .bridge-card-img::after {
                    content: ''; position: absolute; inset: 0;
                    background: linear-gradient(180deg, transparent 40%, #0d1117 100%);
                }

                .bridge-k-badge {
                    position: absolute; top: 24px; right: 24px;
                    padding: 8px 16px; background: rgba(0,0,0,0.8);
                    border: 1px solid #30363d; border-radius: 100px;
                    color: #fff; font-size: 10px; font-weight: 800;
                    text-transform: uppercase; letter-spacing: 0.15em; z-index: 5;
                }

                .bridge-icon-box {
                    position: absolute; bottom: 24px; left: 32px;
                    width: 56px; height: 56px; background: #0d1117;
                    border: 1px solid #58a6ff; border-radius: 14px;
                    display: flex; align-items: center; justify-content: center;
                    color: #58a6ff; z-index: 4; box-shadow: 0 10px 20px rgba(0,0,0,0.5);
                }

                .bridge-card-content { padding: 40px 40px 55px; }
                .bridge-card-h { font-size: 17px; font-weight: 600; color: #fff; margin-bottom: 6px; letter-spacing: -0.01em; }
                .bridge-card-p { font-size: 13px; color: #8b949e; line-height: 1.6; font-weight: 400; }

                /* DASHBOARD METRICS */
                .bridge-metrics-row {
                    display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                    gap: 24px; margin-bottom: 120px;
                }
                .bridge-m-card {
                    background: #0d1117; border: 1px solid #30363d; border-radius: 24px; padding: 32px;
                    display: flex; flex-direction: column; justify-content: space-between;
                }
                .bridge-m-label { font-size: 10px; font-weight: 600; color: #8b949e; text-transform: uppercase; letter-spacing: 0.12em; margin-bottom: 10px; }
                .bridge-m-val { font-size: 28px; font-weight: 600; color: #fff; margin-bottom: 6px; }
                .bridge-m-sub { color: #238636; font-size: 14px; font-weight: 700; background: rgba(35, 134, 54, 0.1); padding: 4px 10px; border-radius: 6px; width: fit-content; }

                /* FOOTER */
                .bridge-footer { padding: 120px 40px 80px; border-top: 1px solid #30363d; background: #010409; }
                .bridge-footer-inner { max-width: 1300px; margin: 0 auto; display: grid; grid-template-columns: 2fr repeat(3, 1fr); gap: 60px; }
                @media (max-width: 1000px) { .bridge-footer-inner { grid-template-columns: 1fr 1fr; } }
                @media (max-width: 600px) { .bridge-footer-inner { grid-template-columns: 1fr; } }
            `}</style>

      <div className="bridge-grid-bg" />

      <nav className={`bridge-nav ${isScrolled ? 'scrolled' : ''}`}>
        <div className="bridge-nav-inner">
          <div className="bridge-brand-v">
            <span className="bridge-title-small">INVESTORBRIDGE</span>
            <a href="/" className="bridge-logo-main">
              <Zap size={20} color="#58a6ff" fill="#58a6ff" />
              <span>DYNAMIC_LAYER</span>
            </a>
          </div>

          <div className="bridge-keyword-list">
            {serviceKeywords.map((k, i) => (
              <a key={i} href={k.link} className="bridge-k-link">
                {k.label} <ArrowUpRight size={14} />
              </a>
            ))}
          </div>

          <button className="btn-launch">Access Terminal</button>
        </div>
      </nav>

      <section className="bridge-hero">
        <div className="bridge-container">
          <div className="bridge-badge">
            <Cpu size={14} style={{ marginRight: 8 }} />
            Institutional Tech Protocol
          </div>
          <h1 className="bridge-h1">STARTUP ECOSYSTEM <br /> <br />FOR MODERN VENTURE.</h1>
          <p className="bridge-p">
            Architecting verified intelligence to synchronize institutional fundraising,
            high-value networking, and recursive deal governance.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <button className="btn-launch" style={{ padding: '16px 36px', fontSize: 18, borderRadius: 14 }}>
              Initialize Integration
            </button>
            <button style={{ background: 'transparent', border: '1px solid #30363d', color: '#fff', padding: '16px 36px', fontSize: 15, borderRadius: 14, cursor: 'pointer', fontWeight: 600 }}>
              View Documentation
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '60px', marginTop: '100px', textAlign: 'left', borderTop: '1px solid #30363d', paddingTop: '60px' }}>
            <div>
              <h2 style={{ fontSize: '32px', fontWeight: 700, color: '#fff' }}>Startup <br />Ecosystem</h2>
              <p style={{ color: '#8b949e', fontSize: '16px', marginTop: '20px', lineHeight: 1.6 }}>
                The definitive protocol for institutional-grade venture operations, empowering founders with unified intelligence and high-conviction networking.
              </p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '30px', borderRadius: '24px', border: '1px solid #30363d' }}>
                <h3 style={{ color: '#fff', fontSize: '18px', marginBottom: '10px' }}>Global Reach</h3>
                <p style={{ color: '#8b949e', fontSize: '14px' }}>Connect with institutional partners across 50+ global nodes.</p>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '30px', borderRadius: '24px', border: '1px solid #30363d' }}>
                <h3 style={{ color: '#fff', fontSize: '18px', marginBottom: '10px' }}>Verified Flow</h3>
                <p style={{ color: '#8b949e', fontSize: '14px' }}>Every connection is backed by predictive sentiment and risk analysis.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="services" className="bridge-container" style={{ padding: '0 40px' }}>
        <div style={{ paddingBottom: 60 }}>
          <span style={{ color: '#58a6ff', fontSize: 12, fontWeight: 800, letterSpacing: '0.3em' }}>CORE PROTOCOLS</span>
          <h2 style={{ fontSize: 22, margin: '14px 0 10px', fontWeight: 700 }}>Universal Services Suite</h2>
          <p style={{ color: '#8b949e', fontSize: 14, maxWidth: 450, lineHeight: 1.6 }}>Deploying advanced architectural nodes for the global venture ecosystem.</p>
        </div>

        <div className="bridge-grid">
          {services.slice(0, 3).map((s, i) => (
            <a key={i} href={s.link} className="bridge-card">
              <div className="bridge-card-img">
                <div className="bridge-k-badge">{s.keyword}</div>
                <img src={s.image} alt={s.title} />
                <div className="bridge-icon-box">{s.icon}</div>
              </div>
              <div className="bridge-card-content">
                <h3 className="bridge-card-h">{s.title}</h3>
                <p className="bridge-card-p">{s.desc}</p>
              </div>
            </a>
          ))}
        </div>

        <div className="bridge-grid" style={{ marginTop: '32px' }}>
          {services.slice(3, 6).map((s, i) => (
            <a key={i} href={s.link} className="bridge-card">
              <div className="bridge-card-img">
                <div className="bridge-k-badge">{s.keyword}</div>
                <img src={s.image} alt={s.title} />
                <div className="bridge-icon-box">{s.icon}</div>
              </div>
              <div className="bridge-card-content">
                <h3 className="bridge-card-h">{s.title}</h3>
                <p className="bridge-card-p">{s.desc}</p>
              </div>
            </a>
          ))}
        </div>

        <div className="bridge-metrics-row">
          <div className="bridge-m-card">
            <span className="bridge-m-label">Ecosystem Health</span>
            <div className="bridge-m-val">94.2%</div>
            <span className="bridge-m-sub">+2.4% Optimal</span>
          </div>
          <div className="bridge-m-card">
            <span className="bridge-m-label">Network Latency</span>
            <div className="bridge-m-val">0.08ms</div>
            <span className="bridge-m-sub">Verified Synchronized</span>
          </div>
          <div className="bridge-m-card">
            <span className="bridge-m-label">Capital Velocity</span>
            <div className="bridge-m-val">$2.8B</div>
            <span className="bridge-m-sub">Institutional Volume</span>
          </div>
        </div>
      </section>

      <footer className="bridge-footer">
        <div className="bridge-footer-inner">
          <div className="footer-col" style={{ maxWidth: 450 }}>
            <div className="bridge-brand-v" style={{ marginBottom: 40 }}>
              <span className="bridge-title-small">INVESTORBRIDGE</span>
              <div className="bridge-logo-main">
                <Zap size={20} color="#58a6ff" fill="#58a6ff" />
                <span>DYNAMIC_LAYER</span>
              </div>
            </div>
            <p style={{ color: '#8b949e', fontSize: 17, lineHeight: 1.8 }}>
              Architecting the future of global innovation through unified intelligence and sovereign networking protocols.
            </p>
          </div>
          <div className="footer-col">
            <h4>Protocols</h4>
            <a href="#">LeadGen AI</a>
            <a href="#">Alpha Link</a>
            <a href="#">Recursive API</a>
            <a href="#">Vault Access</a>
          </div>
          <div className="footer-col">
            <h4>Network</h4>
            <a href="#">Global Nodes</a>
            <a href="#">Partner Portal</a>
            <a href="#">Deal Stream</a>
            <a href="#">Events Wall</a>
          </div>
          <div className="footer-col">
            <h4>Security</h4>
            <a href="#">SLA Policy</a>
            <a href="#">Compliance</a>
            <a href="#">Privacy Layer</a>
            <a href="#">Audit Log</a>
          </div>
        </div>

        <div style={{ marginTop: 80, paddingTop: 40, borderTop: '1px solid #30363d', display: 'flex', justifyContent: 'space-between', color: '#484f58', fontSize: 13, fontWeight: 600 }}>
          <div>© 2026 INVESTORBRIDGE GLOBAL. ARCHITECTING CONVICTION.</div>
          <div style={{ display: 'flex', gap: 30 }}>
            <span style={{ color: '#238636' }}>NODE: ACTIVE</span>
            <span>VER: 10.2.4</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
