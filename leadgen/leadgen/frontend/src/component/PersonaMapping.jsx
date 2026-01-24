// frontend/src/component/PersonaMapping.jsx
import React, { useEffect, useMemo, useState } from 'react';
import {
  Search,
  RotateCcw,
  Save,
  Shield,
  Zap,
  Target,
  BarChart3,
  XCircle,
  Trash2,
} from 'lucide-react';

const DEFAULT_PERSONAS = ['CTO', 'Marketing Manager', 'Sales Director'];

const PersonaMapping = ({ icps, selectedIcpId, onSelectIcp }) => {
  const [extraPersonas, setExtraPersonas] = useState([]);
  const personas = useMemo(
    () => [...DEFAULT_PERSONAS, ...extraPersonas],
    [extraPersonas]
  );
  const [activePersona, setActivePersona] = useState(DEFAULT_PERSONAS[0]);

  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(false);

  // Custom insight form
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [customType, setCustomType] = useState('pain_point');
  const [customTitle, setCustomTitle] = useState('');
  const [customDescription, setCustomDescription] = useState('');
  const [savingCustom, setSavingCustom] = useState(false);

  // Add persona form
  const [newPersona, setNewPersona] = useState('');



  const currentIcp = useMemo(
    () => icps.find((i) => i.id === selectedIcpId) || null,
    [icps, selectedIcpId]
  );

  // Load extra personas from backend (optional)
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('http://localhost:8003/api/personas');
        if (!res.ok) return;
        const data = await res.json();
        const filtered = data.filter(
          (name) => !DEFAULT_PERSONAS.includes(name)
        );
        setExtraPersonas(filtered);
      } catch (e) {
        console.error('Error fetching personas', e);
      }
    };
    load();
  }, []);

  // Load insights for (icpId, persona). If none, trigger /matches once, then reload.
  useEffect(() => {
    const loadInsights = async () => {
      if (!selectedIcpId || !activePersona) {
        setInsights([]);
        return;
      }

      setLoading(true);
      try {
        let res = await fetch(
          `http://localhost:8003/api/insights/${encodeURIComponent(
            activePersona
          )}?icpId=${selectedIcpId}`
        );
        if (!res.ok) {
          console.error(
            'Failed to load insights',
            res.status,
            await res.text()
          );
          setLoading(false);
          return;
        }

        let data = await res.json();

        if (!data.length) {
          // No insights yet: call /matches (which also generates persona_insights for this ICP)
          const matchesRes = await fetch(
            `http://localhost:8003/api/leads/${selectedIcpId}/matches`
          );
          if (!matchesRes.ok) {
            console.error(
              'Failed to analyze ICP',
              matchesRes.status,
              await matchesRes.text()
            );
            setLoading(false);
            return;
          }

          // Reload insights
          res = await fetch(
            `http://localhost:8003/api/insights/${encodeURIComponent(
              activePersona
            )}?icpId=${selectedIcpId}`
          );
          if (!res.ok) {
            console.error(
              'Failed to reload insights',
              res.status,
              await res.text()
            );
            setLoading(false);
            return;
          }
          data = await res.json();
        }

        setInsights(data);
      } catch (e) {
        console.error('Error loading insights', e);
      }
      setLoading(false);
    };

    loadInsights();
  }, [selectedIcpId, activePersona]);

  /* ---------------------------- Mapping helpers ---------------------------- */

  const [saveStatus, setSaveStatus] = useState('idle'); // idle, saving, saved

  const handleMap = (id) => {
    setInsights((prev) =>
      prev.map((i) => (i.id === id ? { ...i, status: 'mapped' } : i))
    );
    setSaveStatus('idle'); // Reset to allow saving again if modified
  };

  const handleUnmap = (id) => {
    setInsights((prev) =>
      prev.map((i) => (i.id === id ? { ...i, status: 'unassigned' } : i))
    );
    setSaveStatus('idle');
  };

  const handleResetLocal = () => {
    setInsights((prev) => prev.map((i) => ({ ...i, status: 'unassigned' })));
    setSaveStatus('idle');
  };

  const handleSaveMapping = async () => {
    if (!insights.length) return;

    setSaveStatus('saving');
    try {
      const updates = insights.map((i) => ({
        id: i.id,
        status: i.status || 'unassigned',
      }));

      const res = await fetch(
        'http://localhost:8003/api/insights/bulk-status',
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ updates }),
        }
      );

      if (!res.ok) {
        console.error('Save mapping failed', res.status, await res.text());
        setSaveStatus('idle'); // or error
        return;
      }

      setSaveStatus('saved');

      // Revert back to 'Save Mapping' after 2 seconds
      setTimeout(() => {
        setSaveStatus('idle');
      }, 2000);

    } catch (e) {
      console.error('Error saving mapping', e);
      setSaveStatus('idle');
    }
  };

  // Delete single insight
  const handleDeleteInsight = async (id) => {
    const confirmDelete = window.confirm(
      'Delete this insight permanently from this ICP?'
    );
    if (!confirmDelete) return;

    try {
      const res = await fetch(`http://localhost:8003/api/insights/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok && res.status !== 204) {
        console.error('Failed to delete insight', res.status, await res.text());
        return;
      }
      setInsights((prev) => prev.filter((i) => i.id !== id));
    } catch (e) {
      console.error('Error deleting insight', e);
    }
  };

  // Add All: map all unassigned items
  const handleAddAll = () => {
    setInsights((prev) =>
      prev.map((i) =>
        i.status === 'unassigned' ? { ...i, status: 'mapped' } : i
      )
    );
  };

  /* ---------------------------- Personas helpers --------------------------- */

  const handleAddPersona = async () => {
    const name = newPersona.trim();
    if (!name) return;
    if (personas.some((p) => p.toLowerCase() === name.toLowerCase())) {
      alert('Persona already exists.');
      return;
    }

    try {
      const res = await fetch('http://localhost:8003/api/personas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });

      if (!res.ok) {
        console.error('Failed to create persona', res.status, await res.text());
        return;
      }

      setExtraPersonas((prev) => [...prev, name]);
      setActivePersona(name);
      setNewPersona('');
    } catch (e) {
      console.error('Error creating persona', e);
    }
  };

  const handleDeletePersona = async (persona, event) => {
    event.stopPropagation();

    if (DEFAULT_PERSONAS.includes(persona)) {
      alert('Default personas cannot be deleted.');
      return;
    }
    const confirmDelete = window.confirm(
      `Delete persona "${persona}" and all its insights?`
    );
    if (!confirmDelete) return;

    try {
      const encodedName = encodeURIComponent(persona);
      const res = await fetch(
        `http://localhost:8003/api/personas/${encodedName}`,
        {
          method: 'DELETE',
        }
      );
      if (!res.ok && res.status !== 204) {
        console.error('Failed to delete persona', res.status, await res.text());
        return;
      }

      setExtraPersonas((prev) => prev.filter((p) => p !== persona));

      if (activePersona === persona) {
        const all = [...DEFAULT_PERSONAS, ...extraPersonas].filter(
          (p) => p !== persona
        );
        setActivePersona(all[0] || DEFAULT_PERSONAS[0]);
      }
    } catch (e) {
      console.error('Error deleting persona', e);
    }
  };

  /* -------------------------- Custom insight add --------------------------- */

  const handleAddCustomInsight = async () => {
    if (!selectedIcpId) {
      alert('Please select an ICP first.');
      return;
    }
    if (!customTitle.trim() || !customDescription.trim()) {
      alert('Please fill in title and description.');
      return;
    }

    setSavingCustom(true);
    try {
      const res = await fetch('http://localhost:8003/api/insights/custom', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          icpId: selectedIcpId,
          industry: currentIcp?.industry,
          persona: activePersona,
          title: customTitle,
          description: customDescription,
          type: customType,
        }),
      });

      if (!res.ok) {
        console.error(
          'Failed to create custom insight',
          res.status,
          await res.text()
        );
        setSavingCustom(false);
        return;
      }

      const created = await res.json();
      setInsights((prev) => [created, ...prev]);
      setCustomTitle('');
      setCustomDescription('');
      setShowCustomForm(false);
    } catch (e) {
      console.error('Error creating custom insight', e);
    }
    setSavingCustom(false);
  };

  /* ------------------------------- Derived UI ------------------------------ */

  const libraryItems = insights.filter((i) => i.status === 'unassigned');
  const painPoints = insights.filter(
    (i) => i.status === 'mapped' && i.type === 'pain_point'
  );
  const outcomes = insights.filter(
    (i) => i.status === 'mapped' && i.type === 'outcome'
  );

  const completeness =
    insights.length === 0
      ? 0
      : Math.round(
        ((painPoints.length + outcomes.length) / insights.length) * 100
      );

  const painPointTitles = insights
    .filter((i) => i.type === 'pain_point')
    .map((i) => i.title);

  let summaryText =
    'No insights yet. Select an ICP and persona to load automatically generated points.';
  if (painPointTitles.length && currentIcp) {
    const topTitles = painPointTitles.slice(0, 3);
    summaryText = `Key pain points for ${activePersona} in ${currentIcp.industry || 'this industry'
      }: ${topTitles.join(
        '; '
      )}. These represent where this ICP segment tends to lose time, money, or strategic momentum.`;
  }

  /* --------------------------------- Render -------------------------------- */

  return (
    <div
      style={{
        backgroundColor: '#f8fafc',
        padding: '32px',
        borderTop: '1px solid #e2e8f0',
        height: '100%',
        boxSizing: 'border-box',
        overflowY: 'auto',
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <p
          style={{
            fontSize: '12px',
            color: '#64748b',
            fontWeight: '500',
          }}
        >
          <span style={{ fontWeight: 700 }}>Pain Point Generator</span>
        </p>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '8px',
          }}
        >
          <h1
            style={{
              fontSize: '28px',
              fontWeight: '800',
              color: '#0f172a',
            }}
          >
            Persona Mapping Strategy
          </h1>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={handleResetLocal}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 16px',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                background: '#fff',
                color: '#475569',
                fontWeight: '600',
              }}
            >
              <RotateCcw size={18} /> Reset (local)
            </button>
            <button
              onClick={handleSaveMapping}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 16px',
                borderRadius: '8px',
                border: 'none',
                background: saveStatus === 'saved' ? '#16a34a' : '#0f766e',
                color: '#fff',
                fontWeight: '600',
                opacity: saveStatus === 'saving' ? 0.7 : 1,
                cursor: saveStatus === 'saving' ? 'wait' : 'pointer',
                transition: 'all 0.2s',
              }}
              disabled={!insights.length || saveStatus === 'saving'}
            >
              {saveStatus === 'saving' ? (
                <span>Saving...</span>
              ) : saveStatus === 'saved' ? (
                <span>Saved!</span>
              ) : (
                <>
                  <Save size={18} /> Save Mapping
                </>
              )}
            </button>
          </div>
        </div>
        <p style={{ color: '#64748b', marginTop: '4px' }}>
          Select an ICP, then choose a persona. The system automatically
          analyzes relevant companies and generates shared pain points and
          outcomes for you to map.
        </p>
      </div>

      {/* ICP Selector + Add Persona */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '24px',
          marginBottom: '16px',
        }}
      >
        {/* ICP selector (controlled by App) */}
        <div style={{ minWidth: 260 }}>
          <label
            style={{
              display: 'block',
              fontSize: '12px',
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
              width: '100%',
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
        </div>

        {/* Add Persona */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input
            value={newPersona}
            onChange={(e) => setNewPersona(e.target.value)}
            placeholder="Add new persona (e.g. CFO)"
            style={{
              width: '220px',
              padding: '8px 12px',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              fontSize: '13px',
            }}
          />
          <button
            onClick={handleAddPersona}
            style={{
              border: 'none',
              background: '#111827',
              color: '#fff',
              borderRadius: '999px',
              padding: '8px 14px',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Add Persona
          </button>
        </div>
      </div>

      {/* Persona Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '24px',
          borderBottom: '1px solid #e2e8f0',
          marginBottom: '16px',
        }}
      >
        {personas.map((p) => {
          const isActive = activePersona === p;
          const isDefault = DEFAULT_PERSONAS.includes(p);
          return (
            <div
              key={p}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <button
                onClick={() => setActivePersona(p)}
                style={{
                  padding: '12px 4px',
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
                  textTransform: 'capitalize',
                }}
              >
                {p === 'CTO' && <Shield size={16} />}
                {p === 'Marketing Manager' && <Zap size={16} />}
                {p === 'Sales Director' && <Target size={16} />}
                {p}
              </button>
              {!isDefault && (
                <button
                  onClick={(e) => handleDeletePersona(p, e)}
                  title="Delete persona"
                  style={{
                    border: 'none',
                    background: 'transparent',
                    padding: 0,
                    cursor: 'pointer',
                  }}
                >
                  <XCircle size={16} color="#9ca3af" />
                </button>
              )}
            </div>
          );
        })}
      </div>

      {loading && (
        <p style={{ color: '#64748b', marginBottom: '12px' }}>
          Loading insights for {activePersona}
          {currentIcp ? ` in ${currentIcp.profile_name}` : ''}…
        </p>
      )}

      {/* Summary */}
      <div
        style={{
          background: '#e0f2fe',
          borderRadius: '12px',
          padding: '12px 16px',
          marginBottom: '16px',
          border: '1px solid #bfdbfe',
        }}
      >
        <p
          style={{
            fontSize: '13px',
            color: '#1e3a8a',
            fontWeight: 500,
          }}
        >
          {summaryText}
        </p>
      </div>

      {/* Main Layout: Library + Workspace */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '300px 1fr',
          gap: '32px',
        }}
      >
        {/* Left: Library */}
        <div
          style={{
            background: '#fff',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            padding: '20px',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '16px',
            }}
          >
            <h3 style={{ fontSize: '16px', fontWeight: '700' }}>Library</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span
                style={{
                  color: '#94a3b8',
                  fontSize: '12px',
                  fontWeight: '600',
                }}
              >
                {insights.length} Items
              </span>
              <button
                onClick={handleAddAll}
                disabled={!libraryItems.length}
                style={{
                  border: 'none',
                  background: libraryItems.length ? '#4b5563' : '#e5e7eb',
                  color: libraryItems.length ? '#fff' : '#9ca3af',
                  borderRadius: '999px',
                  padding: '4px 10px',
                  fontSize: '11px',
                  fontWeight: 600,
                  cursor: libraryItems.length ? 'pointer' : 'default',
                }}
              >
                Add All
              </button>
            </div>
          </div>

          <div style={{ position: 'relative', marginBottom: '12px' }}>
            <Search
              style={{
                position: 'absolute',
                left: '12px',
                top: '10px',
                color: '#cbd5e1',
              }}
              size={16}
            />
            <input
              placeholder="Search (not wired yet)..."
              style={{
                width: '100%',
                padding: '10px 10px 10px 36px',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                fontSize: '14px',
              }}
            />
          </div>

          <p
            style={{
              fontSize: '11px',
              fontWeight: '800',
              color: '#cbd5e1',
              textTransform: 'uppercase',
              marginBottom: '8px',
            }}
          >
            Unassigned Items
          </p>

          {/* Add custom insight */}
          <div
            style={{
              padding: '10px 12px',
              borderRadius: '8px',
              border: '1px dashed #93c5fd',
              background: '#eff6ff',
              marginBottom: '12px',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '6px',
              }}
            >
              <div style={{ fontSize: '13px', color: '#1d4ed8' }}>
                Add a custom insight for this persona.
              </div>
              <button
                onClick={() => setShowCustomForm((s) => !s)}
                style={{
                  border: 'none',
                  background: '#1d4ed8',
                  color: '#fff',
                  borderRadius: '999px',
                  padding: '4px 10px',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                {showCustomForm ? 'Close' : 'New'}
              </button>
            </div>

            {showCustomForm && (
              <div>
                {/* Type selector */}
                <div
                  style={{
                    display: 'flex',
                    gap: '6px',
                    marginBottom: '6px',
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setCustomType('pain_point')}
                    style={{
                      flex: 1,
                      padding: '4px 6px',
                      borderRadius: '999px',
                      border:
                        customType === 'pain_point'
                          ? '1px solid #ef4444'
                          : '1px solid #e2e8f0',
                      background:
                        customType === 'pain_point' ? '#fee2e2' : '#ffffff',
                      fontSize: '11px',
                      fontWeight: 600,
                      color:
                        customType === 'pain_point' ? '#b91c1c' : '#64748b',
                      cursor: 'pointer',
                    }}
                  >
                    Pain Point
                  </button>
                  <button
                    type="button"
                    onClick={() => setCustomType('outcome')}
                    style={{
                      flex: 1,
                      padding: '4px 6px',
                      borderRadius: '999px',
                      border:
                        customType === 'outcome'
                          ? '1px solid #22c55e'
                          : '1px solid #e2e8f0',
                      background:
                        customType === 'outcome' ? '#dcfce7' : '#ffffff',
                      fontSize: '11px',
                      fontWeight: 600,
                      color:
                        customType === 'outcome' ? '#15803d' : '#64748b',
                      cursor: 'pointer',
                    }}
                  >
                    Desired Outcome
                  </button>
                </div>

                <input
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  placeholder="Title"
                  style={{
                    width: '100%',
                    padding: '6px 8px',
                    marginBottom: '6px',
                    borderRadius: '6px',
                    border: '1px solid #e2e8f0',
                    fontSize: '13px',
                  }}
                />
                <textarea
                  value={customDescription}
                  onChange={(e) => setCustomDescription(e.target.value)}
                  placeholder="Short description"
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '6px 8px',
                    borderRadius: '6px',
                    border: '1px solid #e2e8f0',
                    fontSize: '13px',
                    resize: 'vertical',
                  }}
                />
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    marginTop: '6px',
                    gap: '8px',
                  }}
                >
                  <button
                    onClick={() => {
                      setShowCustomForm(false);
                      setCustomTitle('');
                      setCustomDescription('');
                    }}
                    style={{
                      border: 'none',
                      background: 'transparent',
                      color: '#64748b',
                      fontSize: '12px',
                      cursor: 'pointer',
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddCustomInsight}
                    disabled={savingCustom}
                    style={{
                      border: 'none',
                      background: '#2563eb',
                      color: '#fff',
                      borderRadius: '999px',
                      padding: '4px 10px',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    {savingCustom ? 'Adding...' : 'Add'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {libraryItems.length === 0 && !insights.length && (
            <p style={{ fontSize: '13px', color: '#94a3b8' }}>
              No insights yet. Select an ICP and persona to auto‑generate
              insights for this segment.
            </p>
          )}

          {libraryItems.length === 0 && insights.length > 0 && (
            <p style={{ fontSize: '13px', color: '#94a3b8' }}>
              All items are currently mapped to this persona.
            </p>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {libraryItems.map((item) => (
              <LibraryItem
                key={item.id}
                label={item.title}
                description={item.description}
                type={item.type === 'pain_point' ? 'Pain Point' : 'Outcome'}
                onMap={() => handleMap(item.id)}
                onDelete={() => handleDeleteInsight(item.id)}
              />
            ))}
          </div>
        </div>

        {/* Right: Workspace */}
        <div
          style={{
            background: '#fff',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            padding: '32px',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '32px',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: '800' }}>
                  {activePersona.toLowerCase()}
                </h2>
                <span
                  style={{
                    fontSize: '12px',
                    padding: '4px 8px',
                    background: '#e2e8f0',
                    borderRadius: '4px',
                    fontWeight: '600',
                    color: '#475569',
                  }}
                >
                  Primary Decision Maker
                </span>
              </div>
              <p style={{ color: '#64748b', marginTop: '4px' }}>
                Map the most relevant pain points and outcomes to this persona
                for the selected ICP segment.
              </p>
            </div>
            <div style={{ width: '200px' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '4px',
                }}
              >
                <span
                  style={{
                    fontSize: '12px',
                    fontWeight: '700',
                    color: '#64748b',
                  }}
                >
                  Mapping Completeness
                </span>
                <span
                  style={{
                    fontSize: '12px',
                    fontWeight: '800',
                    color: '#2563eb',
                  }}
                >
                  {completeness}%
                </span>
              </div>
              <div
                style={{
                  width: '100%',
                  height: '8px',
                  background: '#e2e8f0',
                  borderRadius: '4px',
                }}
              >
                <div
                  style={{
                    width: `${completeness}%`,
                    height: '100%',
                    background: '#2563eb',
                    borderRadius: '4px',
                  }}
                ></div>
              </div>
            </div>
          </div>

          <div
            style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}
          >
            {/* Pain Points */}
            <div
              style={{
                border: '2px dashed #e2e8f0',
                borderRadius: '16px',
                padding: '24px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '16px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <div
                    style={{
                      background: '#fee2e2',
                      color: '#ef4444',
                      padding: '6px',
                      borderRadius: '6px',
                    }}
                  >
                    <Shield size={18} />
                  </div>
                  <h4 style={{ fontWeight: '700' }}>Pain Points</h4>
                  <span style={{ color: '#94a3b8' }}>{painPoints.length}</span>
                </div>
              </div>

              {painPoints.map((item) => (
                <WorkspaceCard
                  key={item.id}
                  label={item.title}
                  description={item.description}
                  tag="Pain Point"
                  color="#ef4444"
                  onUnmap={() => handleUnmap(item.id)}
                  onDelete={() => handleDeleteInsight(item.id)}
                />
              ))}

              {painPoints.length === 0 && (
                <p style={{ fontSize: '13px', color: '#cbd5e1' }}>
                  No mapped pain points. Click &quot;Map&quot; on items in the
                  Library to add them here.
                </p>
              )}
            </div>

            {/* Outcomes */}
            <div
              style={{
                border: '2px dashed #e2e8f0',
                borderRadius: '16px',
                padding: '24px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '16px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <div
                    style={{
                      background: '#dcfce7',
                      color: '#22c55e',
                      padding: '6px',
                      borderRadius: '6px',
                    }}
                  >
                    <BarChart3 size={18} />
                  </div>
                  <h4 style={{ fontWeight: '700' }}>Desired Outcomes</h4>
                  <span style={{ color: '#94a3b8' }}>{outcomes.length}</span>
                </div>
              </div>

              {outcomes.map((item) => (
                <WorkspaceCard
                  key={item.id}
                  label={item.title}
                  description={item.description}
                  tag="Outcome"
                  color="#22c55e"
                  onUnmap={() => handleUnmap(item.id)}
                  onDelete={() => handleDeleteInsight(item.id)}
                />
              ))}

              {outcomes.length === 0 && (
                <p style={{ fontSize: '13px', color: '#cbd5e1' }}>
                  No mapped outcomes. Click &quot;Map&quot; on items in the
                  Library to add them here.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ------------------------------ Helper cards ------------------------------ */

const LibraryItem = ({ label, description, type, onMap, onDelete }) => (
  <div
    style={{
      padding: '12px',
      border: '1px solid #e2e8f0',
      borderRadius: '8px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      gap: '8px',
    }}
  >
    <div style={{ flex: 1 }}>
      <div style={{ display: 'flex', gap: '6px', marginBottom: '4px' }}>
        <span
          style={{
            fontSize: '10px',
            fontWeight: '800',
            color: type === 'Pain Point' ? '#ef4444' : '#22c55e',
            background: type === 'Pain Point' ? '#fee2e2' : '#dcfce7',
            padding: '2px 4px',
            borderRadius: '4px',
            textTransform: 'uppercase',
          }}
        >
          {type}
        </span>
      </div>
      <p
        style={{
          fontSize: '13px',
          fontWeight: '600',
          color: '#111827',
        }}
      >
        {label}
      </p>
      {description && (
        <p
          style={{
            marginTop: 4,
            fontSize: '12px',
            color: '#6b7280',
          }}
        >
          {description}
        </p>
      )}
    </div>
    <div style={{ display: 'flex', gap: 6 }}>
      <button
        onClick={onMap}
        style={{
          fontSize: '11px',
          padding: '4px 8px',
          borderRadius: '6px',
          border: 'none',
          background: '#2563eb',
          color: '#fff',
          fontWeight: '600',
          cursor: 'pointer',
        }}
      >
        Map
      </button>
      <button
        onClick={onDelete}
        title="Delete"
        style={{
          border: 'none',
          background: 'transparent',
          padding: 0,
          cursor: 'pointer',
        }}
      >
        <Trash2 size={14} color="#9ca3af" />
      </button>
    </div>
  </div>
);

const WorkspaceCard = ({
  label,
  description,
  tag,
  color,
  onUnmap,
  onDelete,
}) => (
  <div
    style={{
      padding: '16px',
      border: '1px solid #e2e8f0',
      borderRadius: '12px',
      borderLeft: `4px solid ${color}`,
      marginBottom: '12px',
      boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      gap: '8px',
    }}
  >
    <div style={{ flex: 1 }}>
      <p
        style={{
          fontWeight: '700',
          fontSize: '14px',
          marginBottom: '4px',
        }}
      >
        {label}
      </p>
      {description && (
        <p
          style={{
            fontSize: '12px',
            color: '#6b7280',
            marginBottom: 6,
          }}
        >
          {description}
        </p>
      )}
      <span
        style={{
          border: '1px solid #e2e8f0',
          padding: '2px 6px',
          borderRadius: '4px',
          fontSize: '10px',
          color: '#94a3b8',
          fontWeight: '700',
        }}
      >
        {tag.toUpperCase()}
      </span>
    </div>
    <div style={{ display: 'flex', gap: 6 }}>
      <button
        onClick={onUnmap}
        style={{
          fontSize: '11px',
          padding: '4px 8px',
          borderRadius: '6px',
          border: 'none',
          background: '#e5e7eb',
          color: '#4b5563',
          fontWeight: '600',
          cursor: 'pointer',
        }}
      >
        Unassign
      </button>
      <button
        onClick={onDelete}
        title="Delete"
        style={{
          border: 'none',
          background: 'transparent',
          padding: 0,
          cursor: 'pointer',
        }}
      >
        <Trash2 size={14} color="#9ca3af" />
      </button>
    </div>
  </div>
);

export default PersonaMapping;