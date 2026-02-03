// frontend/src/component/Login.jsx
import React, { useState } from 'react';

const INFLUENCER_CATEGORIES = [
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

function Login({ onLogin }) {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [role, setRole] = useState('user'); // 'admin' | 'user' | 'influencer'

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Influencer-specific registration fields
  const [fullName, setFullName] = useState('');
  const [platformYoutube, setPlatformYoutube] = useState(false);
  const [platformInstagram, setPlatformInstagram] = useState(false);
  const [followers, setFollowers] = useState('');
  const [category, setCategory] = useState('');
  const [handle, setHandle] = useState('');
  const [chargePerPost, setChargePerPost] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [mobileNumber, setMobileNumber] = useState(''); // NEW

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isLogin = mode === 'login';
  const isInfluencer = role === 'influencer';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const url =
        mode === 'login'
          ? 'http://localhost:8003/api/auth/login'
          : 'http://localhost:8003/api/auth/register';

      // Base payload
      const payload = {
        email,
        password,
        role,
      };

      // Extra validation + payload fields for influencer registration
      if (!isLogin && isInfluencer) {
        const platforms = [];
        if (platformYoutube) platforms.push('YouTube');
        if (platformInstagram) platforms.push('Instagram');

        if (!fullName.trim()) {
          setError('Please enter your full name.');
          setLoading(false);
          return;
        }
        if (!platforms.length) {
          setError('Please select at least one platform.');
          setLoading(false);
          return;
        }
        if (!category) {
          setError('Please choose a category.');
          setLoading(false);
          return;
        }
        if (!handle.trim()) {
          setError('Please provide your channel / handle link.');
          setLoading(false);
          return;
        }

        payload.fullName = fullName.trim();
        payload.platforms = platforms;
        payload.followers = followers ? Number(followers) : null;
        payload.category = category;
        payload.handle = handle.trim();
        payload.chargePerPost = chargePerPost ? Number(chargePerPost) : null;
        payload.imageUrl = imageUrl.trim() || null;
        payload.mobileNumber = mobileNumber.trim() || null; // NEW
      }

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const txt = await res.text();
        console.error('Auth failed:', res.status, txt);
        setError(
          isLogin
            ? 'Invalid credentials or role.'
            : 'Registration failed. Please check your details.'
        );
        setLoading(false);
        return;
      }

      const data = await res.json();

      if (!data.user || !data.user.role) {
        setError('Unexpected server response.');
        setLoading(false);
        return;
      }

      localStorage.setItem('authUser', JSON.stringify(data.user));
      onLogin(data.user);
    } catch (err) {
      console.error('Auth error:', err);
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#0f172a',
      }}
    >
      <div
        style={{
          background: '#ffffff',
          borderRadius: 16,
          padding: '32px 40px',
          width: 440,
          boxShadow: '0 25px 50px -12px rgba(15,23,42,0.45)',
        }}
      >
        {/* Brand */}
        <div style={{ marginBottom: 24, textAlign: 'center' }}>
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
            L
          </div>
          <h1
            style={{
              fontSize: 22,
              fontWeight: 800,
              marginBottom: 4,
              color: '#0f172a',
            }}
          >
            LeadGen AI
          </h1>
          <p style={{ fontSize: 13, color: '#6b7280' }}>
            {isLogin
              ? 'Sign in to access dashboards, ICPs, leads, and influencer tools.'
              : 'Register as an Admin, User, or Influencer.'}
          </p>
        </div>

        {/* Mode toggle */}
        <div
          style={{
            display: 'flex',
            borderRadius: 999,
            background: '#f3f4f6',
            padding: 3,
            marginBottom: 16,
          }}
        >
          <button
            type="button"
            onClick={() => setMode('login')}
            style={{
              flex: 1,
              padding: '6px 0',
              borderRadius: 999,
              border: 'none',
              background: isLogin ? '#ffffff' : 'transparent',
              fontSize: 13,
              fontWeight: 600,
              color: isLogin ? '#111827' : '#6b7280',
              cursor: 'pointer',
            }}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => setMode('register')}
            style={{
              flex: 1,
              padding: '6px 0',
              borderRadius: 999,
              border: 'none',
              background: !isLogin ? '#ffffff' : 'transparent',
              fontSize: 13,
              fontWeight: 600,
              color: !isLogin ? '#111827' : '#6b7280',
              cursor: 'pointer',
            }}
          >
            Register
          </button>
        </div>

        {/* Role selector */}
        <div style={{ marginBottom: 16 }}>
          <label
            style={{
              display: 'block',
              fontSize: 12,
              fontWeight: 600,
              marginBottom: 6,
              color: '#4b5563',
            }}
          >
            I am logging in as
          </label>
          <div style={{ display: 'flex', gap: 8 }}>
            <RoleChip
              label="Admin"
              value="admin"
              selected={role === 'admin'}
              onClick={setRole}
            />
            <RoleChip
              label="User"
              value="user"
              selected={role === 'user'}
              onClick={setRole}
            />
            {/* Influencer only visible when REGISTER mode is active */}
            {mode === 'register' && (
              <RoleChip
                label="Influencer"
                value="influencer"
                selected={role === 'influencer'}
                onClick={setRole}
              />
            )}
          </div>
          {role === 'influencer' && mode === 'register' && (
            <p
              style={{
                marginTop: 4,
                fontSize: 11,
                color: '#64748b',
              }}
            >
              Influencers can register and, once verified, will receive an
              email.
            </p>
          )}
        </div>

        {/* Auth form */}
        <form
          onSubmit={handleSubmit}
          style={{ display: 'flex', flexDirection: 'column', gap: 12 }}
        >
          {/* Influencer-only: full name */}
          {mode === 'register' && role === 'influencer' && (
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: 12,
                  fontWeight: 600,
                  marginBottom: 4,
                  color: '#4b5563',
                }}
              >
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g., Rahul Sharma"
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  borderRadius: 8,
                  border: '1px solid #e5e7eb',
                  fontSize: 13,
                }}
              />
            </div>
          )}

          {/* Email */}
          <div>
            <label
              style={{
                display: 'block',
                fontSize: 12,
                fontWeight: 600,
                marginBottom: 4,
                color: '#4b5563',
              }}
            >
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              style={{
                width: '100%',
                padding: '8px 10px',
                borderRadius: 8,
                border: '1px solid #e5e7eb',
                fontSize: 13,
              }}
            />
          </div>

          {/* Password */}
          <div>
            <label
              style={{
                display: 'block',
                fontSize: 12,
                fontWeight: 600,
                marginBottom: 4,
                color: '#4b5563',
              }}
            >
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              style={{
                width: '100%',
                padding: '8px 10px',
                borderRadius: 8,
                border: '1px solid #e5e7eb',
                fontSize: 13,
              }}
            />
          </div>

          {/* Influencer registration-only fields */}
          {!isLogin && isInfluencer && (
            <>
              {/* Platforms */}
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: 12,
                    fontWeight: 600,
                    marginBottom: 4,
                    color: '#4b5563',
                  }}
                >
                  Platforms
                </label>
                <div style={{ display: 'flex', gap: 12 }}>
                  <label style={{ fontSize: 12, color: '#4b5563' }}>
                    <input
                      type="checkbox"
                      checked={platformYoutube}
                      onChange={(e) => setPlatformYoutube(e.target.checked)}
                      style={{ marginRight: 6 }}
                    />
                    YouTube
                  </label>
                  <label style={{ fontSize: 12, color: '#4b5563' }}>
                    <input
                      type="checkbox"
                      checked={platformInstagram}
                      onChange={(e) => setPlatformInstagram(e.target.checked)}
                      style={{ marginRight: 6 }}
                    />
                    Instagram
                  </label>
                </div>
              </div>

              {/* Followers */}
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: 12,
                    fontWeight: 600,
                    marginBottom: 4,
                    color: '#4b5563',
                  }}
                >
                  Followers
                </label>
                <input
                  type="number"
                  value={followers}
                  onChange={(e) => setFollowers(e.target.value)}
                  placeholder="e.g., 50000"
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: 8,
                    border: '1px solid #e5e7eb',
                    fontSize: 13,
                  }}
                />
              </div>

              {/* Category */}
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: 12,
                    fontWeight: 600,
                    marginBottom: 4,
                    color: '#4b5563',
                  }}
                >
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: 8,
                    border: '1px solid #e5e7eb',
                    fontSize: 13,
                    background: '#ffffff',
                  }}
                >
                  <option value="">Choose category...</option>
                  {INFLUENCER_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Channel / handle link */}
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: 12,
                    fontWeight: 600,
                    marginBottom: 4,
                    color: '#4b5563',
                  }}
                >
                  Channel / Handle Link
                </label>
                <input
                  type="text"
                  value={handle}
                  onChange={(e) => setHandle(e.target.value)}
                  placeholder="e.g., https://youtube.com/@channelname"
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: 8,
                    border: '1px solid #e5e7eb',
                    fontSize: 13,
                  }}
                />
              </div>

              {/* Charge per post */}
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: 12,
                    fontWeight: 600,
                    marginBottom: 4,
                    color: '#4b5563',
                  }}
                >
                  Charge per Post (₹)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={chargePerPost}
                  onChange={(e) => setChargePerPost(e.target.value)}
                  placeholder="e.g., 5000"
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: 8,
                    border: '1px solid #e5e7eb',
                    fontSize: 13,
                  }}
                />
              </div>

              {/* Mobile number */}
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: 12,
                    fontWeight: 600,
                    marginBottom: 4,
                    color: '#4b5563',
                  }}
                >
                  Mobile Number
                </label>
                <input
                  type="tel"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  placeholder="e.g., 9876543210"
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: 8,
                    border: '1px solid #e5e7eb',
                    fontSize: 13,
                  }}
                />
              </div>

              {/* Image URL */}
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: 12,
                    fontWeight: 600,
                    marginBottom: 4,
                    color: '#4b5563',
                  }}
                >
                  Profile Image URL
                </label>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://..."
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: 8,
                    border: '1px solid #e5e7eb',
                    fontSize: 13,
                  }}
                />
              </div>
            </>
          )}

          {error && (
            <div
              style={{
                marginTop: 4,
                padding: 8,
                borderRadius: 6,
                background: '#fee2e2',
                color: '#b91c1c',
                fontSize: 12,
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: 8,
              width: '100%',
              padding: '10px 12px',
              borderRadius: 8,
              border: 'none',
              background: '#2563eb',
              color: '#fff',
              fontWeight: 700,
              fontSize: 14,
              cursor: loading ? 'default' : 'pointer',
              opacity: loading ? 0.8 : 1,
            }}
          >
            {loading
              ? isLogin
                ? 'Signing in…'
                : 'Registering…'
              : isLogin
                ? 'Sign in'
                : 'Register'}
          </button>
        </form>

        <p
          style={{
            marginTop: 16,
            fontSize: 11,
            color: '#9ca3af',
            textAlign: 'center',
          }}
        >
          {isLogin
            ? 'Use the credentials and role provided by your admin.'
            : role === 'influencer'
              ? 'Once registered, your profile will be reviewed and you will receive a verification email.'
              : 'After registering, you will be logged in automatically.'}
        </p>
      </div>
    </div>
  );
}

function RoleChip({ label, value, selected, onClick }) {
  return (
    <button
      type="button"
      onClick={() => onClick(value)}
      style={{
        flex: 1,
        padding: '6px 8px',
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

export default Login;