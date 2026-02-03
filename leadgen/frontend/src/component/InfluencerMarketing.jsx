// frontend/src/component/InfluencerMarketing.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { Users, Youtube, Instagram } from 'lucide-react';

const FALLBACK_CATEGORIES = [
  'Gaming',
  'Cooking',
  'Tech',
  'Finance',
  'Fashion',
  'Fitness',
  'Travel',
  'Beauty',
  'Education',
  'Lifestyle',
];

function InfluencerMarketing() {
  const [influencers, setInfluencers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [expandedId, setExpandedId] = useState(null); // for "View contact"

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        // Only show verified influencers to users
        const res = await fetch(
          'http://localhost:8003/api/influencers?verified=true'
        );
        if (!res.ok) {
          console.error(
            'Failed to load influencers',
            res.status,
            await res.text()
          );
          setLoading(false);
          return;
        }
        const data = await res.json();
        setInfluencers(data);
      } catch (e) {
        console.error('Error loading influencers', e);
      }
      setLoading(false);
    };
    load();
  }, []);

  // Determine available categories from data
  const categories = useMemo(() => {
    const set = new Set();
    influencers.forEach((i) => {
      if (i.category) set.add(i.category);
    });
    const fromData = Array.from(set);
    if (!fromData.length) return FALLBACK_CATEGORIES;
    return fromData;
  }, [influencers]);

  const filteredInfluencers = useMemo(() => {
    if (selectedCategory === 'All') return influencers;
    return influencers.filter((i) => i.category === selectedCategory);
  }, [influencers, selectedCategory]);

  const total = influencers.length;
  const countInFilter = filteredInfluencers.length;

  return (
    <div className="table-card" style={{ padding: 24 }}>
      {/* Header */}
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16,
        }}
      >
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>
            Influencer Directory
          </h1>
          <p style={{ color: '#64748b', fontSize: 13, maxWidth: 600 }}>
            Discover verified influencers by category and quickly view their
            contact details to coordinate campaigns.
          </p>
        </div>
        <div
          style={{
            display: 'flex',
            gap: 8,
            alignItems: 'center',
            fontSize: 12,
            color: '#6b7280',
          }}
        >
          <Users size={16} />
          <span>
            Showing <strong>{countInFilter}</strong> of{' '}
            <strong>{total}</strong> influencers
          </span>
        </div>
      </header>

      {/* Category chips */}
      <div
        style={{
          display: 'flex',
          gap: 8,
          flexWrap: 'wrap',
          marginBottom: 16,
        }}
      >
        <CategoryChip
          label="All"
          selected={selectedCategory === 'All'}
          onClick={() => setSelectedCategory('All')}
        />
        {categories.map((cat) => (
          <CategoryChip
            key={cat}
            label={cat}
            selected={selectedCategory === cat}
            onClick={() => setSelectedCategory(cat)}
          />
        ))}
      </div>

      {/* Grid */}
      {loading && <p>Loading influencers…</p>}

      {!loading && filteredInfluencers.length === 0 && (
        <p style={{ fontSize: 13, color: '#9ca3af' }}>
          No influencers available in this category yet.
        </p>
      )}

      {!loading && filteredInfluencers.length > 0 && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: 16,
          }}
        >
          {filteredInfluencers.map((inf) => (
            <InfluencerCard
              key={inf.id}
              influencer={inf}
              expanded={expandedId === inf.id}
              onToggle={() =>
                setExpandedId((prev) => (prev === inf.id ? null : inf.id))
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* --------------------------- Helper Components --------------------------- */

function CategoryChip({ label, selected, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        padding: '6px 10px',
        borderRadius: 999,
        border: '1px solid ' + (selected ? '#2563eb' : '#e5e7eb'),
        background: selected ? '#eff6ff' : '#ffffff',
        fontSize: 12,
        fontWeight: 600,
        color: selected ? '#1d4ed8' : '#4b5563',
        cursor: 'pointer',
      }}
    >
      {label}
    </button>
  );
}

function InfluencerCard({ influencer, expanded, onToggle }) {
  const {
    name,
    category,
    platform,
    followers,
    email,
    handle,
    charge_per_post,
    image_url,
    mobile_number,
  } = influencer;

  const platforms = parsePlatforms(platform);

  return (
    <div
      style={{
        borderRadius: 16,
        border: '1px solid #e5e7eb',
        background: '#ffffff',
        padding: 14,
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        boxShadow: '0 12px 24px -12px rgba(15,23,42,0.12)',
      }}
    >
      <div style={{ display: 'flex', gap: 10 }}>
        {/* Avatar */}
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 16,
            overflow: 'hidden',
            background: '#e5e7eb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            color: '#111827',
            flexShrink: 0,
          }}
        >
          {image_url ? (
            <img
              src={image_url}
              alt={name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            (name || '?')
              .toUpperCase()
              .charAt(0)
          )}
        </div>

        {/* Primary info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              gap: 8,
            }}
          >
            <div style={{ minWidth: 0 }}>
              <div
                style={{
                  fontWeight: 700,
                  fontSize: 14,
                  color: '#0f172a',
                }}
              >
                {name}
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: '#6b7280',
                  marginTop: 2,
                  display: 'flex',
                  gap: 6,
                  flexWrap: 'wrap',
                }}
              >
                <span
                  style={{
                    padding: '2px 6px',
                    borderRadius: 999,
                    background: '#eff6ff',
                    color: '#1d4ed8',
                    fontWeight: 600,
                  }}
                >
                  {category || 'General'}
                </span>
                {followers != null && (
                  <span>{followers.toLocaleString()} followers</span>
                )}
              </div>
            </div>

            {/* Platform icons */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
                gap: 4,
                fontSize: 10,
                color: '#6b7280',
              }}
            >
              {platforms.includes('YouTube') && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                  }}
                >
                  <Youtube size={16} color="#ef4444" />
                  <span>YouTube</span>
                </div>
              )}
              {platforms.includes('Instagram') && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                  }}
                >
                  <Instagram size={16} color="#db2777" />
                  <span>Instagram</span>
                </div>
              )}
            </div>
          </div>

          {/* Charges */}
          <div
            style={{
              marginTop: 6,
              fontSize: 12,
              color: '#111827',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span style={{ color: '#6b7280' }}>Charge / Post</span>
            <strong>
              {charge_per_post != null ? `₹${charge_per_post}` : 'Contact for rates'}
            </strong>
          </div>
        </div>
      </div>

      {/* View contact */}
      <button
        type="button"
        onClick={onToggle}
        style={{
          marginTop: 4,
          alignSelf: 'flex-start',
          fontSize: 12,
          fontWeight: 600,
          borderRadius: 999,
          border: '1px solid #e5e7eb',
          padding: '4px 10px',
          background: expanded ? '#eff6ff' : '#ffffff',
          color: '#1d4ed8',
          cursor: 'pointer',
        }}
      >
        {expanded ? 'Hide contact' : 'View contact'}
      </button>

      {expanded && (
        <div
          style={{
            marginTop: 4,
            padding: 10,
            borderRadius: 10,
            background: '#f9fafb',
            border: '1px solid #e5e7eb',
            fontSize: 12,
            color: '#4b5563',
          }}
        >
          {email && (
            <div style={{ marginBottom: 4 }}>
              <span style={{ fontWeight: 600 }}>Email:</span>{' '}
              <a href={`mailto:${email}`} style={{ color: '#2563eb', textDecoration: 'none' }}>
                {email}
              </a>
            </div>
          )}
          {mobile_number && (
            <div style={{ marginBottom: 4 }}>
              <span style={{ fontWeight: 600 }}>Phone:</span>{' '}
              <a href={`tel:${mobile_number}`} style={{ color: '#2563eb', textDecoration: 'none' }}>
                {mobile_number}
              </a>
            </div>
          )}
          {handle && (
            <div>
              <span style={{ fontWeight: 600 }}>Handle / Channel:</span>{' '}
              <a
                href={handle.startsWith('http') ? handle : `https://youtube.com/@${handle.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#2563eb', textDecoration: 'none' }}
              >
                {handle}
              </a>
            </div>
          )}
          {!email && !handle && (
            <div>Contact details not available. Please reach out via platform.</div>
          )}
        </div>
      )}
    </div>
  );
}

function parsePlatforms(platformString) {
  if (!platformString) return [];
  const lower = platformString.toLowerCase();
  const res = [];
  if (lower.includes('youtube')) res.push('YouTube');
  if (lower.includes('instagram')) res.push('Instagram');
  return res;
}

export default InfluencerMarketing;