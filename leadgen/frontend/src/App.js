// frontend/src/App.js
import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
} from 'react';

import {
  List,
  Users,
  Settings,
  Plus,
  Sparkles,
  Mail,
  LogOut,
  BarChart3,
  Target,
} from 'lucide-react';

import PersonaMapping from './component/PersonaMapping';
import Leads from './component/Leads';
import EmailMarketing from './component/EmailMarketing';
import InfluencerMarketing from './component/InfluencerMarketing';
import SettingsView from './component/SettingsView';
import Login from './component/Login';
import './App.css';
import io from 'socket.io-client';

const socket = io('http://localhost:8003', {
  transports: ['websocket'],
  autoConnect: true,
});

function App() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState('user-dashboard');

  const [profiles, setProfiles] = useState([]);
  const [filters, setFilters] = useState({
    name: '',
    industry: 'All',
    revenue: 'All',
    location: 'All',
  });

  const [selectedIcpId, setSelectedIcpId] = useState(null);



  const [leadMatchesByIcp, setLeadMatchesByIcp] = useState({});

  const [influencerStats, setInfluencerStats] = useState(null);
  const [userEmailStats, setUserEmailStats] = useState(null);
  const [adminOverviewStats, setAdminOverviewStats] = useState(null);

  const [brevoEmailStats, setBrevoEmailStats] = useState(null);
  const [brevoLoading, setBrevoLoading] = useState(false);
  const [brevoError, setBrevoError] = useState(null);

  /* ----------------------------- AUTH HANDLING ----------------------------- */

  useEffect(() => {
    const saved = localStorage.getItem('authUser');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.email && parsed.role) {
          setUser(parsed);
          if (parsed.role === 'admin') setView('admin-dashboard');
          else if (parsed.role === 'user') setView('user-dashboard');
        }
      } catch (e) {
        console.error('Failed to parse authUser from localStorage', e);
      }
    }
  }, []);

  const handleLogin = (u) => {
    localStorage.setItem('authUser', JSON.stringify(u));
    setUser(u);
    if (u.role === 'admin') setView('admin-dashboard');
    else if (u.role === 'user') setView('user-dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('authUser');
    setUser(null);
    setView('user-dashboard');
    setProfiles([]);
    setInfluencerStats(null);
    setUserEmailStats(null);
    setAdminOverviewStats(null);
    setLeadMatchesByIcp({});
    setBrevoEmailStats(null);
    setBrevoError(null);
  };

  /* ---------------------- BREVO STATS FETCHER (ACCOUNT) ------------------- */

  // Fetch Brevo aggregated email stats (account-wide) for the last `days` days
  const fetchBrevoStats = useCallback(
    async (days = 1) => {
      setBrevoLoading(true);
      setBrevoError(null);
      try {
        const res = await fetch(
          `http://localhost:8003/api/email/brevo-stats?days=${days}`
        );
        if (!res.ok) {
          const text = await res.text();
          console.error('Error fetching Brevo stats', res.status, text);
          setBrevoError('Failed to load Brevo stats');
          return;
        }
        const data = await res.json();
        setBrevoEmailStats(data);
      } catch (e) {
        console.error('Error fetching Brevo stats', e);
        setBrevoError('Failed to load Brevo stats');
      } finally {
        setBrevoLoading(false);
      }
    },
    []
  );

  /* -------------------------- LOAD ICPs (USER ROLE) ------------------------ */

  useEffect(() => {
    if (!user || user.role !== 'user') return;

    const loadLeads = async () => {
      try {
        const res = await fetch(
          `http://localhost:8003/api/icps?userId=${user.id}`
        );
        if (!res.ok) {
          console.error('Error fetching leads:', res.status, await res.text());
          return;
        }
        const data = await res.json();
        setProfiles(data);
      } catch (err) {
        console.error('Error fetching leads:', err);
      }
    };

    loadLeads();

    const onNewLead = (newLead) => {
      if (newLead.user_id === user.id) {
        setProfiles((prev) => {
          // Prevent duplicates when we already added this ICP locally
          if (prev.some((p) => p.id === newLead.id)) {
            return prev;
          }
          return [newLead, ...prev];
        });
      }
    };


  }, [user]);

  /* ---------------------- LOAD STATS (USER + ADMIN) ------------------------ */

  useEffect(() => {
    if (!user || user.role !== 'user') return;
    const loadStats = async () => {
      try {
        const res1 = await fetch('http://localhost:8003/api/influencers/stats');
        if (res1.ok) {
          const data1 = await res1.json();
          setInfluencerStats(data1);
        }
        const res2 = await fetch(
          `http://localhost:8003/api/email/stats?userId=${user.id}`
        );
        if (res2.ok) {
          const data2 = await res2.json();
          setUserEmailStats(data2);
        }

        // Brevo account-level stats (last 1 day)
        await fetchBrevoStats(1);
      } catch (e) {
        console.error('Error loading user stats', e);
      }
    };
    loadStats();
  }, [user, fetchBrevoStats]);

  useEffect(() => {
    if (!user || user.role !== 'admin') return;
    const loadStats = async () => {
      try {
        const res1 = await fetch('http://localhost:8003/api/admin/overview');
        if (res1.ok) {
          const data1 = await res1.json();
          setAdminOverviewStats(data1);
        }
      } catch (e) {
        console.error('Error loading admin stats', e);
      }
    };
    loadStats();
  }, [user]);

  /* ------------------------------ ICP FILTERING ---------------------------- */

  const { industries, revenues, locations, filteredProfiles } = useMemo(() => {
    const inds = new Set();
    const revs = new Set();
    const locs = new Set();

    profiles.forEach((p) => {
      if (p.industry) inds.add(p.industry);
      if (p.revenue) revs.add(p.revenue);
      if (p.location) locs.add(p.location);
    });

    const filtered = profiles.filter((p) => {
      const nameMatch = filters.name
        ? p.profile_name?.toLowerCase().includes(filters.name.toLowerCase())
        : true;

      const industryMatch =
        filters.industry === 'All' || p.industry === filters.industry;

      const revenueMatch =
        filters.revenue === 'All' || p.revenue === filters.revenue;

      const locationMatch =
        filters.location === 'All' || p.location === filters.location;

      return nameMatch && industryMatch && revenueMatch && locationMatch;
    });

    return {
      industries: Array.from(inds),
      revenues: Array.from(revs),
      locations: Array.from(locs),
      filteredProfiles: filtered,
    };
  }, [profiles, filters]);

  const handleDeleteICP = async (id) => {
    try {
      const res = await fetch(`http://localhost:8003/api/icps/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setProfiles(prev => prev.filter(p => p.id !== id));
        // Also clear selection if deleted
        if (selectedIcpId === id) setSelectedIcpId(null);
      } else {
        console.error("Failed to delete ICP");
      }
    } catch (e) {
      console.error("Error deleting ICP", e);
    }
  };

  const handleFilterChange = (field) => (e) => {
    const value = e.target.value;
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  /* ---------------------- LOAD & CACHE LEADS PER ICP ---------------------- */

  /* ---------------------- LOAD & CACHE LEADS PER ICP ---------------------- */

  const loadLeadMatches = useCallback(
    async (icpId, sortBy = 'relevance', limit = 1000, industry = 'All') => {
      // If no ICP (or 'all'), fetch all leads from dataset
      let url = `http://localhost:8003/api/leads/${icpId}/matches?sort_by=${sortBy}&limit=${limit}&industry=${encodeURIComponent(industry)}`;
      if (!icpId || icpId === 'all') {
        // Fetch all leads (max 1000 for performance)
        url = `http://localhost:8003/api/leads?limit=${limit}&industry=${encodeURIComponent(industry)}`;
      }

      try {
        const res = await fetch(url);
        if (!res.ok) {
          console.error(
            'Failed to load leads',
            res.status,
            await res.text()
          );
          return [];
        }
        const data = await res.json();
        const key = icpId || 'all';
        setLeadMatchesByIcp((prev) => ({ ...prev, [key]: data }));
        return data;
      } catch (e) {
        console.error('Error loading leads', e);
        return [];
      }
    },
    []
  );

  /* ------------------------------- LOGIN GATE ------------------------------ */

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  const role = user.role;

  /* ------------------------------- ADMIN VIEW ------------------------------ */

  if (role === 'admin') {
    return (
      <div className="app-container">
        <aside className="sidebar">
          <div className="logo-area">
            <div className="logo-icon">A</div>
            <div>
              <h2 className="logo-text">LeadGen Admin</h2>
            </div>
          </div>
          <nav className="nav-links">
            <div
              className={`nav-item ${view === 'admin-dashboard' ? 'active' : ''
                }`}
              onClick={() => setView('admin-dashboard')}
            >
              <BarChart3 size={20} /> Dashboard
            </div>
            <div
              className={`nav-item ${view === 'admin-influencers' ? 'active' : ''
                }`}
              onClick={() => setView('admin-influencers')}
            >
              <Users size={20} /> Influencers
            </div>
            <div
              className={`nav-item ${view === 'admin-users' ? 'active' : ''
                }`}
              onClick={() => setView('admin-users')}
            >
              <List size={20} /> Users
            </div>
            <div
              className="nav-item"
              onClick={handleLogout}
              style={{ marginTop: 'auto', color: '#ef4444' }}
            >
              <LogOut size={18} style={{ marginRight: 8 }} /> Logout
            </div>
          </nav>
        </aside>

        <main className="main-content">
          {view === 'admin-dashboard' && (
            <AdminDashboard overviewStats={adminOverviewStats} />
          )}
          {view === 'admin-influencers' && <AdminInfluencers />}
          {view === 'admin-users' && <AdminUsers />}
        </main>
      </div>
    );
  }

  /* ---------------------- INFLUENCER THANK-YOU SCREEN ---------------------- */

  if (role === 'influencer') {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: '#0f172a',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            background: '#ffffff',
            borderRadius: 16,
            padding: '32px 40px',
            width: 420,
            boxShadow: '0 25px 50px -12px rgba(15,23,42,0.45)',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              background: '#0f172a',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: 18,
              margin: '0 auto 8px',
            }}
          >
            I
          </div>
          <h1
            style={{
              fontSize: 22,
              fontWeight: 800,
              marginBottom: 8,
              color: '#0f172a',
            }}
          >
            Thanks for registering!
          </h1>
          <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 16 }}>
            Your influencer profile is under review. You&apos;ll receive an
            email once you are verified by the admin team.
          </p>
          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: 8,
              border: 'none',
              background: '#2563eb',
              color: '#fff',
              fontWeight: 700,
              fontSize: 14,
              cursor: 'pointer',
            }}
          >
            Logout
          </button>
        </div>
      </div>
    );
  }

  /* -------------------------------- USER VIEW ------------------------------ */

  return (
    <div className="app-container">
      <aside className="sidebar">
        <div className="logo-area">
          <div className="logo-icon">L</div>
          <div>
            <h2 className="logo-text">LeadGen AI</h2>
          </div>
        </div>
        <nav className="nav-links">
          <div
            className={`nav-item ${view === 'user-dashboard' ? 'active' : ''
              }`}
            onClick={() => setView('user-dashboard')}
          >
            <BarChart3 size={20} /> Dashboard
          </div>
          <div
            className={`nav-item ${view === 'list' ? 'active' : ''}`}
            onClick={() => setView('list')}
          >
            <List size={20} /> ICP List
          </div>
          <div
            className={`nav-item ${view === 'pain-points' ? 'active' : ''}`}
            onClick={() => setView('pain-points')}
          >
            <Sparkles size={20} /> Pain Points
          </div>
          <div
            className={`nav-item ${view === 'leads' ? 'active' : ''}`}
            onClick={() => setView('leads')}
          >
            <Users size={20} /> Leads
          </div>
          <div
            className={`nav-item ${view === 'email' ? 'active' : ''}`}
            onClick={() => setView('email')}
          >
            <Mail size={20} /> Email Marketing
          </div>
          <div
            className={`nav-item ${view === 'influencers' ? 'active' : ''
              }`}
            onClick={() => setView('influencers')}
          >
            <Users size={20} /> Influencer Marketing
          </div>
          <div
            className={`nav-item ${view === 'settings' ? 'active' : ''}`}
            onClick={() => setView('settings')}
          >
            <Settings size={20} /> Settings
          </div>
          <div
            className="nav-item"
            onClick={handleLogout}
            style={{ marginTop: 'auto', color: '#ef4444' }}
          >
            <LogOut size={18} style={{ marginRight: 8 }} /> Logout
          </div>
        </nav>
      </aside>

      <main className="main-content">
        {/* USER DASHBOARD */}
        {view === 'user-dashboard' && (
          <UserDashboard
            icpCount={profiles.length}
            influencerStats={influencerStats}
            emailStats={userEmailStats}
            brevoEmailStats={brevoEmailStats}
            brevoLoading={brevoLoading}
            brevoError={brevoError}
            onRefreshBrevo={fetchBrevoStats}
          />
        )}

        {/* ICP LIST */}
        {view === 'list' && (
          <>
            <header className="page-header">
              <h1>Ideal Customer Profiles</h1>
              <button className="btn-primary" onClick={() => setView('create')}>
                <Plus size={16} /> Create New ICP
              </button>
            </header>

            {/* FILTER BAR */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '12px',
              }}
            >
              <div style={{ flex: 2, minWidth: '180px' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '12px',
                    fontWeight: 600,
                    color: '#64748b',
                    marginBottom: 4,
                  }}
                >
                  Search by Name
                </label>
                <input
                  type="text"
                  value={filters.name}
                  onChange={handleFilterChange('name')}
                  placeholder="e.g. Acme Corp"
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    fontSize: '13px',
                  }}
                />
              </div>

              <div style={{ flex: 1, minWidth: '140px' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '12px',
                    fontWeight: 600,
                    color: '#64748b',
                    marginBottom: 4,
                  }}
                >
                  Industry
                </label>
                <select
                  value={filters.industry}
                  onChange={handleFilterChange('industry')}
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    fontSize: '13px',
                    background: '#ffffff',
                  }}
                >
                  <option value="All">All Industries</option>
                  {industries.map((ind) => (
                    <option key={ind} value={ind}>
                      {ind}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ flex: 1, minWidth: '140px' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '12px',
                    fontWeight: 600,
                    color: '#64748b',
                    marginBottom: 4,
                  }}
                >
                  Revenue
                </label>
                <select
                  value={filters.revenue}
                  onChange={handleFilterChange('revenue')}
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    fontSize: '13px',
                    background: '#ffffff',
                  }}
                >
                  <option value="All">All Ranges</option>
                  {revenues.map((rev) => (
                    <option key={rev} value={rev}>
                      {rev}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ flex: 1, minWidth: '140px' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '12px',
                    fontWeight: 600,
                    color: '#64748b',
                    marginBottom: 4,
                  }}
                >
                  Location
                </label>
                <select
                  value={filters.location}
                  onChange={handleFilterChange('location')}
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    fontSize: '13px',
                    background: '#ffffff',
                  }}
                >
                  <option value="All">All Locations</option>
                  {locations.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* ICP TABLE */}
            <div className="table-card">
              <table className="icp-table">
                <thead>
                  <tr>
                    <th>NAME</th>
                    <th>INDUSTRY</th>
                    <th>REVENUE</th>
                    <th>LOCATION</th>
                    <th>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProfiles.map((p) => (
                    <tr key={p.id}>
                      <td>{p.profile_name}</td>
                      <td>{p.industry}</td>
                      <td>{p.revenue}</td>
                      <td>{p.location}</td>
                      <td>
                        <button
                          onClick={() => {
                            if (window.confirm('Delete this ICP?')) {
                              handleDeleteICP(p.id);
                            }
                          }}
                          style={{
                            color: '#ef4444',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: 12,
                            fontWeight: 600,
                          }}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredProfiles.length === 0 && (
                    <tr>
                      <td
                        colSpan={4}
                        style={{ textAlign: 'center', padding: '24px' }}
                      >
                        No ICPs found. Create your first ICP to get started.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* CREATE ICP */}
        {view === 'create' && (
          <CreateICPForm
            userId={user.id}
            onCancel={() => setView('list')}
            onCreated={(lead) => {
              setProfiles((prev) => [lead, ...prev]);
              setView('list');
            }}
            existingRevenues={revenues}
            existingIndustries={industries}
          />
        )}

        {/* PAIN POINTS */}
        {view === 'pain-points' && (
          <PersonaMapping
            icps={profiles}
            selectedIcpId={selectedIcpId}
            onSelectIcp={setSelectedIcpId}
          />
        )}

        {/* LEADS */}
        {view === 'leads' && (
          <Leads
            icps={profiles}
            selectedIcpId={selectedIcpId}
            onSelectIcp={setSelectedIcpId}
            matchesByIcp={leadMatchesByIcp}
            loadMatches={loadLeadMatches}
            industries={industries}
          />
        )}

        {/* EMAIL MARKETING */}
        {view === 'email' && (
          <EmailMarketing
            icps={profiles}
            selectedIcpId={selectedIcpId}
            onSelectIcp={setSelectedIcpId}
            matchesByIcp={leadMatchesByIcp}
            loadMatches={loadLeadMatches}
            userId={user.id}
          />
        )}

        {/* INFLUENCER MARKETING */}
        {view === 'influencers' && <InfluencerMarketing />}

        {/* SETTINGS */}
        {view === 'settings' && <SettingsView />}
      </main>
    </div>
  );
}

/* --------------------------- User Dashboard View --------------------------- */

function UserDashboard({
  icpCount,
  influencerStats,
  emailStats,
  brevoEmailStats,
  brevoLoading,
  brevoError,
  onRefreshBrevo,
}) {
  const totalInfluencers = influencerStats?.total ?? 0;
  const verifiedInfluencers = influencerStats?.verified ?? 0;
  const byCategory = influencerStats?.byCategory ?? [];

  const campaigns = emailStats?.totalCampaigns ?? 0;
  const sent = emailStats?.totalSent ?? 0;
  // const delivered = emailStats?.totalDelivered ?? 0; // Legacy db stats
  // const soft = emailStats?.totalSoftBounces ?? 0;
  // const hard = emailStats?.totalHardBounces ?? 0;
  // const tracked = emailStats?.totalTracked ?? 0;

  // Brevo stats (Live)
  const brevoDelivered = brevoEmailStats?.delivered ?? 0;
  const brevoOpens = brevoEmailStats?.opens ?? 0;
  const brevoClicks = brevoEmailStats?.clicks ?? 0;
  const brevoBounced = brevoEmailStats?.bounced ?? 0;
  // const brevoEvents = brevoEmailStats?.events ?? 0;

  const maxCat = byCategory.reduce(
    (m, row) => (row.count > m ? row.count : m),
    0
  );

  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 24 }}>
        Dashboard
      </h1>

      <div className="dashboard-grid">
        <ShinyStatCard
          title="Total ICPs"
          value={icpCount}
          icon={Target}
          color="#2563eb"
          sub="Active Profiles"
        />
        <ShinyStatCard
          title="Influencers"
          value={totalInfluencers}
          icon={Users}
          color="#0d9488"
          sub={`${verifiedInfluencers} verified`}
        />
        <ShinyStatCard
          title="Email Campaigns"
          value={campaigns}
          icon={Mail}
          color="#7c3aed"
          sub={`${sent} sent via system`}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 24 }}>

        {/* Brevo Stats */}
        <div className="dashboard-section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h3><BarChart3 size={18} /> Email Performance (Last 24h)</h3>
            <button
              type="button"
              onClick={() => onRefreshBrevo && onRefreshBrevo(1)}
              disabled={brevoLoading}
              className="btn-secondary"
              style={{ fontSize: 11, padding: '4px 8px', height: 'auto' }}
            >
              {brevoLoading ? 'Refreshing…' : 'Refresh'}
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="stat-card-refresh" style={{ padding: 16, boxShadow: 'none', border: '1px solid #f1f5f9' }}>
              <span style={{ fontSize: 12, color: '#64748b' }}>Delivered</span>
              <span style={{ fontSize: 20, fontWeight: 700, color: '#16a34a' }}>{brevoDelivered}</span>
            </div>
            <div className="stat-card-refresh" style={{ padding: 16, boxShadow: 'none', border: '1px solid #f1f5f9' }}>
              <span style={{ fontSize: 12, color: '#64748b' }}>Opens</span>
              <span style={{ fontSize: 20, fontWeight: 700, color: '#2563eb' }}>{brevoOpens}</span>
            </div>
            <div className="stat-card-refresh" style={{ padding: 16, boxShadow: 'none', border: '1px solid #f1f5f9' }}>
              <span style={{ fontSize: 12, color: '#64748b' }}>Clicks</span>
              <span style={{ fontSize: 20, fontWeight: 700, color: '#f97316' }}>{brevoClicks}</span>
            </div>
            <div className="stat-card-refresh" style={{ padding: 16, boxShadow: 'none', border: '1px solid #f1f5f9' }}>
              <span style={{ fontSize: 12, color: '#64748b' }}>Bounces</span>
              <span style={{ fontSize: 20, fontWeight: 700, color: '#ef4444' }}>{brevoBounced}</span>
            </div>
          </div>

          {brevoError && <p style={{ color: '#ef4444', fontSize: 12, marginTop: 12 }}>{brevoError}</p>}
        </div>

        {/* Influencers By Category */}
        <div className="dashboard-section">
          <h3><Sparkles size={18} /> Influencers by Category</h3>

          {byCategory.length === 0 ? (
            <p style={{ color: '#94a3b8', fontStyle: 'italic' }}>No data yet.</p>
          ) : (
            <div className="progress-list">
              {byCategory.map((row) => (
                <div key={row.category} className="progress-item">
                  <div className="progress-label">{row.category}</div>
                  <div className="progress-bar-bg">
                    <div
                      className="progress-bar-fill"
                      style={{
                        width: maxCat > 0 ? `${(row.count / maxCat) * 100}%` : '0%',
                        background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)'
                      }}
                    />
                  </div>
                  <div className="progress-value">{row.count}</div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}



/* --------------------------- Create ICP Form --------------------------- */

function CreateICPForm({
  userId,
  onCancel,
  onCreated,
  existingRevenues = [],
  existingIndustries = [],
}) {
  const [form, setForm] = useState({
    profile_name: '',
    industry: '',
    revenue: '',
    location: '',
  });
  const [saving, setSaving] = useState(false);

  /* ---------- COMMON INDUSTRIES (10) + DB INDUSTRIES (for suggestions) --- */

  const COMMON_INDUSTRIES = [
    'IT Services',
    'Software / SaaS',
    'E-commerce',
    'Healthcare',
    'Finance / Fintech',
    'Manufacturing',
    'Education / EdTech',
    'Logistics & Supply Chain',
    'Retail & Consumer',
    'Hospitality & Travel',
  ];

  const industryOptions = useMemo(() => {
    const merged = [...existingIndustries, ...COMMON_INDUSTRIES];
    const unique = Array.from(
      new Set(
        merged
          .map((v) => (v || '').toString().trim())
          .filter((v) => v.length > 0)
      )
    );
    return unique;
  }, [existingIndustries]);

  const [industryInput, setIndustryInput] = useState('');
  const [industrySuggestions, setIndustrySuggestions] = useState([]);
  const [showIndustrySuggestions, setShowIndustrySuggestions] = useState(false);

  /* ------------------- REVENUE OPTIONS (DB + defaults) ------------------- */

  const DEFAULT_REVENUE_OPTIONS = [
    '$0 – 500k',
    '$500k – 1M',
    '1M – 5M',
    '5M – 10M',
    '10M – 20M',
    '20M – 50M',
    '50M – 100M',
    '100M – 500M',
    '500M – 1B',
    '1B+',
  ];

  const revenueOptions = useMemo(() => {
    const merged = [...existingRevenues, ...DEFAULT_REVENUE_OPTIONS];
    const unique = Array.from(
      new Set(
        merged
          .map((v) => (v || '').toString().trim())
          .filter((v) => v.length > 0)
      )
    );
    return unique;
  }, [existingRevenues]);

  /* -------------------- LOCATION AUTOCOMPLETE (INDIA) -------------------- */

  const COMMON_INDIAN_LOCATIONS = [
    'Chennai, Tamil Nadu',
    'Chengalpattu, Tamil Nadu',
    'Coimbatore, Tamil Nadu',
    'Madurai, Tamil Nadu',
    'Tiruchirappalli, Tamil Nadu',
    'Bengaluru, Karnataka',
    'Bangalore, Karnataka',
    'Mysuru, Karnataka',
    'Hyderabad, Telangana',
    'Secunderabad, Telangana',
    'Mumbai, Maharashtra',
    'Navi Mumbai, Maharashtra',
    'Pune, Maharashtra',
    'Thane, Maharashtra',
    'Delhi',
    'New Delhi, Delhi',
    'Noida, Uttar Pradesh',
    'Gurugram, Haryana',
    'Kolkata, West Bengal',
    'Ahmedabad, Gujarat',
    'Surat, Gujarat',
    'Jaipur, Rajasthan',
    'Kochi, Kerala',
    'Thiruvananthapuram, Kerala',
  ];

  const [locationInput, setLocationInput] = useState('');
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [showLocationSuggestions, setShowLocationSuggestions] =
    useState(false);

  /* ----------------------------- HANDLERS -------------------------------- */

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  // INDUSTRY: text + suggestions
  const handleIndustryChange = (e) => {
    const value = e.target.value;
    setIndustryInput(value);
    setForm((f) => ({ ...f, industry: value }));

    const q = value.trim().toLowerCase();
    if (!q) {
      setIndustrySuggestions([]);
      setShowIndustrySuggestions(false);
      return;
    }

    const suggestions = industryOptions
      .filter((ind) => ind.toLowerCase().includes(q))
      .slice(0, 8);

    setIndustrySuggestions(suggestions);
    setShowIndustrySuggestions(suggestions.length > 0);
  };

  const handleIndustrySelect = (ind) => {
    setIndustryInput(ind);
    setForm((f) => ({ ...f, industry: ind }));
    setShowIndustrySuggestions(false);
  };

  // LOCATION: text + suggestions
  const handleLocationChange = (e) => {
    const value = e.target.value;
    setLocationInput(value);
    setForm((f) => ({ ...f, location: value }));

    const q = value.trim().toLowerCase();
    if (q.length < 2) {
      setLocationSuggestions([]);
      setShowLocationSuggestions(false);
      return;
    }

    const suggestions = COMMON_INDIAN_LOCATIONS.filter((loc) =>
      loc.toLowerCase().includes(q)
    ).slice(0, 8);

    setLocationSuggestions(suggestions);
    setShowLocationSuggestions(suggestions.length > 0);
  };

  const handleLocationSelect = (loc) => {
    setLocationInput(loc);
    setForm((f) => ({ ...f, location: loc }));
    setShowLocationSuggestions(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.profile_name.trim()) {
      alert('Please enter a name for this ICP.');
      return;
    }
    setSaving(true);
    try {
      const res = await fetch('http://localhost:8003/api/icps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, userId }),
      });

      if (!res.ok) {
        console.error('Error creating ICP:', res.status, await res.text());
        setSaving(false);
        return;
      }

      const data = await res.json();
      onCreated(data);
    } catch (err) {
      console.error('Error creating ICP:', err);
      setSaving(false);
    }
  };

  /* ------------------------------- RENDER -------------------------------- */

  return (
    <div
      className="table-card"
      style={{
        maxWidth: 720,
        marginTop: 8,
        padding: 24,
      }}
    >
      <h2
        style={{
          marginBottom: 8,
          fontSize: 24,
          fontWeight: 800,
          color: '#0f172a',
        }}
      >
        Create New ICP
      </h2>
      <p
        style={{
          fontSize: 13,
          color: '#64748b',
          marginBottom: 20,
        }}
      >
        Define an Ideal Customer Profile. We use the <strong>industry</strong>,
        <strong> revenue</strong>, and <strong>location</strong> you provide
        to score and recommend companies that look similar to this ICP.
      </p>

      <form onSubmit={handleSubmit}>
        {/* Row 1: Name + Industry */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.4fr 1fr',
            gap: 16,
            marginBottom: 16,
          }}
        >
          <div>
            <label
              htmlFor="icpName"
              style={{
                display: 'block',
                fontSize: 12,
                fontWeight: 600,
                color: '#64748b',
                marginBottom: 4,
              }}
            >
              ICP Name
            </label>
            <input
              id="icpName"
              name="profile_name"
              value={form.profile_name}
              onChange={handleChange}
              placeholder="e.g. Mid‑market SaaS in India"
              required
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: 10,
                border: '1px solid #e2e8f0',
                fontSize: 13,
              }}
            />
          </div>

          <div style={{ position: 'relative' }}>
            <label
              htmlFor="icpIndustry"
              style={{
                display: 'block',
                fontSize: 12,
                fontWeight: 600,
                color: '#64748b',
                marginBottom: 4,
              }}
            >
              Industry
            </label>
            <input
              id="icpIndustry"
              name="industry"
              value={industryInput}
              onChange={handleIndustryChange}
              placeholder="Start typing (e.g. Healthcare, SaaS)..."
              autoComplete="off"
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: 10,
                border: '1px solid #e2e8f0',
                fontSize: 13,
              }}
              onFocus={() => {
                if (industryOptions.length && !industryInput) {
                  setIndustrySuggestions(industryOptions.slice(0, 8));
                  setShowIndustrySuggestions(true);
                } else if (industrySuggestions.length > 0) {
                  setShowIndustrySuggestions(true);
                }
              }}
            />

            {showIndustrySuggestions && industrySuggestions.length > 0 && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  background: '#ffffff',
                  border: '1px solid #e5e7eb',
                  borderRadius: 10,
                  marginTop: 4,
                  boxShadow:
                    '0 10px 15px -3px rgba(15,23,42,0.1), 0 4px 6px -4px rgba(15,23,42,0.1)',
                  zIndex: 20,
                  maxHeight: 180,
                  overflowY: 'auto',
                }}
              >
                {industrySuggestions.map((ind) => (
                  <div
                    key={ind}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      handleIndustrySelect(ind);
                    }}
                    style={{
                      padding: '8px 10px',
                      fontSize: 13,
                      cursor: 'pointer',
                      color: '#111827',
                    }}
                  >
                    {ind}
                  </div>
                ))}
              </div>
            )}

            <p
              style={{
                marginTop: 4,
                fontSize: 11,
                color: '#9ca3af',
              }}
            >
              Popular industries include: {COMMON_INDUSTRIES.slice(0, 3).join(
                ', '
              )}
              , etc. Start typing to get suggestions, or enter your own.
            </p>
          </div>
        </div>

        {/* Row 2: Revenue + Location */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1.4fr',
            gap: 16,
            marginBottom: 16,
          }}
        >
          <div>
            <label
              htmlFor="icpRevenue"
              style={{
                display: 'block',
                fontSize: 12,
                fontWeight: 600,
                color: '#64748b',
                marginBottom: 4,
              }}
            >
              Revenue (Annual)
            </label>
            <select
              id="icpRevenue"
              name="revenue"
              value={form.revenue}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: 10,
                border: '1px solid #e2e8f0',
                fontSize: 13,
                backgroundColor: '#ffffff',
              }}
            >
              <option value="">Select a range...</option>
              {revenueOptions.map((rev) => (
                <option key={rev} value={rev}>
                  {rev}
                </option>
              ))}
            </select>
            <p
              style={{
                marginTop: 4,
                fontSize: 11,
                color: '#9ca3af',
              }}
            >
              Using ranges with <strong>M</strong> or <strong>B</strong> (e.g.
              &nbsp;5M–10M) helps our matcher align with company size.
            </p>
          </div>

          <div style={{ position: 'relative' }}>
            <label
              htmlFor="icpLocation"
              style={{
                display: 'block',
                fontSize: 12,
                fontWeight: 600,
                color: '#64748b',
                marginBottom: 4,
              }}
            >
              Location (City / Region)
            </label>
            <input
              id="icpLocation"
              name="location"
              value={locationInput}
              onChange={handleLocationChange}
              placeholder="e.g. Chennai, Mumbai, Bengaluru or a custom region"
              autoComplete="off"
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: 10,
                border: '1px solid #e2e8f0',
                fontSize: 13,
              }}
              onFocus={() => {
                if (locationSuggestions.length > 0) {
                  setShowLocationSuggestions(true);
                }
              }}
            />

            {showLocationSuggestions && locationSuggestions.length > 0 && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  background: '#ffffff',
                  border: '1px solid #e5e7eb',
                  borderRadius: 10,
                  marginTop: 4,
                  boxShadow:
                    '0 10px 15px -3px rgba(15,23,42,0.1), 0 4px 6px -4px rgba(15,23,42,0.1)',
                  zIndex: 20,
                  maxHeight: 180,
                  overflowY: 'auto',
                }}
              >
                {locationSuggestions.map((loc) => (
                  <div
                    key={loc}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      handleLocationSelect(loc);
                    }}
                    style={{
                      padding: '8px 10px',
                      fontSize: 13,
                      cursor: 'pointer',
                      color: '#111827',
                    }}
                  >
                    {loc}
                  </div>
                ))}
              </div>
            )}

            <p
              style={{
                marginTop: 4,
                fontSize: 11,
                color: '#9ca3af',
              }}
            >
              Start typing (e.g. &quot;che&quot;) to see suggestions like
              Chennai, Chengalpattu, etc. You can also enter any custom region.
            </p>
          </div>
        </div>

        {/* Footer buttons */}
        <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? 'Saving...' : 'Save ICP'}
          </button>
          <button type="button" className="btn-secondary" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

/* --------------------------- Admin Dashboard --------------------------- */

function AdminDashboard({ overviewStats }) {
  const stats = overviewStats || {
    userCount: 0,
    influencerCount: 0,
    verifiedInfluencers: 0,
    influencersByCategory: [],
  };

  const {
    userCount,
    influencerCount,
    verifiedInfluencers,
    influencersByCategory,
  } = stats;

  const maxCat = influencersByCategory.reduce(
    (m, row) => (row.count > m ? row.count : m),
    0
  );

  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 24 }}>
        Admin Dashboard
      </h1>

      <div className="dashboard-grid">
        <ShinyStatCard
          title="Total Users"
          value={userCount}
          icon={Users}
          color="#2563eb"
          sub="Registered Accounts"
        />
        <ShinyStatCard
          title="Influencers"
          value={influencerCount}
          icon={Sparkles}
          color="#8b5cf6"
          sub={`${verifiedInfluencers} verified`}
        />
        <ShinyStatCard
          title="System Health"
          value="100%"
          icon={BarChart3}
          color="#16a34a"
          sub="All services operational"
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 24 }}>
        <div className="dashboard-section">
          <h3><Sparkles size={18} /> Influencers by Category</h3>

          {influencersByCategory.length === 0 ? (
            <p style={{ color: '#94a3b8', fontStyle: 'italic' }}>No influencers registered yet.</p>
          ) : (
            <div className="progress-list">
              {influencersByCategory.map((row) => (
                <div key={row.category} className="progress-item">
                  <div className="progress-label">{row.category}</div>
                  <div className="progress-bar-bg">
                    <div
                      className="progress-bar-fill"
                      style={{
                        width: maxCat > 0 ? `${(row.count / maxCat) * 100}%` : '0%',
                        background: 'linear-gradient(90deg, #22c55e, #eab308)'
                      }}
                    />
                  </div>
                  <div className="progress-value">{row.count}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ShinyStatCard({ title, value, icon: Icon, color, sub }) {
  return (
    <div className="stat-card-refresh">
      <div className="stat-header">
        <div className="stat-icon-wrapper" style={{ background: `${color}15`, color: color }}>
          {Icon && <Icon size={24} />}
          {!Icon && <div style={{ width: 24, height: 24 }} />}
        </div>
      </div>
      <div className="stat-value">{value}</div>
      <div className="stat-label">{title}</div>
      {sub && <div className="stat-sub">{sub}</div>}
    </div>
  );
}

/* ---------------------- Admin Influencers & Users ------------------------- */

function AdminInfluencers() {
  const [influencers, setInfluencers] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('http://localhost:8003/api/influencers');
        if (!res.ok) return;
        const data = await res.json();
        setInfluencers(data);
      } catch (e) {
        console.error('Error loading admin influencers', e);
      }
    };
    load();
  }, []);

  const toggleVerify = async (id, current) => {
    try {
      const res = await fetch(
        `http://localhost:8003/api/influencers/${id}/verify`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ verified: !current }),
        }
      );
      if (!res.ok) return;
      const updated = await res.json();
      setInfluencers((prev) =>
        prev.map((inf) => (inf.id === updated.id ? updated : inf))
      );
    } catch (e) {
      console.error('Error verifying influencer', e);
    }
  };

  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 16 }}>
        Influencer Management
      </h1>
      {influencers.length === 0 && <p>No influencers registered yet.</p>}
      {influencers.length > 0 && (
        <table className="icp-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Platform</th>
              <th>Followers</th>
              <th>Verified</th>
              <th>Email</th>
              <th>Mobile</th>
              <th>Charges (₹)</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {influencers.map((inf) => (
              <tr key={inf.id}>
                <td>{inf.name}</td>
                <td>{inf.category}</td>
                <td>{inf.platform}</td>
                <td>{inf.followers?.toLocaleString() || 'N/A'}</td>
                <td>{inf.verified ? 'Yes' : 'No'}</td>
                <td>{inf.email}</td>
                <td>{inf.mobile_number || 'N/A'}</td>
                <td>
                  {inf.charge_per_post != null
                    ? `₹${inf.charge_per_post}`
                    : 'N/A'}
                </td>
                <td>
                  <button
                    onClick={() => toggleVerify(inf.id, inf.verified)}
                    style={{
                      fontSize: 11,
                      padding: '4px 8px',
                      borderRadius: 6,
                      border: 'none',
                      background: inf.verified ? '#e5e7eb' : '#16a34a',
                      color: inf.verified ? '#4b5563' : '#fff',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    {inf.verified ? 'Unverify' : 'Verify'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

function AdminUsers() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('http://localhost:8003/api/admin/users');
        if (!res.ok) return;
        const data = await res.json();
        setUsers(data);
      } catch (e) {
        console.error('Error loading admin users', e);
      }
    };
    load();
  }, []);

  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 16 }}>
        User List
      </h1>
      {users.length === 0 && <p>No users yet.</p>}
      {users.length > 0 && (
        <table className="icp-table">
          <thead>
            <tr>
              <th>Email</th>
              <th>Role</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>{new Date(u.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;