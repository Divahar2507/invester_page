import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashShell from '../components/DashShell.jsx';

const SearchIcon = () => (
  <svg width="20" height="20" fill="none" stroke="#94a3b8" strokeWidth="2" viewBox="0 0 24 24">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const FilterIcon = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
  </svg>
);

const dummyOpportunities = [
  { id: 1, name: 'Apex Ventures', description: 'Early-stage VC fund focusing on B2B SaaS and AI.', tags: ['Trending', 'B2B', 'SaaS'], location: 'San Francisco, CA', stage: 'Seed to Series A' },
  { id: 2, name: 'Horizon Capital', description: 'Global investment firm targeting fintech and blockchain startups.', tags: ['Fintech', 'Blockchain'], location: 'New York, NY', stage: 'Series A & B' },
  { id: 3, name: 'GreenFuture Innovations', description: 'Impact investor funding sustainable energy and climate tech.', tags: ['Climate Tech', 'Clean Energy'], location: 'Berlin, Germany', stage: 'Seed' },
  { id: 4, name: 'Quantum Leap', description: 'Deep tech fund investing in quantum computing and advanced materials.', tags: ['Deep Tech', 'Quantum'], location: 'Boston, MA', stage: 'Series A+' },
  { id: 5, name: 'NextGen Health', description: 'Investing in the future of digital health and personalized medicine.', tags: ['Digital Health', 'MedTech'], location: 'London, UK', stage: 'Seed to Series A' },
  { id: 6, name: 'CyberGuardian Fund', description: 'Specialized fund for cybersecurity and data privacy startups.', tags: ['Cybersecurity', 'B2B'], location: 'Tel Aviv, Israel', stage: 'Series A' },
];

export default function Opportunities() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const filteredOpportunities = dummyOpportunities.filter(opp =>
    opp.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashShell>
      <div className="dash-content" style={{ padding: "32px 40px" }}>
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 28, margin: "0 0 8px 0", color: "#0f172a" }}>Investment Opportunities</h1>
          <p style={{ color: "#64748b", margin: 0 }}>Discover and connect with leading investors and funds.</p>
        </div>

        <div style={{ display: "flex", gap: 16, marginBottom: 32 }}>
          <div style={{ position: "relative", flex: 1 }}>
            <div style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", display: "grid", placeItems: "center" }}>
              <SearchIcon />
            </div>
            <input
              placeholder="Search investors, funds, or keywords..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: "100%", height: 48, paddingLeft: 40, paddingRight: 16, border: "1px solid #e2e8f0", borderRadius: 8, fontSize: 14, outline: "none" }}
            />
          </div>
          <button style={{ height: 48, padding: "0 20px", background: "#fff", border: "1px solid #e2e8f0", borderRadius: 8, fontWeight: 600, color: "#334155", display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
            <FilterIcon /> Filters
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 24 }}>
          {filteredOpportunities.map(opp => (
            <div key={opp.id} style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: 24, display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                <div style={{ width: 48, height: 48, backgroundColor: '#f1f5f9', borderRadius: 8 }}></div>
                {opp.tags.includes('Trending') && (
                  <span style={{ background: '#eff6ff', color: '#1d4ed8', fontSize: 12, fontWeight: 700, padding: '4px 10px', borderRadius: 20, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span style={{width: 6, height: 6, backgroundColor: '#1d4ed8', borderRadius: '50%'}}></span> Trending
                  </span>
                )}
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 700, margin: "0 0 8px 0", color: "#0f172a" }}>{opp.name}</h3>
              <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.5, margin: "0 0 16px 0", flex: 1 }}>{opp.description}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
                {opp.tags.filter(t => t !== 'Trending').map(tag => (
                  <span key={tag} style={{ background: "#f1f5f9", padding: "4px 10px", borderRadius: 6, fontSize: 12, color: "#475569", fontWeight: 600 }}>{tag}</span>
                ))}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#64748b', marginBottom: 24, borderTop: '1px solid #f1f5f9', paddingTop: 16 }}>
                <span>📍 {opp.location}</span>
                <span>💰 {opp.stage}</span>
              </div>
              <button
                onClick={() => navigate(`/investor/${opp.id}`)}
                style={{ width: '100%', padding: '12px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, fontWeight: 700, color: "#0f172a", cursor: "pointer", transition: 'background-color 0.2s' }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
              >
                View Profile
              </button>
            </div>
          ))}
        </div>
      </div>
    </DashShell>
  );
}