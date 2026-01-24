import React from 'react';
import './App.css';

const App = () => {
  const openApp = (url) => {
    window.open(url, '_blank');
  };

  const services = [
    {
      title: "Investor & Startup",
      description: "Pitch ideas, find investors, and manage your portfolio in one unified platform.",
      url: "http://localhost",
      icon: "🚀",
      type: "investor"
    },
    {
      title: "Investor Portal",
      description: "Discover the next unicorn. Manage your portfolio and watchlist.",
      url: "http://localhost/?view=investor",
      icon: "💎",
      type: "investor"
    },
    {
      title: "LeadGen Engine",
      description: "AI-powered lead generation and marketing automation tools.",
      url: "http://localhost:3003",
      icon: "🎯",
      type: "leadgen"
    },
    {
      title: "Connector",
      description: "Seamlessly connect and collaborate with the ecosystem.",
      url: "http://localhost:3005/connector",
      icon: "🔗",
      type: "connector"
    },
    {
      title: "Events",
      description: "Join upcoming webinars, demo days, and networking sessions.",
      url: "http://localhost:3004/events", // Assuming Events is part of Admin or Generic
      icon: "📅",
      type: "events"
    },
    {
      title: "Super Admin",
      description: "System oversight, user management, and AI configurations.",
      url: "http://localhost:3004",
      icon: "🛡️",
      type: "admin"
    }
  ];

  return (
    <div className="main-wrapper">
      <div className="background-glow">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
      </div>

      <div className="container">
        <header>
          <h1>Innovation Ecosystem</h1>
          <p className="subtitle">
            A unified platform connecting startups, investors, and resources.
            Access all your tools from one central hub.
          </p>
        </header>

        <div className="app-grid">
          {services.map((service, index) => (
            <div
              key={index}
              className={`card ${service.type}`}
              onClick={() => openApp(service.url)}
            >
              <div className="card-icon">{service.icon}</div>
              <div>
                <h2>{service.title}</h2>
                <p>{service.description}</p>
              </div>
              <div className="card-action">
                Launch App <span>→</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
