
import React, { useState, useEffect } from 'react';
import {
  Rocket,
  Building2,
  ShieldCheck,
  CheckCircle2,
  LayoutGrid,
  Lock,
  ChevronDown,
  ArrowLeft,
  Wallet,
  Award,
  Users,
  Clock,
  CheckCircle,
  HelpCircle,
  Bell,
  User,
  ArrowRight,
  FileText,
  Scale,
  Building,
  Loader2
} from 'lucide-react';

// --- Constants ---

const Step = {
  WELCOME: 'WELCOME',
  DETAILS: 'DETAILS',
  ANALYZING: 'ANALYZING',
  SUCCESS: 'SUCCESS'
};

// --- Sub-Components ---

const ComplianceAuditStep = ({ data, onNext, onBack, onNavigate }) => {
  return (
    <div className="flex min-h-screen bg-[#f9fafb] animate-in slide-in-from-right duration-500">
      <aside className="w-80 border-r border-gray-200 bg-white hidden lg:flex flex-col p-8 sticky top-0 h-screen">
        <div className="flex items-center gap-2 mb-12">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
            <ShieldCheck size={20} />
          </div>
          <span className="font-bold text-gray-800 text-lg">CompliancePro</span>
        </div>

        <div className="space-y-10 flex-1">
          <div className="space-y-4">
            <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em] font-bold">Onboarding Flow</p>
            <nav className="space-y-2">
              <button
                onClick={() => onNavigate(Step.DETAILS)}
                className="flex items-center gap-3 p-4 rounded-2xl text-gray-400 font-semibold text-sm opacity-50 hover:opacity-75 transition-all w-full text-left"
              >
                <div className="w-6 h-6 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center text-[10px]">1</div>
                Identity & Verification
              </button>
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-blue-50 text-blue-600 font-bold text-sm">
                <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">2</div>
                Compliance Audit
              </div>
              <button
                onClick={() => onNavigate(Step.ROADMAP)}
                className="flex items-center gap-3 p-4 rounded-2xl text-gray-400 font-semibold text-sm opacity-50 hover:opacity-75 transition-all w-full text-left"
              >
                <div className="w-6 h-6 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center text-[10px]">3</div>
                Final Roadmap
              </button>
            </nav>
          </div>
        </div>

        <div className="bg-slate-900 rounded-2xl p-6 text-white space-y-4">
          <p className="text-xs text-slate-400 font-medium">ONBOARDING EXPERT</p>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-400 to-indigo-500" />
            <div>
              <p className="text-sm font-bold">Sarah Chen</p>
              <p className="text-[10px] text-slate-400">Available to help</p>
            </div>
          </div>
          <button className="w-full py-2 bg-slate-800 rounded-lg text-xs font-bold hover:bg-slate-700 transition-colors">Chat now</button>
        </div>
      </aside>

      <main className="flex-1 p-6 md:p-16 lg:p-24 overflow-y-auto">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="space-y-4">
            <button onClick={onBack} className="flex items-center gap-2 text-gray-400 font-bold text-sm hover:text-blue-600 transition-colors mb-4">
              <ArrowLeft size={16} /> GO BACK
            </button>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Compliance Audit in Progress</h2>
            <p className="text-gray-500 text-lg leading-relaxed">We're analyzing your business requirements and mapping out compliance obligations based on your industry and selected services.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-xl p-8 space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                  <FileText size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Legal Structure Analysis</h3>
                  <p className="text-sm text-gray-500">Reviewing incorporation and regulatory requirements</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Progress</span>
                  <span className="text-gray-400">85%</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: '85%' }} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-gray-100 shadow-xl p-8 space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center">
                  <Scale size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Tax Compliance Mapping</h3>
                  <p className="text-sm text-gray-500">Identifying GST, TDS, and other tax obligations</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Progress</span>
                  <span className="text-gray-400">72%</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full" style={{ width: '72%' }} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-gray-100 shadow-xl p-8 space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center">
                  <Users size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">HR & Employment Laws</h3>
                  <p className="text-sm text-gray-500">Checking labor law compliance requirements</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Progress</span>
                  <span className="text-gray-400">91%</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-orange-500 rounded-full" style={{ width: '91%' }} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-gray-100 shadow-xl p-8 space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center">
                  <Award size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">IP & Trademark Review</h3>
                  <p className="text-sm text-gray-500">Assessing intellectual property protection needs</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Progress</span>
                  <span className="text-gray-400">68%</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500 rounded-full" style={{ width: '68%' }} />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-gray-100 shadow-xl p-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Audit Summary</h3>
                <p className="text-gray-500 mt-2">Based on your {data.industry} business and selected services</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">4 of 6</div>
                <div className="text-sm text-gray-400">Checks Complete</div>
              </div>
            </div>

            <div className="mt-8 space-y-4">
              <div className="flex items-center gap-4 p-4 bg-green-50 rounded-2xl">
                <CheckCircle size={20} className="text-green-600" />
                <div>
                  <div className="font-bold text-gray-900">Legal Structure Verified</div>
                  <div className="text-sm text-gray-600">Private Limited Company requirements identified</div>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-green-50 rounded-2xl">
                <CheckCircle size={20} className="text-green-600" />
                <div>
                  <div className="font-bold text-gray-900">Tax Registration Requirements Mapped</div>
                  <div className="text-sm text-gray-600">GST, Professional Tax, and TDS obligations confirmed</div>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-2xl">
                <Clock size={20} className="text-blue-600" />
                <div>
                  <div className="font-bold text-gray-900">HR Compliance Analysis Pending</div>
                  <div className="text-sm text-gray-600">Reviewing employment and labor law requirements</div>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-2xl">
                <Clock size={20} className="text-blue-600" />
                <div>
                  <div className="font-bold text-gray-900">IP Protection Strategy Pending</div>
                  <div className="text-sm text-gray-600">Assessing trademark and copyright needs</div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-4">
            <button
              onClick={onNext}
              className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-bold flex items-center gap-3 shadow-xl shadow-blue-600/20 hover:bg-blue-700 active:scale-95 transition-all"
            >
              Continue to Roadmap <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

const RoadmapStep = ({ data, onNext, onBack, onNavigate }) => {
  return (
    <div className="flex min-h-screen bg-[#f9fafb] animate-in slide-in-from-right duration-500">
      <aside className="w-80 border-r border-gray-200 bg-white hidden lg:flex flex-col p-8 sticky top-0 h-screen">
        <div className="flex items-center gap-2 mb-12">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
            <ShieldCheck size={20} />
          </div>
          <span className="font-bold text-gray-800 text-lg">CompliancePro</span>
        </div>

        <div className="space-y-10 flex-1">
          <div className="space-y-4">
            <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em] font-bold">Onboarding Flow</p>
            <nav className="space-y-2">
              <button
                onClick={() => onNavigate(Step.DETAILS)}
                className="flex items-center gap-3 p-4 rounded-2xl text-gray-400 font-semibold text-sm opacity-50 hover:opacity-75 transition-all w-full text-left"
              >
                <div className="w-6 h-6 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center text-[10px]">1</div>
                Identity & Verification
              </button>
              <button
                onClick={() => onNavigate(Step.COMPLIANCE_AUDIT)}
                className="flex items-center gap-3 p-4 rounded-2xl text-gray-400 font-semibold text-sm opacity-50 hover:opacity-75 transition-all w-full text-left"
              >
                <div className="w-6 h-6 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center text-[10px]">2</div>
                Compliance Audit
              </button>
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-blue-50 text-blue-600 font-bold text-sm">
                <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">3</div>
                Final Roadmap
              </div>
            </nav>
          </div>
        </div>

        <div className="bg-slate-900 rounded-2xl p-6 text-white space-y-4">
          <p className="text-xs text-slate-400 font-medium">ONBOARDING EXPERT</p>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-400 to-indigo-500" />
            <div>
              <p className="text-sm font-bold">Sarah Chen</p>
              <p className="text-[10px] text-slate-400">Available to help</p>
            </div>
          </div>
          <button className="w-full py-2 bg-slate-800 rounded-lg text-xs font-bold hover:bg-slate-700 transition-colors">Chat now</button>
        </div>
      </aside>

      <main className="flex-1 p-6 md:p-16 lg:p-24 overflow-y-auto">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="space-y-4">
            <button onClick={onBack} className="flex items-center gap-2 text-gray-400 font-bold text-sm hover:text-blue-600 transition-colors mb-4">
              <ArrowLeft size={16} /> GO BACK
            </button>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Your Custom Compliance Roadmap</h2>
            <p className="text-gray-500 text-lg leading-relaxed">Based on your audit results, here's your personalized compliance plan for the next 12 months.</p>
          </div>

          <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden">
            <div className="p-8 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Compliance Priority Matrix</h3>
                  <p className="text-gray-500 mt-1">Quarterly breakdown of critical compliance activities</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600">Q1 2024</div>
                  <div className="text-sm text-gray-400">Current Quarter</div>
                </div>
              </div>
            </div>

            <div className="p-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-red-100 text-red-600 rounded-xl flex items-center justify-center">
                      <Clock size={20} />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-red-800">HIGH PRIORITY</div>
                      <div className="text-xs text-red-600">Immediate Action Required</div>
                    </div>
                  </div>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full" />
                      GST Registration & Filing Setup
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full" />
                      Director KYC Verification
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full" />
                      Professional Tax Registration
                    </li>
                  </ul>
                </div>

                <div className="bg-orange-50 border border-orange-200 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center">
                      <Clock size={20} />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-orange-800">MEDIUM PRIORITY</div>
                      <div className="text-xs text-orange-600">Next 30-60 Days</div>
                    </div>
                  </div>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full" />
                      Trademark Search & Filing
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full" />
                      Annual Compliance Calendar Setup
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full" />
                      Employee Contract Templates
                    </li>
                  </ul>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-green-100 text-green-600 rounded-xl flex items-center justify-center">
                      <CheckCircle size={20} />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-green-800">LOW PRIORITY</div>
                      <div className="text-xs text-green-600">Next 3-6 Months</div>
                    </div>
                  </div>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      ISO Certifications
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      Advanced IP Protection
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      International Expansion Prep
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-gray-50 rounded-2xl p-6">
                <h4 className="font-bold text-gray-900 mb-4">Key Milestones & Deadlines</h4>
                <div className="space-y-4">
                  {[
                    { date: 'March 31, 2024', task: 'First GST Filing Due', priority: 'high' },
                    { date: 'April 15, 2024', task: 'Annual Income Tax Filing', priority: 'high' },
                    { date: 'May 31, 2024', task: 'MCA Annual Filing Deadline', priority: 'high' },
                    { date: 'June 30, 2024', task: 'Professional Tax First Half', priority: 'medium' },
                  ].map((milestone, idx) => (
                    <div key={idx} className="flex items-center gap-4 p-4 bg-white rounded-xl">
                      <div className={`w-3 h-3 rounded-full ${milestone.priority === 'high' ? 'bg-red-500' : 'bg-orange-500'}`} />
                      <div className="flex-1">
                        <div className="font-bold text-gray-900">{milestone.task}</div>
                        <div className="text-sm text-gray-500">{milestone.date}</div>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                        milestone.priority === 'high' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
                      }`}>
                        {milestone.priority.toUpperCase()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-600 rounded-3xl p-8 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold mb-2">Ready to Get Started?</h3>
                <p className="text-blue-100 text-sm mb-6">Your compliance roadmap is ready. We'll guide you through each step with automated reminders and expert support.</p>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle size={16} />
                    <span>Automated Filing Reminders</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle size={16} />
                    <span>Expert Legal Support</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle size={16} />
                    <span>Document Management</span>
                  </div>
                </div>
              </div>
              <button
                onClick={onNext}
                className="bg-white text-blue-600 px-8 py-4 rounded-2xl font-bold flex items-center gap-3 shadow-xl hover:shadow-2xl transition-all"
              >
                Launch My Dashboard
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const WelcomeStep = ({ data, onUpdate, onNext }) => {
  return (
    <div className="flex flex-col min-h-screen bg-white animate-in fade-in duration-500">
      <header className="flex items-center justify-between px-8 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
            <ShieldCheck size={20} />
          </div>
          <span className="font-bold text-gray-800 text-lg tracking-tight">CompliancePro</span>
        </div>
        <div className="flex items-center gap-4">
          <button className="text-gray-400 text-sm font-medium hover:text-gray-800 transition-colors">Support</button>
          <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
            <User size={16} />
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="max-w-4xl w-full text-center space-y-12">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">
              Ready to automate your <br className="hidden md:block" /> legal & tax compliance?
            </h1>
            <p className="text-gray-500 text-lg max-w-xl mx-auto leading-relaxed">
              Join 10,000+ businesses who trust us to handle their filings, registrations, and corporate governance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
            <button
              onClick={() => onUpdate({ type: 'new' })}
              className={`relative group p-8 rounded-3xl border-2 text-left transition-all duration-300 ${
                data.type === 'new'
                  ? 'border-blue-500 bg-blue-50/40 shadow-xl shadow-blue-500/10'
                  : 'border-gray-100 bg-white hover:border-gray-200 hover:shadow-2xl hover:shadow-gray-200/50'
              }`}
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300 ${
                data.type === 'new' ? 'bg-blue-600 text-white scale-110' : 'bg-blue-50 text-blue-600 group-hover:scale-110'
              }`}>
                <Rocket size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">I'm starting a new Startup</h3>
              <p className="text-gray-500 leading-relaxed text-sm">
                From incorporation to PAN/TAN and GST. We'll handle the paperwork while you build the product.
              </p>
              {data.type === 'new' && (
                <div className="absolute top-6 right-6 text-blue-500">
                  <CheckCircle2 size={24} fill="currentColor" className="text-white fill-blue-500" />
                </div>
              )}
            </button>

            <button
              onClick={() => onUpdate({ type: 'existing' })}
              className={`relative group p-8 rounded-3xl border-2 text-left transition-all duration-300 ${
                data.type === 'existing'
                  ? 'border-blue-500 bg-blue-50/40 shadow-xl shadow-blue-500/10'
                  : 'border-gray-100 bg-white hover:border-gray-200 hover:shadow-2xl hover:shadow-gray-200/50'
              }`}
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300 ${
                data.type === 'existing' ? 'bg-blue-600 text-white scale-110' : 'bg-blue-50 text-blue-600 group-hover:scale-110'
              }`}>
                <Building2 size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">I have an active business</h3>
              <p className="text-gray-500 leading-relaxed text-sm">
                Switch your compliance management to autopilot. Import your records and never miss a deadline.
              </p>
              {data.type === 'existing' && (
                <div className="absolute top-6 right-6 text-blue-500">
                  <CheckCircle2 size={24} fill="currentColor" className="text-white fill-blue-500" />
                </div>
              )}
            </button>
          </div>

          <div className="pt-8 space-y-6">
            <button
              disabled={!data.type}
              onClick={onNext}
              className="w-full max-w-sm bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-2xl shadow-blue-600/20 hover:bg-blue-700 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all text-lg"
            >
              Get Started
            </button>
            <div className="flex items-center justify-center gap-6 opacity-40 grayscale">
              <span className="text-xs font-bold text-gray-400">TRUSTED BY</span>
              <div className="h-6 w-24 bg-gray-200 rounded" />
              <div className="h-6 w-16 bg-gray-200 rounded" />
              <div className="h-6 w-20 bg-gray-200 rounded" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const DetailsStep = ({ data, onUpdate, onNext, onBack }) => {
  const toggleService = (service) => {
    const services = data.services.includes(service)
      ? data.services.filter(s => s !== service)
      : [...data.services, service];
    onUpdate({ services });
  };

  return (
    <div className="flex min-h-screen bg-[#f9fafb]">
      {/* Sidebar */}
      <aside className="w-80 border-r border-gray-200 bg-white hidden lg:flex flex-col p-8 sticky top-0 h-screen">
        <div className="flex items-center gap-2 mb-12">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
            <ShieldCheck size={20} />
          </div>
          <span className="font-bold text-gray-800 text-lg">CompliancePro</span>
        </div>

        <div className="space-y-10 flex-1">
          <div className="space-y-4">
            <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em] font-bold">Onboarding Progress</p>
            <nav className="space-y-2">
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-green-50 text-green-600 font-bold text-sm">
                <div className="w-6 h-6 rounded-full bg-green-600 text-white flex items-center justify-center text-[10px]">✓</div>
                Choose Path
              </div>
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-blue-50 text-blue-600 font-bold text-sm">
                <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">2</div>
                Company Details
              </div>
              <div className="flex items-center gap-3 p-4 rounded-2xl text-gray-400 font-semibold text-sm opacity-50">
                <div className="w-6 h-6 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center text-[10px]">3</div>
                Initial Compliance Check
              </div>
            </nav>
          </div>
        </div>

        <div className="bg-slate-900 rounded-2xl p-6 text-white space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600" />
            <div>
              <p className="text-sm font-bold">Sairam</p>
              <p className="text-[10px] text-slate-400">Owner Account</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-16 lg:p-24 overflow-y-auto">
        <div className="max-w-3xl mx-auto space-y-12">
          <div className="space-y-4">
            <button onClick={onBack} className="flex items-center gap-2 text-gray-400 font-bold text-sm hover:text-blue-600 transition-colors mb-4">
              <ArrowLeft size={16} /> GO BACK
            </button>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Tell us about your business</h2>
            <p className="text-gray-500 text-lg leading-relaxed">Provide your legal details to help us customize your compliance dashboard.</p>
          </div>

          <div className="bg-white rounded-[2rem] border border-gray-100 shadow-xl overflow-hidden">
            {/* Section 1: Legal Identity */}
            <div className="p-8 md:p-12 space-y-8">
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-gray-900">Legal Identity</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-600">Company Legal Name</label>
                    <input
                      type="text"
                      placeholder="e.g., Acme Corp Pvt Ltd"
                      value={data.legalName}
                      onChange={(e) => onUpdate({ legalName: e.target.value })}
                      className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50/50 focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all placeholder:text-gray-300 font-medium"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-600">Industry/Sector</label>
                    <div className="relative">
                      <select
                        value={data.industry}
                        onChange={(e) => onUpdate({ industry: e.target.value })}
                        className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50/50 focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none appearance-none transition-all text-gray-700 font-medium cursor-pointer"
                      >
                        <option value="">Search industry...</option>
                        <option value="saas">SaaS & Technology</option>
                        <option value="fintech">Fintech</option>
                        <option value="ecommerce">E-commerce</option>
                        <option value="healthtech">Healthtech</option>
                        <option value="professional">Professional Services</option>
                      </select>
                      <ChevronDown size={20} className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="h-px bg-gray-100" />

              {/* Section 2: Primary Service Interest */}
              <div className="space-y-6">
                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-gray-900">Primary Service Interest</h3>
                  <p className="text-sm text-gray-400">Select the areas where you need immediate compliance support.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { id: 'tax', name: 'GST & Taxation', desc: 'Monthly filings & returns', icon: Wallet, color: 'text-orange-600', bg: 'bg-orange-50' },
                    { id: 'ip', name: 'Trademark', desc: 'Brand protection & IP', icon: Award, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                    { id: 'hr', name: 'Payroll', desc: 'Salary, PF & Compliance', icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                  ].map((service) => (
                    <button
                      key={service.id}
                      onClick={() => toggleService(service.id)}
                      className={`p-6 rounded-3xl border-2 text-left transition-all duration-300 ${
                        data.services.includes(service.id)
                          ? 'border-blue-500 bg-blue-50/40 shadow-lg shadow-blue-500/5'
                          : 'border-gray-50 hover:border-gray-200 bg-gray-50/30'
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 transition-all ${
                        data.services.includes(service.id) ? 'bg-blue-600 text-white' : `${service.bg} ${service.color}`
                      }`}>
                        {data.services.includes(service.id) ? <CheckCircle size={24} /> : <service.icon size={24} />}
                      </div>
                      <h4 className="font-bold text-gray-900 mb-1">{service.name}</h4>
                      <p className="text-sm text-gray-500">{service.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Continue Button */}
            <div className="p-8 border-t border-gray-100">
              <button
                disabled={!data.legalName || !data.industry}
                onClick={onNext}
                className="w-full bg-blue-600 text-white px-10 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 shadow-xl shadow-blue-600/20 hover:bg-blue-700 active:scale-95 disabled:opacity-30 disabled:grayscale transition-all"
              >
                Continue <ArrowRight size={20} />
              </button>
            </div>
          </div>

          {/* Footer Badges */}
          <div className="flex items-center justify-center gap-12 opacity-60">
            <div className="flex items-center gap-2">
              <svg className="h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"/>
              </svg>
              <span className="text-xs font-bold uppercase tracking-widest">24/7 Expert Support</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
              <span className="text-xs font-bold uppercase tracking-widest">ISO 27001 Certified</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const AnalyzingStep = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("Running legal audit...");

  useEffect(() => {
    const statuses = [
      "Running legal audit...",
      "Mapping local tax laws...",
      "Checking industry regulations...",
      "Building your custom roadmap...",
      "Finalizing dashboard modules..."
    ];

    let currentIdx = 0;
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 500);
          return 100;
        }
        if (p % 20 === 0) {
          currentIdx = Math.min(currentIdx + 1, statuses.length - 1);
          setStatus(statuses[currentIdx]);
        }
        return p + 2;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-8 text-white text-center">
      <div className="w-full max-w-md space-y-12">
        <div className="relative flex items-center justify-center">
          <Loader2 size={64} className="text-blue-500 animate-spin" />
          <ShieldCheck size={32} className="absolute text-blue-400" />
        </div>
        <div className="space-y-4">
          <h2 className="text-3xl font-bold">compliance_analysis.exe</h2>
          <p className="text-slate-400 font-mono text-sm uppercase tracking-widest">{status}</p>
        </div>
        <div className="space-y-2">
          <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 transition-all duration-75"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] font-mono text-slate-500">
            <span>INIT_PROC</span>
            <span>{progress}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const SuccessStep = ({ data, onComplete }) => {
  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-4 border-b border-gray-100 bg-white">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
            <ShieldCheck size={20} />
          </div>
          <span className="font-bold text-gray-800 text-lg tracking-tight">CompliancePlatform</span>
        </div>
        <div className="flex items-center gap-4">
          <button className="text-gray-400 text-sm font-medium hover:text-gray-800 transition-colors">Support</button>
          <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
            <User size={16} />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="max-w-5xl mx-auto text-center space-y-12">
          {/* Success Icon */}
          <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center text-green-600 mx-auto ring-8 ring-green-50/50">
            <CheckCircle2 size={48} fill="currentColor" className="text-white fill-green-600" />
          </div>

          {/* Headline and Sub-headline */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
              You're all set, {data.legalName || 'Acme Corp'}!
            </h1>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto leading-relaxed">
              Onboarding complete! We've analyzed your business profile and prepared a personalized roadmap to keep you compliant.
            </p>
          </div>

          {/* Your First 3 Recommended Actions Section */}
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-gray-900">Your First 3 Recommended Actions</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl">
              {/* Action 1: Upload your COI */}
              <div className="bg-white p-8 rounded-3xl border border-red-200 shadow-lg hover:shadow-xl transition-all group relative">
                <div className="absolute top-4 right-4 px-3 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full">
                  Action required
                </div>
                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                  <FileText size={32} />
                </div>
                <h3 className="font-bold text-gray-900 mb-4 text-lg">Upload your COI</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Upload your Certificate of Incorporation to verify your legal business status and unlock core platform features.
                </p>
              </div>

              {/* Action 2: Verify GSTIN */}
              <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-lg hover:shadow-xl transition-all group">
                <div className="w-16 h-16 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                  <Scale size={32} />
                </div>
                <h3 className="font-bold text-gray-900 mb-4 text-lg">Verify GSTIN</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Ensure tax compliance for upcoming domestic transactions by validating your GST identification number.
                </p>
              </div>

              {/* Action 3: Schedule Trademark Consultation */}
              <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-lg hover:shadow-xl transition-all group">
                <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                  <Award size={32} />
                </div>
                <h3 className="font-bold text-gray-900 mb-4 text-lg">Schedule Trademark Consultation</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Protect your brand identity early. Book a 15-minute call with our trademark experts.
                </p>
              </div>
            </div>
          </div>

          {/* Go to Dashboard Button */}
          <div className="pt-8">
            <button
              onClick={onComplete}
              className="bg-blue-600 text-white px-12 py-4 rounded-2xl font-bold text-lg shadow-2xl shadow-blue-600/20 hover:bg-blue-700 active:scale-[0.98] transition-all"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 text-center border-t border-gray-100 bg-white">
        <p className="text-sm text-gray-500">© 2023 CompliancePlatform. Secure & Certified.</p>
      </footer>
    </div>
  );
};

// --- Main Onboarding Component ---

const Onboarding = ({ onComplete }) => {
  const [step, setStep] = useState(Step.WELCOME);
  const [data, setData] = useState({
    type: null,
    legalName: '',
    industry: '',
    services: []
  });

  const nextStep = () => {
    if (step === Step.WELCOME) setStep(Step.DETAILS);
    else if (step === Step.DETAILS) setStep(Step.ANALYZING);
  };

  const prevStep = () => {
    if (step === Step.DETAILS) setStep(Step.WELCOME);
  };

  const updateData = (updates) => {
    setData(prev => ({ ...prev, ...updates }));
  };

  return (
    <div className="min-h-screen selection:bg-blue-100 selection:text-blue-900 font-['Inter',sans-serif]">
      {step === Step.WELCOME && (
        <WelcomeStep
          data={data}
          onUpdate={updateData}
          onNext={nextStep}
        />
      )}
      {step === Step.DETAILS && (
        <DetailsStep
          data={data}
          onUpdate={updateData}
          onNext={nextStep}
          onBack={prevStep}
        />
      )}
      {step === Step.ANALYZING && (
        <AnalyzingStep onComplete={() => setStep(Step.SUCCESS)} />
      )}
      {step === Step.SUCCESS && (
        <SuccessStep data={data} onComplete={onComplete} />
      )}
    </div>
  );
};

export default Onboarding;
