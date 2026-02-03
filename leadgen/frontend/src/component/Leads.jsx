// frontend/src/component/Leads.jsx
import React, { useEffect, useState, useRef } from 'react';

function Leads({ icps, selectedIcpId, onSelectIcp, matchesByIcp, loadMatches, industries = [] }) {
  const [loading, setLoading] = useState(false);
  const [limit, setLimit] = useState(1000);
  const [industryFilter, setIndustryFilter] = useState('All');

  // Derive matches: specific ICP or 'all'
  const matches =
    selectedIcpId && matchesByIcp[selectedIcpId]
      ? matchesByIcp[selectedIcpId]
      : (matchesByIcp['all'] || []);

  // Load matches when ICP selection changes (or on mount for default)
  // Ref to track previous params to prevent re-fetching on mount/update if data exists
  const prevParams = useRef({ limit, industryFilter, selectedIcpId });

  // Load matches when ICP selection changes (or on mount for default)
  useEffect(() => {
    const run = async () => {
      const key = selectedIcpId || 'all';
      const hasData = matchesByIcp && matchesByIcp[key] && matchesByIcp[key].length > 0;

      // Check if params changed
      const paramsChanged =
        limit !== prevParams.current.limit ||
        industryFilter !== prevParams.current.industryFilter ||
        selectedIcpId !== prevParams.current.selectedIcpId;

      // Update refs
      prevParams.current = { limit, industryFilter, selectedIcpId };

      // If params haven't changed (e.g. initial mount or parent re-render)
      // and we already have data, skip fetching.
      if (!paramsChanged && hasData) {
        return;
      }

      setLoading(true);
      try {
        // Load specific ICP matches or 'all' leads
        await loadMatches(selectedIcpId || 'all', 'relevance', limit, industryFilter);
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [selectedIcpId, loadMatches, limit, industryFilter, matchesByIcp]);

  // Merge passed industries with some defaults if empty
  const filterOptions = ['All', ...new Set([...industries, 'Technology', 'Healthcare', 'Finance', 'Retail'])];

  return (
    <div className="table-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2 style={{ margin: 0 }}>Leads</h2>
      </div>

      {/* ICP selector */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 16, alignItems: 'flex-end', flexWrap: 'wrap' }}>
        <div style={{ minWidth: 260 }}>
          <label
            style={{
              display: 'block',
              fontSize: 12,
              fontWeight: 600,
              color: '#64748b',
              marginBottom: 4,
            }}
          >
            Select ICP (Filter)
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
            <option value="">Show All Leads</option>
            {icps.map((icp) => (
              <option key={icp.id} value={icp.id}>
                {icp.profile_name} ({icp.industry})
              </option>
            ))}
          </select>
        </div>

        {/* Industry Filter (Always enabled for refinement) */}
        <div style={{ minWidth: 200 }}>
          <label
            style={{
              display: 'block',
              fontSize: 12,
              fontWeight: 600,
              color: '#64748b',
              marginBottom: 4,
            }}
          >
            Filter by Industry
          </label>
          <select
            value={industryFilter}
            onChange={(e) => setIndustryFilter(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 10px',
              borderRadius: 8,
              border: '1px solid #e2e8f0',
              fontSize: 13,
            }}
          >
            {filterOptions.map((ind) => (
              <option key={ind} value={ind}>
                {ind}
              </option>
            ))}
          </select>
        </div>

        <div style={{ minWidth: 120 }}>
          <label
            style={{
              display: 'block',
              fontSize: 12,
              fontWeight: 600,
              color: '#64748b',
              marginBottom: 4,
            }}
          >
            Limit Results
          </label>
          <select
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            style={{
              width: '100%',
              padding: '8px 10px',
              borderRadius: 8,
              border: '1px solid #e2e8f0',
              fontSize: 13,
            }}
          >
            <option value={50}>50</option>
            <option value={100}>100</option>
            <option value={200}>200</option>
            <option value={300}>300</option>
          </select>
        </div>
      </div>

      {loading && (
        <p style={{ color: '#64748b' }}>Loading businesses…</p>
      )}

      {!loading && matches.length === 0 && (
        <p>No businesses found.</p>
      )}

      {!loading && matches.length > 0 && (
        <table className="icp-table">
          <thead>
            <tr>
              <th>Business Name</th>
              <th>Email</th>
              <th>City</th>
              <th>State</th>
              <th>Sales Volume</th>
              <th>Employees</th>
            </tr>
          </thead>
          <tbody>
            {matches.map((m, idx) => (
              <tr key={idx}>
                <td>{m.businessName || m.profile_name}</td>
                <td>{m.email || 'N/A'}</td>
                <td>{m.city || m.location}</td>
                <td>{m.state || 'N/A'}</td>
                <td>{m.salesVolume || m.revenue}</td>
                <td>{m.employees || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Leads;