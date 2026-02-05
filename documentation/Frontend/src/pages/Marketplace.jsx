
import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Bell,
  Filter,
  ArrowRight,
  X,
  CheckCircle,
  Star,
  ShieldCheck,
  FileText,
  Users,
  DollarSign,
  Briefcase
} from 'lucide-react';

const Marketplace = () => {
  const [activeCategory, setActiveCategory] = useState('All Services');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [showSupport, setShowSupport] = useState(false);

  // Chat State
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatActive, setIsChatActive] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const chatContainerRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages, isChatActive]);

  const handleStartChat = (e) => {
    if (e) e.preventDefault();
    if (!chatInput.trim()) return;
    setIsChatActive(true);
    handleSendMessage(chatInput);
    setChatInput('');
  };

  const handleSendMessage = (text) => {
    const newMessage = { text, isUser: true, time: 'Just now' };
    setChatMessages(prev => [...prev, newMessage]);
    setIsTyping(true);

    // Context-aware responses
    const lowerText = text.toLowerCase();
    let responseText = "Thanks for reaching out! Could you please specify which service you are interested in? We offer Legal, Tax, HR, and Compliance services.";

    if (lowerText.includes('gst') || lowerText.includes('tax') || lowerText.includes('vat') || lowerText.includes('filing')) {
      responseText = "For GST and tax related queries, our chartered accountants can help with monthly filings and returns. Would you like to schedule a consultation?";
    } else if (lowerText.includes('trademark') || lowerText.includes('ip') || lowerText.includes('brand') || lowerText.includes('logo')) {
      responseText = "Our IP team specializes in international trademark filings and brand protection. Do you have a specific jurisdiction (US, EU, India) in mind?";
    } else if (lowerText.includes('audit') || lowerText.includes('statutory') || lowerText.includes('compliance')) {
      responseText = "We support statutory, internal, and GDPR compliance audits. Are you looking for an annual audit or a specific compliance review?";
    } else if (lowerText.includes('incorporation') || lowerText.includes('startup') || lowerText.includes('register') || lowerText.includes('company')) {
      responseText = "We can handle the entire incorporation process for your new venture. What type of entity (Private Ltd, LLP, etc.) are you planning to register?";
    } else if (lowerText.includes('contract') || lowerText.includes('agreement') || lowerText.includes('draft') || lowerText.includes('legal')) {
      responseText = "Our legal team drafts custom commercial agreements, MSAs, and NDAs. Do you need a standard template or a custom-drafted contract?";
    } else if (lowerText.includes('cfo') || lowerText.includes('financial') || lowerText.includes('budget') || lowerText.includes('planning')) {
      responseText = "Our Virtual CFO service helps with financial planning and unit economics. Are you looking for ongoing monthly support or a one-time financial model?";
    } else if (lowerText.includes('hr') || lowerText.includes('payroll') || lowerText.includes('employee')) {
      responseText = "We manage end-to-end payroll and HR compliance. How many employees does your organization currently have?";
    } else if (lowerText.includes('hello') || lowerText.includes('hi') || lowerText.includes('hey')) {
      responseText = "Hello! I'm here to help you find the right compliance services. You can ask me about Taxes, Trademarks, Audits, or Legal Contracts.";
    }

    // Simulate Agent Delay
    setTimeout(() => {
      setIsTyping(false);

      setChatMessages(prev => [...prev, {
        text: responseText,
        isUser: false,
        time: 'Just now'
      }]);
    }, 1500);
  };

  const categories = ['All Services', 'Legal & IP', 'Finance & Tax', 'HR & Payroll', 'Compliance Packages'];

  const notifications = [
    { id: 1, text: "New tax filing deadline approaching", time: "2h ago", unread: true },
    { id: 2, text: "Your trademark search is complete", time: "1d ago", unread: false },
    { id: 3, text: "Welcome to the new marketplace!", time: "2d ago", unread: false }
  ];

  const services = [
    {
      id: 'itf',
      title: 'International Trademark Filing',
      description: 'Comprehensive trademark registration in US, EU, and UK with end-to-end filing support.',
      fullDescription: 'Protect your brand globally with our streamlined international trademark filing service. We handle class selection, similarity search, and application filing across multiple jurisdictions including the USPTO, EUIPO, and UKIPO. Includes office action responses.',
      price: '$899',
      category: 'Legal & IP',
      tag: 'POPULAR',
      rating: 4.9,
      reviews: 124
    },
    {
      id: 'cad',
      title: 'Commercial Agreement Draft',
      description: 'Standardized and custom commercial contracts including MSAs, SOWs, and Licensing.',
      fullDescription: 'Get professionally drafted commercial agreements tailored to your business needs. Our legal team specializes in Master Services Agreements (MSA), Statements of Work (SOW), NDAs, and Software Licensing Agreements.',
      price: '$249',
      category: 'Legal & IP',
      rating: 4.8,
      reviews: 89
    },
    {
      id: 'gca',
      title: 'GDPR Compliance Audit',
      description: 'Complete data privacy audit and policy generation for European market readiness.',
      fullDescription: 'Ensure your business meets GDPR requirements with our comprehensive audit. We review your data processing activities, generate privacy policies, and provide a remediation roadmap to avoid penalties.',
      price: '$1,200',
      category: 'Legal & IP',
      rating: 5.0,
      reviews: 42
    },
    {
      id: 'vcfo',
      title: 'Virtual CFO',
      description: 'Strategic financial planning, budgeting, and board reporting for growing startups.',
      fullDescription: 'Access high-level financial strategy without the cost of a full-time CFO. Services include financial modeling, cash flow management, investor reporting, and unit economics analysis.',
      price: '$499/mo',
      category: 'Finance & Tax',
      tag: 'NEW',
      rating: 4.7,
      reviews: 15
    },
    {
      id: 'aas',
      title: 'Annual Audit Support',
      description: 'Liaising with statutory auditors and preparing full documentation for annual audits.',
      fullDescription: 'Simplify your annual statutory audit. We prepare all necessary schedules, reconciliations, and financial statements, coordinating directly with your auditors to ensure a smooth process.',
      price: '$1,500',
      category: 'Finance & Tax',
      rating: 4.9,
      reviews: 210
    },
    {
      id: 'tfg',
      title: 'Tax Filings (GST/VAT)',
      description: 'Monthly and quarterly indirect tax returns managed by certified tax practitioners.',
      fullDescription: 'Timely and accurate filing of your GST/VAT returns. We handle data preparation, reconciliation, and submission to tax authorities, ensuring you remain compliant and avoid late fees.',
      price: '$199/mo',
      category: 'Finance & Tax',
      rating: 4.8,
      reviews: 356
    }
  ];

  const filteredServices = services.filter(service => {
    const matchesCategory = activeCategory === 'All Services' || service.category === activeCategory;
    const matchesSearch = service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const uniqueCategoriesInView = ['Legal & IP', 'Finance & Tax', 'HR & Payroll'].filter(cat =>
    activeCategory === 'All Services' || activeCategory === cat
  );

  return (
    <div className="max-w-6xl mx-auto space-y-10 min-h-screen pb-20 relative">

      {/* --- Header Area: Search & Notifications --- */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-white p-4 rounded-3xl border border-slate-100 shadow-sm">
        <div className="relative w-full md:w-96 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={20} />
          <input
            type="text"
            placeholder="Search services (e.g. 'Trademark', 'Audit')..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border-2 border-transparent focus:border-blue-100 focus:bg-white rounded-2xl outline-none transition-all font-medium text-slate-700 placeholder:text-slate-400"
          />
          {searchQuery && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-20">
              <div className="p-3 text-xs font-bold text-slate-400 uppercase tracking-widest">Recommended</div>
              {filteredServices.slice(0, 3).map(s => (
                <div
                  key={s.id}
                  onClick={() => { setSelectedService(s); setSearchQuery(''); }}
                  className="p-3 hover:bg-slate-50 cursor-pointer flex items-center gap-3 transition-colors"
                >
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><FileText size={16} /></div>
                  <span className="font-medium text-slate-700">{s.title}</span>
                </div>
              ))}
              {filteredServices.length === 0 && (
                <div className="p-4 text-center text-slate-400 text-sm">No services found</div>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-4 relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-3 bg-white border border-slate-200 rounded-xl text-slate-500 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 transition-all"
          >
            <Bell size={20} />
            <span className="absolute top-2 right-2.5 h-2 w-2 bg-red-500 rounded-full ring-2 ring-white"></span>
          </button>

          {/* Notification Panel */}
          {showNotifications && (
            <div className="absolute top-full right-0 mt-4 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-30 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="p-4 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                <h4 className="font-bold text-slate-900">Notifications</h4>
                <button className="text-xs text-blue-600 font-bold hover:underline">Mark all read</button>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {notifications.map(n => (
                  <div key={n.id} className={`p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors ${n.unread ? 'bg-blue-50/30' : ''}`}>
                    <div className="flex gap-3">
                      <div className="mt-1"><div className="h-2 w-2 rounded-full bg-blue-500"></div></div>
                      <div>
                        <p className="text-sm text-slate-700 font-medium leading-snug">{n.text}</p>
                        <p className="text-xs text-slate-400 mt-1">{n.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="h-10 w-10 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl text-white flex items-center justify-center font-bold shadow-lg shadow-blue-500/20">
            SC
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 mb-3 leading-tight">Scale Your Business with<br />Expert Services</h1>
          <p className="text-slate-500 max-w-xl">Access a curated marketplace of professional services designed to help your business grow while staying fully compliant.</p>
        </div>
        <div className="flex gap-4">
          {/* Stats Cards */}
          <div className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center gap-4 shadow-sm">
            <div className="h-10 w-10 bg-green-50 text-green-600 rounded-xl flex items-center justify-center">
              <Users size={20} />
            </div>
            <div>
              <div className="text-sm font-bold">Vetted Experts</div>
              <div className="text-xs text-slate-400">500+ Professionals</div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center gap-4 shadow-sm">
            <div className="h-10 w-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
              <Star size={20} />
            </div>
            <div>
              <div className="text-sm font-bold">Avg Rating</div>
              <div className="text-xs text-slate-400">4.9/5 Stars</div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 p-1 bg-white border border-slate-100 rounded-2xl w-fit">
        {categories.map((cat, idx) => (
          <button
            key={cat}
            onClick={() => { setActiveCategory(cat); setSearchQuery(''); }}
            className={`px-6 py-2 rounded-xl text-sm font-bold transition ${activeCategory === cat ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Service Listings */}
      {searchQuery ? (
        // Search Results View
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-slate-900">Search Results</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredServices.map(service => (
              <ServiceCard key={service.id} service={service} onClick={() => setSelectedService(service)} />
            ))}
            {filteredServices.length === 0 && (
              <div className="col-span-3 py-10 text-center text-slate-500 flex flex-col items-center gap-3">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-400">?</div>
                <p>No services matched your search.</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        // Category Views
        uniqueCategoriesInView.map(category => (
          <div key={category} className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold flex items-center gap-3">
                <span className={`h-2 w-2 rounded-full ${category === 'Legal & IP' ? 'bg-purple-600' : 'bg-blue-600'}`}></span>
                {category}
              </h3>
              <button
                onClick={() => setActiveCategory(category)}
                className="text-sm font-bold text-blue-600 hover:underline flex items-center gap-1"
              >
                View All <ArrowRight size={14} />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {services.filter(s => s.category === category).map(service => (
                <ServiceCard key={service.id} service={service} onClick={() => setSelectedService(service)} />
              ))}
            </div>
          </div>
        ))
      )}

      {/* Support Banner */}
      <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white flex items-center justify-between relative overflow-hidden group">
        <div className="relative z-10">
          <h3 className="text-3xl font-bold mb-4">Can't find what you're looking for?</h3>
          <p className="text-slate-400 max-w-lg mb-8">Our concierge team can help find the right partner for your specific business requirements.</p>
          <button
            onClick={() => setShowSupport(true)}
            className="bg-white text-slate-900 font-bold px-8 py-4 rounded-xl hover:bg-blue-50 transition shadow-lg flex items-center gap-2 group-hover:gap-3"
          >
            Contact Expert Support <ArrowRight size={18} />
          </button>
        </div>
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-blue-600/10 skew-x-12 translate-x-1/2 group-hover:translate-x-1/3 transition-transform duration-700"></div>
        <div className="absolute right-20 top-1/2 -translate-y-1/2 text-slate-800 opacity-20">
          <ShieldCheck size={200} />
        </div>
      </div>

      {/* --- Modals --- */}

      {/* Service Details Modal */}
      {selectedService && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-8 space-y-8">
              <div className="flex justify-between items-start">
                <div className="flex gap-4">
                  <div className="h-16 w-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                    <Briefcase size={32} />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md uppercase tracking-wide">{selectedService.category}</span>
                      <div className="flex items-center gap-1 text-orange-500 font-bold text-xs">
                        <Star size={12} fill="currentColor" /> {selectedService.rating} ({selectedService.reviews})
                      </div>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900">{selectedService.title}</h2>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedService(null)}
                  className="p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <p className="text-slate-600 leading-relaxed text-lg">{selectedService.fullDescription}</p>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 rounded-xl">
                    <div className="text-xs font-bold text-slate-400 uppercase mb-1">Estimated Cost</div>
                    <div className="text-xl font-bold text-slate-900">{selectedService.price}</div>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl">
                    <div className="text-xs font-bold text-slate-400 uppercase mb-1">Delivery Time</div>
                    <div className="text-xl font-bold text-slate-900">3-5 Days</div>
                  </div>
                </div>

                <div className="pt-4">
                  <h4 className="font-bold text-slate-900 mb-3">What's Included</h4>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-slate-600"><CheckCircle size={16} className="text-green-500" /> Verified Expert Consultation</li>
                    <li className="flex items-center gap-2 text-slate-600"><CheckCircle size={16} className="text-green-500" /> Document Preparation & Review</li>
                    <li className="flex items-center gap-2 text-slate-600"><CheckCircle size={16} className="text-green-500" /> Unlimited Revisions</li>
                  </ul>
                </div>
              </div>

              <div className="flex gap-4 pt-4 border-t border-slate-100">
                <button className="flex-1 bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-500/20">
                  Book Now
                </button>
                <button className="px-6 py-4 border-2 border-slate-200 font-bold rounded-xl hover:bg-slate-50 transition">
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Support Modal (Chat Interface) */}
      {showSupport && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full h-[600px] shadow-2xl animate-in zoom-in-95 duration-200 relative flex flex-col overflow-hidden">

            {/* Header */}
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-900 text-white rounded-xl flex items-center justify-center shadow-lg">
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">Expert Support</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    <p className="text-xs text-slate-500 font-medium">Online</p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => { setShowSupport(false); setIsChatActive(false); setChatMessages([]); }}
                className="p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition"
              >
                <X size={20} />
              </button>
            </div>

            {/* Chat Area */}
            {!isChatActive ? (
              // Initial Start Screen
              <div className="flex-1 p-8 flex flex-col items-center justify-center text-center space-y-6">
                <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mb-2">
                  <Briefcase size={40} />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-slate-900">How can we help?</h4>
                  <p className="text-slate-500 mt-2 max-w-xs mx-auto">Describe your requirements and we'll match you with the right compliance expert.</p>
                </div>
                <div className="w-full text-left space-y-4">
                  <textarea
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 outline-none transition h-32 resize-none"
                    placeholder="E.g., I need help with GST registration for a new startup..."
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleStartChat(e);
                      }
                    }}
                  ></textarea>
                  <button
                    type="button"
                    onClick={handleStartChat}
                    disabled={!chatInput.trim()}
                    className="w-full py-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-black transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    Start Chat <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            ) : (
              // Active Chat Screen
              <>
                <div ref={chatContainerRef} className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-50/50" id="chat-container">
                  {chatMessages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] p-4 rounded-2xl ${msg.isUser
                        ? 'bg-blue-600 text-white rounded-br-none'
                        : 'bg-white border border-slate-100 text-slate-700 rounded-bl-none shadow-sm'
                        }`}>
                        <p className="text-sm leading-relaxed">{msg.text}</p>
                        <p className={`text-[10px] mt-2 opacity-70 ${msg.isUser ? 'text-blue-100' : 'text-slate-400'}`}>
                          {msg.time}
                        </p>
                      </div>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-white border border-slate-100 p-4 rounded-2xl rounded-bl-none shadow-sm flex gap-1">
                        <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
                        <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-100"></span>
                        <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-200"></span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Input Area */}
                <div className="p-4 bg-white border-t border-slate-100">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (chatInput.trim()) {
                        handleSendMessage(chatInput);
                        setChatInput('');
                      }
                    }}
                    className="flex gap-3"
                  >
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder="Type your message..."
                      className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 outline-none transition"
                    />
                    <button
                      type="submit"
                      disabled={!chatInput.trim()}
                      className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition shadow-lg disabled:opacity-50"
                    >
                      <ArrowRight size={20} />
                    </button>
                  </form>
                </div>
              </>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

// Sub-component for individual cards
const ServiceCard = ({ service, onClick }) => (
  <div
    onClick={onClick}
    className="bg-white p-6 rounded-3xl border border-slate-100 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-500/5 transition-all group flex flex-col h-full cursor-pointer"
  >
    <div className="flex justify-between items-start mb-6">
      <div className="h-12 w-12 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center group-hover:bg-blue-50 group-hover:text-blue-600 transition">
        <Briefcase size={20} />
      </div>
      {service.tag && (
        <span className="px-3 py-1 bg-orange-50 text-orange-600 text-[10px] font-black tracking-widest uppercase rounded-full">
          {service.tag}
        </span>
      )}
    </div>
    <h4 className="text-lg font-bold mb-3 text-slate-900 group-hover:text-blue-600 transition-colors">{service.title}</h4>
    <p className="text-sm text-slate-500 mb-8 flex-1 leading-relaxed">{service.description}</p>
    <div className="flex items-center justify-between pt-6 border-t border-slate-50">
      <div>
        <div className="text-[10px] font-bold text-slate-400 uppercase">Starting At</div>
        <div className="text-xl font-bold text-slate-900">{service.price}</div>
      </div>
      <div className="px-5 py-2.5 bg-slate-100 text-slate-600 font-bold rounded-xl group-hover:bg-blue-600 group-hover:text-white transition shadow-sm">
        Details
      </div>
    </div>
  </div>
);

export default Marketplace;
