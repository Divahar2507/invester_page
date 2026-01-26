import React from 'react';
import { Sparkles, Users, ArrowRight, TrendingUp } from 'lucide-react';
import './Hero.css';

const Hero = () => {
  return (
    <section className="hero-section">
      <div className="hero-content">
        <div className="badge-pill">
          <Sparkles size={16} className="text-primary" />
          <span>The #1 Platform for Startup Funding</span>
        </div>
        
        <h1 className="hero-title">
          Fund the next big <br />
          <span className="text-gradient">Startup Idea 🚀</span>
        </h1>
        
        <p className="hero-subtitle">
          From groundbreaking research to scalable growth, empower innovators directly. 
          Choose your impact, track progress, and be part of the future.
        </p>

        <div className="hero-actions">
          <button className="btn btn-primary">
            Start Funding
            <ArrowRight size={18} />
          </button>
          <button className="btn btn-secondary">
            <TrendingUp size={18} />
            View Top Startups
          </button>
        </div>

        <div className="hero-stats">
          <div className="stat-item">
            <h3>₹240Cr+</h3>
            <p>Raised</p>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <h3>1.2k+</h3>
            <p>Startups</p>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <h3>85k+</h3>
            <p>Investors</p>
          </div>
        </div>
      </div>
      
      {/* Visual background elements */}
      <div className="hero-glow glow-1"></div>
      <div className="hero-glow glow-2"></div>
    </section>
  );
};

export default Hero;
