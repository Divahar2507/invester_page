import React, { useState, useEffect } from 'react';
import {
  ArrowRight, Shield, Zap, Network, Globe, Activity, Users, Search,
  MessageSquare, Database, Share2, TrendingUp, BarChart3, Rocket,
  Quote, Star, CheckCircle2, Lock, Cpu, ChevronLeft, FileText,
  CircleDollarSign, LineChart, ChevronRight, Menu, X, Plus,
  Sparkles, Command, ArrowUpRight, Terminal
} from 'lucide-react';

const App = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const serviceKeywords = [
    { label: "Capital Intel", link: "http://localhost:80" },
    { label: "Node Connect", link: "http://localhost:3006" },
    { label: "Sovereign Admin", link: "http://localhost:3008" },
    { label: "LeadGen AI", link: "http://localhost:3003" },
    { label: "Liquidity Net", link: "http://localhost:3009" },
    { label: "Founder Ops", link: "http://localhost:3007" },
    { label: "System Docs", link: "http://localhost:3011" }
  ];

  const services = [
    {
      title: "Investor Connect",
      desc: "Direct deployment pipeline for high-conviction deal flow and venture capital.",
      icon: <CircleDollarSign size={22} />,
      image: "/service_investors.png",
      keyword: "Capital",
      link: "http://localhost:80"
    },
    {
      title: "Node Connect",
      desc: "Architecting high-value connections through recursive ecosystem mapping.",
      icon: <Network size={22} />,
      image: "/service_events.png",
      keyword: "Networking",
      link: "http://localhost:3006"
    },
    {
      title: "Research Engine",
      desc: "Mentors, Incubation, IPR Support, and Policy frameworks.",
      icon: <Shield size={22} />,
      image: "/service_docs.png",
      keyword: "Security",
      link: "http://localhost:3008"
    },
    {
      title: "LeadGen-AI",
      desc: "Verification-first lead generation powered by predictive sentiment analysis.",
      icon: <Rocket size={22} />,
      image: "/service_leadgen.png",
      keyword: "Growth",
      link: "http://localhost:3003"
    },
    {
      title: "Funds",
      desc: "Cross-border treasury tracking and decentralized financial architecture.",
      icon: <BarChart3 size={22} />,
      image: "/service_funds.png",
      keyword: "Finance",
      link: "http://localhost:3009"
    },
    {
      title: "Founder Connect",
      desc: "Talent acquisition, project management, and internal team ops.",
      icon: <Cpu size={22} />,
      image: "/service_research.png",
      keyword: "Operations",
      link: "http://localhost:3007"
    },
    {
      title: "System Docs",
      desc: "Complete architectural blueprints and API references for the ecosystem.",
      icon: <FileText size={22} />,
      image: "/service_docs.png",
      keyword: "Docs",
      link: "http://localhost:3011"
    }
  ];

  return (
    <div className="startos-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        
        :root {
            --bg: #030712;
            --brand: #6366f1;
            --brand-glow: rgba(99, 102, 241, 0.3);
            --text-main: #f3f4f6;
            --text-dim: #9ca3af;
            --border: rgba(255, 255, 255, 0.1);
        }

        .startos-root {
            font-family: 'Plus Jakarta Sans', sans-serif;
            background: var(--bg);
            color: var(--text-main);
            min-height: 100vh;
            overflow-x: hidden;
        }

        /* Hero Background Animation */
        .hero-glow {
            position: absolute;
            top: -10%;
            left: 50%;
            transform: translateX(-50%);
            width: 80%;
            height: 600px;
            background: radial-gradient(circle, var(--brand-glow) 0%, transparent 70%);
            z-index: 0;
            pointer-events: none;
        }

        .nav-container {
            position: fixed;
            top: 0; width: 100%;
            z-index: 100;
            transition: 0.3s;
            padding: 20px 0;
        }

        .nav-scrolled {
            background: rgba(3, 7, 18, 0.8);
            backdrop-filter: blur(12px);
            border-bottom: 1px solid var(--border);
            padding: 12px 0;
        }

        .nav-content {
            max-width: 1200px;
            margin: 0 auto;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0 24px;
        }

        .logo-box {
            display: flex;
            align-items: center;
            gap: 10px;
            font-weight: 800;
            font-size: 22px;
            letter-spacing: -1px;
            color: #fff;
            text-decoration: none;
        }

        .hero-section {
            padding: 200px 24px 100px;
            text-align: center;
            position: relative;
        }

        .badge {
            background: rgba(255,255,255,0.05);
            border: 1px solid var(--border);
            padding: 6px 16px;
            border-radius: 100px;
            font-size: 12px;
            font-weight: 600;
            color: var(--brand);
            display: inline-flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 30px;
        }

        .hero-title {
            font-size: clamp(40px, 8vw, 80px);
            font-weight: 800;
            line-height: 1.1;
            margin-bottom: 24px;
            background: linear-gradient(to bottom, #fff 40%, #6b7280);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        .hero-subtitle {
            font-size: 18px;
            color: var(--text-dim);
            max-width: 600px;
            margin: 0 auto 40px;
            line-height: 1.6;
        }

        .btn-primary {
            background: var(--brand);
            color: white;
            padding: 14px 32px;
            border-radius: 12px;
            font-weight: 700;
            border: none;
            cursor: pointer;
            transition: 0.3s;
            box-shadow: 0 10px 20px var(--brand-glow);
            text-decoration: none;
            display: inline-block;
        }

        .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 15px 30px var(--brand-glow);
            filter: brightness(1.1);
        }

        .grid-layout {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 24px;
            max-width: 1200px;
            margin: 80px auto;
            padding: 0 24px;
        }

        .card {
            background: rgba(255,255,255,0.02);
            border: 1px solid var(--border);
            border-radius: 24px;
            overflow: hidden;
            transition: 0.4s;
            text-decoration: none;
            color: inherit;
            display: block;
        }

        .card:hover {
            border-color: var(--brand);
            background: rgba(255,255,255,0.04);
            transform: translateY(-8px);
        }

        .card-img {
            height: 200px;
            width: 100%;
            object-fit: cover;
            opacity: 0.6;
        }

        .card-body {
            padding: 30px;
        }

        .footer {
            border-top: 1px solid var(--border);
            padding: 60px 24px;
            text-align: center;
            margin-top: 100px;
        }
      `}</style>

      <div className="hero-glow" />

      {/* Navigation */}
      <nav className={`nav-container ${isScrolled ? 'nav-scrolled' : ''}`}>
        <div className="nav-content">
          <a href="#" className="logo-box">
            <div style={{ background: 'var(--brand)', padding: '6px', borderRadius: '8px' }}>
              <Command size={20} color="white" />
            </div>
            START_OS
          </a>

          <div style={{ display: 'flex', gap: '30px' }} className="hidden-mobile">
            {serviceKeywords.map((k, i) => (
              <a key={i} href={k.link} style={{ color: 'var(--text-dim)', textDecoration: 'none', fontSize: '14px', fontWeight: 600 }}>
                {k.label}
              </a>
            ))}
          </div>

          <a href="http://localhost:80" className="btn-primary" style={{ padding: '10px 20px', fontSize: '14px' }}>
            Launch App
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="hero-section">
        <div className="badge">
          <Sparkles size={14} />
          The Operating System for Startups
        </div>
        <h1 className="hero-title">
          Build the future <br /> with StartOS.
        </h1>
        <p className="hero-subtitle">
          A unified intelligence layer designed to streamline fundraising,
          manage equity, and scale your venture ecosystem with institutional precision.
        </p>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
          <a href="http://localhost:3008" className="btn-primary">Initialize Terminal</a>
          <a href="http://localhost:3011" style={{ background: 'transparent', border: '1px solid var(--border)', color: '#fff', padding: '14px 32px', borderRadius: '12px', fontWeight: 600, cursor: 'pointer', textDecoration: 'none', display: 'inline-block' }}>
            Documentation
          </a>
        </div>
      </header>

      {/* Services Grid */}
      <section className="grid-layout">
        {services.map((s, i) => (
          <a key={i} href={s.link} className="card">
            <img src={s.image} alt={s.title} className="card-img" />
            <div className="card-body">
              <div style={{ color: 'var(--brand)', marginBottom: '16px' }}>{s.icon}</div>
              <h3 style={{ fontSize: '20px', marginBottom: '10px' }}>{s.title}</h3>
              <p style={{ color: 'var(--text-dim)', fontSize: '14px', lineHeight: 1.6 }}>{s.desc}</p>
            </div>
          </a>
        ))}
      </section>

      {/* Stats Section */}
      <section className="grid-layout" style={{ marginTop: '0' }}>
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <div style={{ fontSize: '48px', fontWeight: 800, color: 'var(--brand)' }}>$4.2B+</div>
          <div style={{ color: 'var(--text-dim)', marginTop: '8px' }}>Capital Managed</div>
        </div>
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <div style={{ fontSize: '48px', fontWeight: 800, color: 'var(--brand)' }}>120k+</div>
          <div style={{ color: 'var(--text-dim)', marginTop: '8px' }}>Verified Nodes</div>
        </div>
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <div style={{ fontSize: '48px', fontWeight: 800, color: 'var(--brand)' }}>0.01s</div>
          <div style={{ color: 'var(--text-dim)', marginTop: '8px' }}>Sync Latency</div>
        </div>
      </section>

      <footer className="footer">
        <div style={{ opacity: 0.5, fontSize: '14px' }}>
          © 2026 StartOS Protocols. Powered by Dynamic Layer Technology.
        </div>
      </footer>
    </div>
  );
};

export default App;