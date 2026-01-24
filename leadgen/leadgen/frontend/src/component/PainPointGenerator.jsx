// frontend/src/component/PainPointGenerator.jsx
import React, { useState, useEffect } from 'react';
import PersonaMapping from './PersonaMapping';

const PainPointGenerator = ({ selectedIcp }) => {
  const [formData, setFormData] = useState({ industry: '', persona: '' });

  useEffect(() => {
    if (selectedIcp) {
      setFormData({
        industry: selectedIcp.industry || '',
        persona: selectedIcp.profile_name || '' // Mapping profile_name to persona as closest match
      });
    }
  }, [selectedIcp]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!formData.industry || !formData.persona) {
      alert('Please enter both industry and persona.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('http://localhost:8003/api/insights/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        console.error('Backend error:', res.status, await res.text());
        setLoading(false);
        return;
      }

      const data = await res.json();
      setResults(data);
    } catch (error) {
      console.error('Generation failed:', error);
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', gap: 24 }}>
        {/* Input Panel */}
        <div
          className="table-card"
          style={{
            flex: 1,
            maxWidth: 400,
            padding: 24,
            height: 'fit-content'
          }}
        >
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>Define your Target</h2>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#64748b', marginBottom: 4 }}>Industry</label>
            <input
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: 8,
                border: '1px solid #e2e8f0',
                fontSize: 14
              }}
              placeholder="e.g. SaaS, FinTech, Healthcare"
              value={formData.industry}
              onChange={(e) =>
                setFormData((f) => ({ ...f, industry: e.target.value }))
              }
            />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#64748b', marginBottom: 4 }}>Persona</label>
            <input
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: 8,
                border: '1px solid #e2e8f0',
                fontSize: 14
              }}
              placeholder="e.g. CTO, Marketing Manager"
              value={formData.persona}
              onChange={(e) =>
                setFormData((f) => ({ ...f, persona: e.target.value }))
              }
            />
          </div>

          <button
            onClick={handleGenerate}
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center' }}
            disabled={loading}
          >
            {loading ? 'Generating...' : '✨ Generate Insights'}
          </button>
        </div>

        {/* Results Panel */}
        <div style={{ flex: 2 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Suggested Insights (from backend)</h3>
          {results.length === 0 && (
            <p style={{ fontSize: 14, color: '#9ca3af' }}>
              No insights yet. Enter an industry and persona, then click
              &quot;Generate Insights&quot;.
            </p>
          )}
          {results.map((item) => (
            <div
              key={item.id}
              style={{
                background: '#ffffff',
                padding: 16,
                borderRadius: 12,
                border: '1px solid #e2e8f0',
                marginBottom: 12,
                boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
              }}
            >
              <h4 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>{item.title}</h4>
              <p style={{ fontSize: 14, color: '#4b5563', lineHeight: 1.5 }}>{item.description}</p>
              <p style={{ fontSize: 12, color: '#9ca3af', marginTop: 8 }}>
                Type: {item.type} · Relevance: {item.relevance_score}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Persona Mapping UI – only show once we have generated insights */}
      {results.length > 0 && <PersonaMapping persona={formData.persona} />}
    </div>
  );
};

export default PainPointGenerator;