
import React from 'react';

const ServiceDetail = ({ onBack }) => {
  return (
    <div className="max-w-6xl mx-auto pb-20">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase mb-8 hover:text-slate-900 transition"
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
        Back to Marketplace
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-10">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <span className="px-3 py-1 bg-blue-600 text-white text-[10px] font-black rounded tracking-widest">LEGAL & IP</span>
              <div className="flex items-center gap-1">
                 <span className="text-orange-400 font-bold text-sm">★ 4.9</span>
                 <span className="text-slate-400 text-xs font-bold">(128 reviews)</span>
              </div>
            </div>
            <h1 className="text-5xl font-black text-slate-900 mb-6 tracking-tight">International Trademark Filing</h1>
            <p className="text-lg text-slate-500 leading-relaxed">
              Protect your brand identity globally. Our expert legal team handles the complete registration process for your trademark in the US, EU, UK, and other major jurisdictions. We ensure your intellectual property is secured with comprehensive search, analysis, and direct filing.
            </p>
          </div>

          <div className="bg-blue-50/50 rounded-[2.5rem] border border-blue-100 p-10">
            <h3 className="text-xl font-bold mb-8 flex items-center gap-3">
               <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
               What's Included
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
               {[
                 { title: 'Search & Analysis', desc: 'Comprehensive conflict check against existing registrations.' },
                 { title: 'Multi-class Filing', desc: 'Strategic classification of goods and services for maximum protection.' },
                 { title: 'Status Tracking', desc: 'Real-time updates on your application progress via dashboard.' },
                 { title: 'Office Action Response', desc: 'Basic responses to minor procedural inquiries included.' }
               ].map(item => (
                 <div key={item.title} className="flex gap-4">
                    <svg className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                    <div>
                       <div className="font-bold text-slate-900 mb-1">{item.title}</div>
                       <div className="text-sm text-slate-500 leading-relaxed">{item.desc}</div>
                    </div>
                 </div>
               ))}
            </div>
          </div>

          <div className="space-y-8">
             <h3 className="text-2xl font-black">How It Works</h3>
             <div className="space-y-10 relative">
                <div className="absolute left-6 top-6 bottom-6 w-px bg-slate-100"></div>
                {[
                  { step: 1, title: 'Onboarding & Data Collection', desc: 'Complete a simple questionnaire about your brand and the regions where you need protection.' },
                  { step: 2, title: 'Professional Search', desc: 'Our attorneys perform a detailed search and provide a risk assessment report within 48 hours.' },
                  { step: 3, title: 'Application Filing', desc: 'Once approved by you, we file the applications with the respective trademark offices.' },
                  { step: 4, title: 'Ongoing Monitoring', desc: 'We monitor the status and handle communications until the trademark is successfully registered.' }
                ].map(s => (
                  <div key={s.step} className="flex gap-8 relative">
                     <div className="h-12 w-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-black z-10 border-4 border-slate-50 shadow-lg shadow-blue-500/20">
                        {s.step}
                     </div>
                     <div className="flex-1 pt-1">
                        <h4 className="text-lg font-bold mb-2">{s.title}</h4>
                        <p className="text-slate-500 leading-relaxed">{s.desc}</p>
                     </div>
                  </div>
                ))}
             </div>
          </div>

          <div className="pt-10 border-t border-slate-100">
             <h3 className="text-2xl font-black mb-8">Meet Your Expert</h3>
             <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 flex items-center gap-8 shadow-sm">
                <div className="h-32 w-32 rounded-3xl bg-slate-100 flex items-center justify-center text-5xl">👩‍💼</div>
                <div>
                   <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-2xl font-black text-slate-900">Sarah Jenkins, Esq.</h4>
                      <svg className="h-6 w-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                   </div>
                   <div className="text-xs font-black text-blue-600 uppercase tracking-widest mb-4">Senior IP Attorney • 12+ Years Exp.</div>
                   <p className="text-slate-500 mb-6 leading-relaxed">Sarah specializes in international intellectual property law. She has successfully filed over 2,500 trademarks worldwide and serves as a lead counsel for numerous Fortune 500 startups.</p>
                   <div className="flex items-center gap-8 text-[10px] font-black uppercase text-slate-400 tracking-widest">
                      <div className="flex items-center gap-2">🌍 English, French, German</div>
                      <div className="flex items-center gap-2">📍 New York, USA</div>
                   </div>
                </div>
             </div>
          </div>
        </div>

        <div className="space-y-8">
           <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-2xl sticky top-24">
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Starting Price</div>
              <div className="flex items-end gap-2 mb-8">
                 <span className="text-5xl font-black text-slate-900">$899</span>
                 <span className="text-sm font-bold text-slate-400 mb-2">/ per jurisdiction</span>
              </div>
              
              <div className="space-y-4 mb-10 pb-10 border-b border-slate-100">
                 <div className="flex justify-between text-sm">
                    <span className="text-slate-500 font-medium">Service Fee</span>
                    <span className="text-slate-900 font-bold">$349</span>
                 </div>
                 <div className="flex justify-between text-sm">
                    <span className="text-slate-500 font-medium">Government Fees (Estimated)</span>
                    <span className="text-slate-900 font-bold">$550</span>
                 </div>
                 <div className="flex justify-between text-sm pt-4">
                    <span className="text-slate-500 font-medium">Est. Completion Time</span>
                    <span className="text-blue-600 font-black">4-6 months</span>
                 </div>
              </div>

              <button className="w-full py-5 bg-blue-600 text-white font-black rounded-2xl shadow-xl shadow-blue-500/30 hover:bg-blue-700 transition flex items-center justify-center gap-3 text-lg mb-4">
                 Book Service Now
                 <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
              </button>
              <button className="w-full py-5 bg-slate-50 text-slate-900 font-bold rounded-2xl hover:bg-slate-100 transition">
                 Download Full Roadmap
              </button>

              <div className="mt-10 space-y-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                 <div className="flex items-center gap-3">
                    <svg className="h-4 w-4 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                    Safe & Escrow Payments
                 </div>
                 <div className="flex items-center gap-3">
                    <svg className="h-4 w-4 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                    Money-Back Guarantee on Filing Times
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetail;
