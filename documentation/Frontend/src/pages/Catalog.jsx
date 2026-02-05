
import React from 'react';

const templates = [
  {
    id: 'compliance',
    title: 'Compliance Dashboard',
    description: 'Track regulatory filings, ROC, and enterprise risk management.',
    color: 'bg-blue-600',
    image: '📊'
  }
];

const Catalog = ({ onSelect }) => {
  const [showModal, setShowModal] = React.useState(false);

  return (
    <div className="min-h-screen bg-slate-50 py-20 px-6 relative">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-blue-600 text-white font-black text-xl mb-6 shadow-xl shadow-blue-500/20">C</div>
          <h1 className="text-5xl font-black text-slate-900 mb-4 tracking-tight">Select a Dashboard to Explore</h1>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto">Choose from our specialized business management suites to get started with your professional onboarding.</p>
        </div>

        <div className="flex justify-center mt-12">
          {templates.map((tpl) => (
            <div
              key={tpl.id}
              onClick={() => onSelect(tpl.id)}
              className="group bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden hover:border-blue-600 transition-all cursor-pointer hover:shadow-2xl hover:shadow-blue-500/10 flex flex-col w-full max-w-2xl"
            >
              <div className={`${tpl.color} h-64 flex items-center justify-center text-8xl transition-transform group-hover:scale-110 duration-500`}>
                {tpl.image}
              </div>
              <div className="p-10 flex-1 flex flex-col">
                <h3 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">{tpl.title}</h3>
                <p className="text-slate-500 text-lg leading-relaxed mb-8 flex-1">{tpl.description}</p>
                <div className="flex items-center text-blue-600 font-bold text-lg group-hover:translate-x-2 transition-transform">
                  Access Dashboard &rarr;
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 p-12 bg-white rounded-[3rem] border border-slate-200 text-center">
          <h2 className="text-3xl font-black text-slate-900 mb-4">Enterprise Customization</h2>
          <p className="text-slate-500 mb-8 max-w-xl mx-auto">Need a tailor-made compliance solution for your specific industry requirements?</p>
          <button
            onClick={() => setShowModal(true)}
            className="px-10 py-5 bg-slate-900 text-white font-black rounded-2xl hover:bg-black transition shadow-xl"
          >
            Talk to a Solutions Architect
          </button>
        </div>
      </div>

      {/* Contact Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl animate-in fade-in zoom-in duration-300 relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-6 right-6 p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 18 18" /></svg>
            </button>

            <div className="text-center space-y-6 pt-4">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
              </div>

              <div>
                <h3 className="text-2xl font-black text-slate-900">Talk to an Expert</h3>
                <p className="text-slate-500 mt-2">Our architects are ready to design a custom solution for your enterprise.</p>
              </div>

              <div className="bg-slate-50 rounded-2xl p-6 space-y-4 text-left">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-blue-600">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-400 uppercase">Email Us</div>
                    <div className="font-semibold text-slate-900">enterprise@compliance.com</div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-blue-600">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-400 uppercase">Call Support</div>
                    <div className="font-semibold text-slate-900">+1 (888) 123-4567</div>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setShowModal(false)}
                  className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition"
                >
                  Got it, thanks!
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Catalog;
