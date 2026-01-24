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
      title: "Investor & Startup",
      subtitle: "The Core Platform",
      description: "Pitch ideas, secure funding, and manage portfolios in one unified ecosystem of innovation.",
      url: "http://localhost",
      icon: "rocket",
      theme: "cyan",
      gridArea: "hero"
    },
    {
      id: 'connector',
      title: "Connector",
      subtitle: "Strategic Partnerships",
      description: "Seamlessly connect and collaborate with the entire business network.",
      url: "http://localhost:3005",
      icon: "link",
      theme: "violet",
      gridArea: "tall"
    },
    {
      id: 'leadgen',
      title: "LeadGen Engine",
      subtitle: "Growth Automation",
      description: "AI-powered market analysis and automated lead generation tools.",
      url: "http://localhost:3003",
      icon: "target",
      theme: "amber",
      gridArea: "box1"
    },
    {
      id: 'events',
      title: "Events",
      subtitle: "Community",
      description: "Webinars & Demo Days.",
      url: "http://localhost:3006",
      icon: "calendar",
      theme: "pink",
      gridArea: "box2"
    },
    {
      id: 'admin',
      title: "Super Admin",
      subtitle: "System Control",
      description: "Global settings & oversight.",
      url: "http://localhost:3004",
      icon: "shield",
      theme: "red",
      gridArea: "wide"
    }
  ];

  return (
    <div className="universe-container">
      <div className="stars"></div>
      <div className="nebula"></div>

      <div className="content-wrapper">
        <header className="main-header">
          <div className="logo-badge">ECOSYSTEM v2.0</div>
          <h1>
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
            © 2026 BusinessDevelopment Inc.
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
