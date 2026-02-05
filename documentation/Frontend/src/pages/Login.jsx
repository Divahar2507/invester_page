
import React, { useState } from 'react';

const Login = ({ onLogin, onSocialLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Forgot Password Modal
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [isResetSent, setIsResetSent] = useState(false);

  return (
    <div className="flex h-screen items-center justify-center p-4 relative">
      <div className="flex w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Left Side - Branding */}
        <div className="hidden w-1/2 flex-col justify-between bg-blue-600 p-12 text-white md:flex">
          <div>
            <div className="flex items-center gap-2 mb-12">
              <div className="h-8 w-8 rounded bg-white flex items-center justify-center">
                <span className="text-blue-600 font-bold">C</span>
              </div>
              <span className="text-xl font-bold">CompliancePlatform</span>
            </div>
            <h1 className="mb-6 text-5xl font-bold leading-tight">Compliance Simplified</h1>
            <p className="text-blue-100 text-lg">
              Your partner in business compliance and regulatory excellence. Join 10,000+ businesses automating their risk management.
            </p>
          </div>
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="h-5 w-5 flex items-center justify-center rounded-full bg-blue-500/50">
                <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" /></svg>
              </div>
              <span className="text-sm">Enterprise-grade security</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-5 w-5 flex items-center justify-center rounded-full bg-blue-500/50">
                <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20"><path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM5.884 6.924a1 1 0 101.414-1.414l-.707-.707a1 1 0 10-1.414 1.414l.707.707zm8.502 0a1 1 0 101.414-1.414l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM8 11a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1zM5 13a1 1 0 110-2h2a1 1 0 110 2H5zm10 0a1 1 0 110-2h2a1 1 0 110 2h-2zM8 14a1 1 0 100 2h4a1 1 0 100-2H8z" /></svg>
              </div>
              <span className="text-sm">Automated risk assessments</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-5 w-5 flex items-center justify-center rounded-full bg-blue-500/50">
                <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20"><path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" /></svg>
              </div>
              <span className="text-sm">Real-time compliance tracking</span>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full bg-white p-12 md:w-1/2">
          <div className="mb-10">
            <h2 className="text-3xl font-bold text-slate-900">Sign In</h2>
            <p className="mt-2 text-slate-500">Enter your credentials to access your account.</p>
          </div>

          <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); onLogin(email); }}>
            <div>
              <label className="block text-sm font-medium text-slate-700">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="mt-1 w-full rounded-lg border border-slate-200 p-3 text-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                required
              />
            </div>
            <div>
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-slate-700">Password</label>
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative mt-1">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full rounded-lg border border-slate-200 p-3 text-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L8.05 8.05m1.829 1.829l4.242 4.242M12 5c4.478 0 8.268 2.943 9.542 7a10.025 10.025 0 01-1.563 3.029m-5.858-.908a3 3 0 01-4.243-4.243" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3l18 18" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="remember" className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
              <label htmlFor="remember" className="text-sm text-slate-600">Remember this device</label>
            </div>
            <button
              type="submit"
              className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500/20"
            >
              Sign In
            </button>
          </form>

          <div className="my-8 flex items-center gap-4">
            <div className="h-px flex-1 bg-slate-100"></div>
            <span className="text-xs font-medium text-slate-400">Or continue with</span>
            <div className="h-px flex-1 bg-slate-100"></div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => onSocialLogin('Google', email)}
              className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 p-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              <img src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png" className="h-5 w-5" alt="Google" />
              Google
            </button>
            <button
              onClick={() => onSocialLogin('Microsoft', email)}
              className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 p-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              <img src="https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg" className="h-5 w-5" alt="Microsoft" />
              Microsoft
            </button>
          </div>

          <p className="mt-8 text-center text-sm text-slate-500">
            Don't have an account? <a href="#" className="font-semibold text-blue-600 hover:text-blue-700">Sign Up</a>
          </p>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 relative animate-in zoom-in-95 duration-200">
            <button
              onClick={() => { setShowForgotPassword(false); setIsResetSent(false); setResetEmail(''); }}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>

            {!isResetSent ? (
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11.542 17.314A4 4 0 0110 18.572S4 18 4 18l2.313-8.313A4 4 0 017 9.172l1.313-1.313A6 6 0 0110 3a6 6 0 015 4z" /></svg>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Forgot Password?</h3>
                <p className="text-slate-500 mb-8">Enter your email address and we'll send you a link to reset your password.</p>

                <form onSubmit={(e) => { e.preventDefault(); setIsResetSent(true); }} className="space-y-6">
                  <div className="text-left">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      required
                      placeholder="name@company.com"
                      className="w-full rounded-lg border border-slate-200 p-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                  <button type="submit" className="w-full bg-blue-600 text-white rounded-lg py-3 font-semibold hover:bg-blue-700 transition shadow-lg shadow-blue-500/20">
                    Send Reset Link
                  </button>
                </form>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-in zoom-in duration-300">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Check your email</h3>
                <p className="text-slate-500 mb-8">We've sent a password reset link to<br /><span className="font-bold text-slate-900">{resetEmail}</span></p>
                <button
                  onClick={() => setShowForgotPassword(false)}
                  className="w-full bg-slate-100 text-slate-700 rounded-lg py-3 font-semibold hover:bg-slate-200 transition"
                >
                  Back to Sign In
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
