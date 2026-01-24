import React, { useState } from 'react';
import './App.css';

const App = () => {
  const [activeCard, setActiveCard] = useState(null);

  const openApp = (url) => {
    window.open(url, '_blank');
  };

  const services = [
    {
      id: 'main',
      title: "INFINITE TECH AI",
      subtitle: "The Core Engine",
      description: "Pitch ideas, secure funding, and manage portfolios in one unified ecosystem of innovation. \"Innovation distinguishes between a leader and a follower.\"",
      url: "http://localhost",
      icon: "rocket",
      theme: "cyan",
      gridArea: "hero"
    },
    {
      id: 'connector',
      title: "Connector",
      subtitle: "Strategic Partnerships",
      description: "Seamlessly connect and collaborate with the entire business network. \"Alone we can do so little; together we can do so much.\"",
      url: "http://localhost:3005",
      icon: "link",
      theme: "violet",
      gridArea: "tall"
    },
    {
      id: 'founderdash',
      title: "FounderDash",
      subtitle: "Startup Command Center",
      description: "Comprehensive dashboard for startup founders. \"The secret of getting ahead is getting started.\"",
      url: "http://localhost:3007",
      icon: "rocket",
      theme: "purple",
      gridArea: "box1"
    },
    {
      id: 'innosphere',
      title: "Innosphere Admin",
      subtitle: "Collaboration Hub",
      description: "Admin portal for team collaboration and project management. \"Alone we can do so little; together we can do so much.\"",
      url: "http://localhost:3008",
      icon: "users",
      theme: "indigo",
      gridArea: "box2"
    },
    {
      id: 'leadgen',
      title: "LeadGen Engine",
      subtitle: "Growth Automation",
      description: "AI-powered market analysis and automated lead generation. \"The best way to predict the future is to create it.\"",
      url: "http://localhost:3003",
      icon: "target",
      theme: "amber",
      gridArea: "box3"
    },
    {
      id: 'funds_collection',
      title: "Funds Collection",
      subtitle: "Payment Gateway",
      description: "Secure payment processing and fund management. \"Trust is the currency of the future.\"",
      url: "http://localhost:3009",
      icon: "credit-card",
      theme: "green",
      gridArea: "box4"
    },
    {
      id: 'events',
      title: "Events Protocol",
      subtitle: "Community Matrix",
      description: "Webinars & Demo Days. \"Networking is not about just connecting people.\"",
      url: "http://localhost:3006",
      icon: "calendar",
      theme: "pink",
      gridArea: "wide"
    },
    {
      id: 'admin',
      title: "Super Admin",
      subtitle: "System Control",
      description: "Global settings & oversight. \"Leadership is the capacity to translate vision into reality.\"",
      url: "http://localhost:3004",
      icon: "shield",
      theme: "red",
      gridArea: "admin"
    }
  ];

  return (
    <div className="universe-container">
      <div className="stars"></div>
      <div className="nebula"></div>

      <div className="content-wrapper">
        <header className="main-header">
          <div className="logo-section">
            <h1 className="logo-text">
              <span className="text-cyan-400">INFIO</span><span className="text-white">ITE</span>
            </h1>
            <div className="logo-sub">
              <span className="logo-triangle">▲</span> TECH <span className="logo-box">AI</span>
            </div>
          </div>

          <h1 className="hero-title">
            Select Your <br />
            <span className="text-gradient">Dimension.</span>
          </h1>
          <p className="header-desc">
            Access the centralized suite of tools designed for the next generation of venture capital and business development.
          </p>
        </header>

        <div className="bento-grid">
          {services.map((service) => (
            <div
              key={service.id}
              className={`bento-card ${service.id} ${activeCard === service.id ? 'active' : ''}`}
              style={{ gridArea: service.gridArea, '--theme': `var(--${service.theme})` }}
              onMouseEnter={() => setActiveCard(service.id)}
              onMouseLeave={() => setActiveCard(null)}
              onClick={() => openApp(service.url)}
            >
              <div className="card-glow"></div>
              <div className="card-content">
                <div className="card-top">
                  <span className="card-subtitle">{service.subtitle}</span>
                  <div className={`icon-box ${service.icon}`}></div>
                </div>
                <div className="card-bottom">
                  <h2>{service.title}</h2>
                  <p>{service.description}</p>
                  <div className="arrow-btn">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M12 5L19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <footer className="main-footer">
          <div className="status-indicator">
            <span className="blink"></span> System Operational
          </div>
          <div className="copyright">
            © 2026 InfiniteTech AI.
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
