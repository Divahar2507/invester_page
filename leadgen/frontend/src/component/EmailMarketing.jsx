// frontend/src/component/EmailMarketing.jsx
import React, { useEffect, useState } from 'react';
import { Shield, Zap, Target } from 'lucide-react';

const DEFAULT_PERSONAS = ['CTO', 'Marketing Manager', 'Sales Director'];

function EmailMarketing({
  icps,
  selectedIcpId,
  onSelectIcp,
  matchesByIcp,
  loadMatches,
  userId,
}) {
  const [loadingLeads, setLoadingLeads] = useState(false);
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState(null);

  // persona selection for suggestions
  const [activePersona, setActivePersona] = useState(DEFAULT_PERSONAS[0]);
  const [personaInsights, setPersonaInsights] = useState([]);
  const [loadingInsights, setLoadingInsights] = useState(false);

  // Offer basics
  const [offerTitle, setOfferTitle] = useState('');
  const [targetAudience, setTargetAudience] = useState('SaaS Founders');

  // PIO framework
  const [pain, setPain] = useState('');
  const [implication, setImplication] = useState('');
  const [outcome, setOutcome] = useState('');

  // Ensure an ICP is selected


  const matches = matchesByIcp[selectedIcpId] || [];
  const currentIcp = icps.find((i) => i.id === selectedIcpId);

  // Load lead matches (once per ICP, using cache from App)
  useEffect(() => {
    const run = async () => {
      if (!selectedIcpId) return;
      if (matchesByIcp[selectedIcpId]) return;
      setLoadingLeads(true);
      await loadMatches(selectedIcpId);
      setLoadingLeads(false);
    };
    run();
  }, [selectedIcpId, matchesByIcp, loadMatches]);

  // Load persona insights for (icpId, persona).
  // If none exist yet, trigger /api/leads/:id/matches once, then reload.
  useEffect(() => {
    const load = async () => {
      if (!selectedIcpId || !activePersona) {
        setPersonaInsights([]);
        return;
      }

      setLoadingInsights(true);
      try {
        let res = await fetch(
          `http://localhost:8003/api/insights/${encodeURIComponent(
            activePersona
          )}?icpId=${selectedIcpId}`
        );
        if (!res.ok) {
          console.error('Failed to load persona insights', res.status, await res.text());
          setLoadingInsights(false);
          return;
        }
        let data = await res.json();

        // If no insights yet, run matches (which also generates persona_insights)
        if (!data.length) {
          await loadMatches(selectedIcpId);
          res = await fetch(
            `http://localhost:8003/api/insights/${encodeURIComponent(
              activePersona
            )}?icpId=${selectedIcpId}`
          );
          if (!res.ok) {
            console.error(
              'Failed to reload persona insights',
              res.status,
              await res.text()
            );
            setLoadingInsights(false);
            return;
          }
          data = await res.json();
        }

        setPersonaInsights(data);
      } catch (e) {
        console.error('Error loading persona insights', e);
      }
      setLoadingInsights(false);
    };

    load();
  }, [selectedIcpId, activePersona, loadMatches]);

  // Split insights into pains and outcomes
  const painOptions = personaInsights.filter((i) => i.type === 'pain_point');
  const outcomeOptions = personaInsights.filter((i) => i.type === 'outcome');

  // Suggestion handlers
  const handleSelectPain = (item) => {
    // Use title as pain, include more detail if desired
    setPain(item.title || '');

    // Only generate implication if user hasn’t already filled one
    if (!implication) {
      const desc = (item.description || '').trim();
      if (desc) {
        setImplication(
          `This creates problems like ${desc
            .charAt(0)
            .toLowerCase()}${desc.slice(1)}`
        );
      } else {
        setImplication(
          'This creates compounding risk, wasted effort, and missed revenue opportunities.'
        );
      }
    }

    // If outcome blank, pick the top outcome suggestion
    if (!outcome && outcomeOptions.length) {
      const top = outcomeOptions[0];
      setOutcome(top.title || top.description || '');
    }
  };

  const handleSelectOutcome = (item) => {
    setOutcome(item.title || item.description || '');
  };

  // AI Generated Content
  const [generatedEmail, setGeneratedEmail] = useState(null);
  const [generating, setGenerating] = useState(false);

  const handleGenerateAI = async () => {
    if (!currentIcp || !activePersona) {
      alert("Please select an ICP and Persona first.");
      return;
    }
    setGenerating(true);
    try {
      const res = await fetch('http://localhost:8003/api/email/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          icpName: currentIcp.profile_name,
          persona: activePersona,
          painPoint: pain || "pain points",
          implication: implication,
          outcome: outcome,
          companyName: "LeadGen AI"
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setGeneratedEmail(data);
      }
    } catch (e) {
      console.error("AI Generation failed", e);
    }
    setGenerating(false);
  };

  // Email subject and body (with tokens)
  const derivedSubject =
    offerTitle?.trim() !== ''
      ? `${offerTitle} for {{company}}`
      : 'Quick idea for {{company}}';

  const derivedBody = [
    `Hey {{firstName}},`,
    '',
    pain
      ? `I noticed many ${targetAudience} struggle with ${pain}.`
      : `I noticed many ${targetAudience} are looking for ways to grow more predictably.`,
    '',
    implication
      ? `This usually leads to ${implication}.`
      : 'This makes it hard to hit growth targets consistently.',
    '',
    outcome
      ? `We’ve put together an offer that helps you achieve ${outcome}.`
      : 'We’ve put together an offer specifically designed to improve pipeline quality and conversion.',
    '',
    'Would you be open to a quick chat?',
    '',
    'Best,',
    '[Your Name]',
  ].join('\n');

  const emailSubject = generatedEmail ? generatedEmail.subject : derivedSubject;
  const emailBody = generatedEmail ? generatedEmail.body : derivedBody;

  // Load draft from localStorage on mount
  useEffect(() => {
    const draft = localStorage.getItem('emailMarketingDraft');
    if (draft) {
      try {
        const parsed = JSON.parse(draft);
        if (parsed.offerTitle) setOfferTitle(parsed.offerTitle);
        if (parsed.targetAudience) setTargetAudience(parsed.targetAudience);
        if (parsed.pain) setPain(parsed.pain);
        if (parsed.implication) setImplication(parsed.implication);
        if (parsed.outcome) setOutcome(parsed.outcome);
        if (parsed.activePersona) setActivePersona(parsed.activePersona);
      } catch (e) {
        console.error('Failed to load draft', e);
      }
    }
  }, []);

  const handleSaveDraft = () => {
    const draft = {
      offerTitle,
      targetAudience,
      pain,
      implication,
      outcome,
      activePersona
    };
    localStorage.setItem('emailMarketingDraft', JSON.stringify(draft));
    alert("Draft saved successfully!");
  };

  const handlePublish = async () => {
    if (!selectedIcpId) {
      alert('Please select an ICP first.');
      return;
    }

    const leadsWithEmail = (matchesByIcp[selectedIcpId] || []).filter(
      (l) => l.email
    );

    if (!leadsWithEmail.length) {
      alert('No leads with email available for this ICP/Limit.');
      return;
    }

    setSending(true);
    setResult(null);
    try {
      const res = await fetch('http://localhost:8003/api/email/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,               // <-- required by backend
          subject: emailSubject,
          bodyTemplate: emailBody,
          leads: leadsWithEmail,
        }),
      });

      if (!res.ok) {
        console.error('Publish failed', res.status, await res.text());
        setResult({ error: 'Failed to send emails.' });
      } else {
        const data = await res.json();
        setResult(data); // { sent, skipped, ... }
      }
    } catch (e) {
      console.error('Publish error', e);
      setResult({ error: 'Failed to send emails.' });
    }
    setSending(false);
  };

  return (
    <div className="table-card" style={{ padding: 24 }}>
      {/* Header */}
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 24,
        }}
      >
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 4 }}>
            Create New Offer
          </h1>
          <p style={{ color: '#64748b', maxWidth: 600 }}>
            Build your value proposition using the Pain → Implication → Outcome
            framework, then publish a personalized email to your lead list.
            (Uses leads currently filtered/limited in the Leads tab)
          </p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button
            className="btn-secondary"
            type="button"
            onClick={handleSaveDraft}
            style={{ cursor: 'pointer' }}
          >
            Save Draft
          </button>
          <button
            className="btn-primary"
            type="button"
            onClick={handlePublish}
            disabled={sending}
            style={{ backgroundColor: '#16a34a', borderColor: '#16a34a' }}
          >
            {sending ? 'Publishing…' : 'Publish Offer'}
          </button>
        </div>
      </header>

      {/* ICP Selector */}
      <div style={{ marginBottom: 12 }}>
        <label
          style={{
            display: 'block',
            fontSize: 12,
            fontWeight: 600,
            color: '#64748b',
            marginBottom: 4,
          }}
        >
          Select ICP
        </label>
        <select
          value={selectedIcpId || ''}
          onChange={(e) =>
            onSelectIcp(e.target.value ? Number(e.target.value) : null)
          }
          style={{
            width: 260,
            padding: '8px 10px',
            borderRadius: 8,
            border: '1px solid #e2e8f0',
            fontSize: 13,
          }}
        >
          <option value="">Choose ICP...</option>
          {icps.map((icp) => (
            <option key={icp.id} value={icp.id}>
              {icp.profile_name} ({icp.industry})
            </option>
          ))}
        </select>
        {loadingLeads && <p style={{ marginTop: 4 }}>Loading lead list…</p>}
        {!loadingLeads && currentIcp && matches.length > 0 && (
          <p style={{ marginTop: 4, fontSize: 12, color: '#64748b' }}>
            Sending to {matches.length} recommended companies for this ICP.
          </p>
        )}
      </div>

      {/* Persona Tabs for suggestions */}
      <div
        style={{
          display: 'flex',
          gap: '24px',
          borderBottom: '1px solid #e2e8f0',
          paddingBottom: 8,
          marginBottom: 16,
        }}
      >
        {DEFAULT_PERSONAS.map((p) => {
          const isActive = activePersona === p;
          return (
            <button
              key={p}
              onClick={() => setActivePersona(p)}
              style={{
                padding: '8px 0',
                border: 'none',
                background: 'none',
                color: isActive ? '#2563eb' : '#64748b',
                fontWeight: '700',
                fontSize: '14px',
                borderBottom: isActive
                  ? '3px solid #2563eb'
                  : '3px solid transparent',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              {p === 'CTO' && <Shield size={16} />}
              {p === 'Marketing Manager' && <Zap size={16} />}
              {p === 'Sales Director' && <Target size={16} />}
              {p}
            </button>
          );
        })}
      </div>

      {loadingInsights && (
        <p style={{ color: '#64748b', marginBottom: 8 }}>
          Loading persona suggestions…
        </p>
      )}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 1fr)',
          gap: 24,
          marginTop: 8,
        }}
      >
        {/* LEFT: Offer basics + PIO framework + Suggestions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Offer Basics */}
          <div
            style={{
              padding: 16,
              borderRadius: 12,
              border: '1px solid #e2e8f0',
              background: '#f8fafc',
            }}
          >
            <h3
              style={{
                fontSize: 14,
                fontWeight: 700,
                marginBottom: 12,
              }}
            >
              1. Offer Basics
            </h3>
            <div style={{ display: 'flex', gap: 12 }}>
              <div style={{ flex: 1 }}>
                <label
                  htmlFor="offerTitle"
                  style={{
                    display: 'block',
                    fontSize: 12,
                    fontWeight: 600,
                    marginBottom: 4,
                    color: '#64748b',
                  }}
                >
                  Internal Offer Title
                </label>
                <input
                  id="offerTitle"
                  value={offerTitle}
                  onChange={(e) => setOfferTitle(e.target.value)}
                  placeholder="e.g., Q4 Enterprise Audit"
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: 8,
                    border: '1px solid #e2e8f0',
                    fontSize: 13,
                  }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: 12,
                    fontWeight: 600,
                    marginBottom: 4,
                    color: '#64748b',
                  }}
                >
                  Target Audience
                </label>
                <input
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  placeholder="e.g., SaaS Founders"
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: 8,
                    border: '1px solid #e2e8f0',
                    fontSize: 13,
                  }}
                />
              </div>
            </div>
          </div>

          {/* PIO Framework */}
          <div
            style={{
              padding: 16,
              borderRadius: 12,
              border: '1px solid #e2e8f0',
              background: '#ffffff',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <h3
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  margin: 0,
                }}
              >
                2. PIO Framework
              </h3>
              <button
                onClick={handleGenerateAI}
                disabled={generating}
                style={{
                  fontSize: 12,
                  padding: '4px 8px',
                  borderRadius: 6,
                  border: '1px solid #3b82f6',
                  color: '#fbbf24',
                  backgroundColor: '#1e293b',
                  cursor: generating ? 'not-allowed' : 'pointer'
                }}>
                {generating ? '✨ Generating...' : '✨ Generate with AI'}
              </button>
            </div>

            <div style={{ marginBottom: 12 }}>
              <label
                style={{
                  display: 'block',
                  fontSize: 12,
                  fontWeight: 600,
                  marginBottom: 4,
                  color: '#64748b',
                }}
              >
                1. Pain Point
              </label>
              <textarea
                value={pain}
                onChange={(e) => setPain(e.target.value)}
                placeholder="Search or type a pain point (e.g., high churn rates)"
                rows={2}
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  borderRadius: 8,
                  border: '1px solid #e2e8f0',
                  fontSize: 13,
                  resize: 'vertical',
                }}
              />
              {painOptions.length > 0 && (
                <div
                  style={{
                    marginTop: 6,
                    display: 'flex',
                    gap: 6,
                    flexWrap: 'wrap',
                  }}
                >
                  {painOptions.slice(0, 5).map((pItem) => (
                    <button
                      key={pItem.id}
                      type="button"
                      onClick={() => handleSelectPain(pItem)}
                      style={{
                        border: '1px solid #e2e8f0',
                        borderRadius: 999,
                        padding: '4px 8px',
                        fontSize: 11,
                        background: '#f8fafc',
                        cursor: 'pointer',
                      }}
                    >
                      {pItem.title}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div style={{ marginBottom: 12 }}>
              <label
                style={{
                  display: 'block',
                  fontSize: 12,
                  fontWeight: 600,
                  marginBottom: 4,
                  color: '#64748b',
                }}
              >
                2. Implication (Why it hurts)
              </label>
              <textarea
                value={implication}
                onChange={(e) => setImplication(e.target.value)}
                placeholder="Describe the negative impact if this isn’t solved…"
                rows={3}
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  borderRadius: 8,
                  border: '1px solid #e2e8f0',
                  fontSize: 13,
                  resize: 'vertical',
                }}
              />
            </div>

            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: 12,
                  fontWeight: 600,
                  marginBottom: 4,
                  color: '#64748b',
                }}
              >
                3. Desired Outcome
              </label>
              <textarea
                value={outcome}
                onChange={(e) => setOutcome(e.target.value)}
                placeholder="What is the dream result? (e.g., reduce churn by 15%)"
                rows={2}
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  borderRadius: 8,
                  border: '1px solid #e2e8f0',
                  fontSize: 13,
                  resize: 'vertical',
                }}
              />
              {outcomeOptions.length > 0 && (
                <div
                  style={{
                    marginTop: 6,
                    display: 'flex',
                    gap: 6,
                    flexWrap: 'wrap',
                  }}
                >
                  {outcomeOptions.slice(0, 5).map((oItem) => (
                    <button
                      key={oItem.id}
                      type="button"
                      onClick={() => handleSelectOutcome(oItem)}
                      style={{
                        border: '1px solid #e2e8f0',
                        borderRadius: 999,
                        padding: '4px 8px',
                        fontSize: 11,
                        background: '#ecfdf5',
                        cursor: 'pointer',
                      }}
                    >
                      {oItem.title}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT: Email preview */}
        <div
          style={{
            padding: 16,
            borderRadius: 12,
            border: '1px solid #e2e8f0',
            background: '#0f172a',
            color: '#e5e7eb',
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <h3 style={{ fontSize: 14, fontWeight: 700 }}>Email Preview</h3>
            <span style={{ fontSize: 11, color: '#9ca3af' }}>
              To: &lt;lead email&gt;
            </span>
          </div>

          <div
            style={{
              background: '#020617',
              borderRadius: 8,
              padding: 16,
              minHeight: 220,
              fontFamily: 'system-ui, sans-serif',
              fontSize: 13,
              whiteSpace: 'pre-wrap',
            }}
          >
            <div style={{ color: '#e5e7eb', marginBottom: 8 }}>
              <strong>Subject:</strong> {emailSubject}
            </div>
            <div style={{ borderTop: '1px solid #1f2937', marginBottom: 8 }} />
            <div>{emailBody}</div>
          </div>

          {result && (
            <div
              style={{
                marginTop: 8,
                padding: 8,
                borderRadius: 6,
                fontSize: 12,
                background: result.error ? '#fee2e2' : '#ecfdf5',
                color: result.error ? '#b91c1c' : '#166534',
              }}
            >
              {result && !result.error && (
                <span>
                  Emails sent: {result.sent}, skipped (no email): {result.skipped}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default EmailMarketing;