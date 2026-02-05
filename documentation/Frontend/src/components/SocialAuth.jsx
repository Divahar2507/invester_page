
import React from 'react';

const SocialAuth = ({ provider, loginHint, onContinue, onBack }) => {
  const mockEmail = loginHint || `alex.rivera@gmail.com`;
  const mockName = loginHint ? loginHint.split('@')[0] : 'Alex Rivera';

  return (
    <div className="flex h-screen items-center justify-center p-4 bg-slate-100">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl text-center">
        <div className="mb-6 flex justify-center">
          {provider === 'Google' ? (
            <img src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png" className="h-12 w-12" alt="Google" />
          ) : (
            <img src="https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg" className="h-12 w-12" alt="Microsoft" />
          )}
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Continue with {provider}</h2>
        <p className="text-slate-500 mb-8">Choose an account to continue to CompliancePlatform</p>

        <div
          onClick={() => onContinue(mockEmail)}
          className="group flex items-center gap-4 p-4 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50 transition-all active:scale-95 mb-4"
        >
          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold uppercase">
            {mockName.substring(0, 2).toUpperCase()}
          </div>
          <div className="text-left">
            <div className="text-sm font-bold text-slate-800 capitalize">{mockName.replace('.', ' ')}</div>
            <div className="text-xs text-slate-500">{mockEmail}</div>
          </div>
          <div className="ml-auto opacity-0 group-hover:opacity-100 text-blue-600 transition">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
          </div>
        </div>

        <button
          onClick={onBack}
          className="text-sm font-medium text-slate-400 hover:text-slate-600 transition"
        >
          Cancel and go back
        </button>
      </div>
    </div>
  );
};

export default SocialAuth;
