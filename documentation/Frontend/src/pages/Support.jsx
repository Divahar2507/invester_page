import React, { useState } from 'react';
import { HelpCircle, Mail, Phone, MessageSquare, ChevronDown, ChevronUp, FileText, Send } from 'lucide-react';

const Support = () => {
    const [openFaq, setOpenFaq] = useState(null);
    const [activeModal, setActiveModal] = useState(null);

    const faqs = [
        {
            question: "How do I update my GST details?",
            answer: "You can update your GST details by navigating to the Settings page and editing your Organization Details. For sensitive changes, please raise a support ticket."
        },
        {
            question: "What is the deadline for annual filings?",
            answer: "The standard deadline for MCA annual filing is 30th September. However, this may vary based on your company type and financial year end. Check the 'Dashboard' overview for your specific deadlines."
        },
        {
            question: "Can I add multiple users to my account?",
            answer: "Yes, you can add team members under Settings > Team Management. This feature is available on the Growth and Enterprise specific plans."
        },
        {
            question: "How secure is my document data?",
            answer: "We use bank-grade 256-bit SSL encryption for all data transmission and storage. Your documents are stored in secure AWS S3 buckets with restricted access controls."
        }
    ];

    const [chatMessages, setChatMessages] = useState([
        { id: 1, sender: 'agent', text: 'Hello! Before we connect you, could you please specify your query topic?' },
    ]);
    const [chatInput, setChatInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);

    const handleSendMessage = () => {
        if (!chatInput.trim()) return;

        const userMsg = { id: Date.now(), sender: 'user', text: chatInput };
        setChatMessages(prev => [...prev, userMsg]);
        setChatInput('');
        setIsTyping(true);

        // Auto-response simulation
        setTimeout(() => {
            const responses = [
                "I understand. Let me check the details for you.",
                "Could you please provide your GSTIN number?",
                "I'm engaging a specialist to look into this right now.",
                "Is there anything else you'd like to add?",
                "Thanks for the info. Please hold on a moment."
            ];
            const randomResponse = responses[Math.floor(Math.random() * responses.length)];

            const agentMsg = { id: Date.now() + 1, sender: 'agent', text: randomResponse };
            setChatMessages(prev => [...prev, agentMsg]);
            setIsTyping(false);
        }, 2000);
    };

    const renderModal = () => {
        if (!activeModal) return null;

        const closeModal = () => {
            setActiveModal(null);
            // Optional: Reset chat on close or keep history
        };

        return (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
                <div className="bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl relative animate-in zoom-in-95">
                    <button onClick={closeModal} className="absolute top-6 right-6 p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition">
                        <svg className="h-5 w-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>

                    {activeModal === 'chat' && (
                        <>
                            <div className="flex items-center gap-4 mb-6">
                                <div className="h-14 w-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                                    <MessageSquare size={28} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900">Live Support Chat</h3>
                                    <p className="text-sm text-slate-500">Connecting to next available agent...</p>
                                </div>
                            </div>
                            <div className="bg-slate-50 h-80 rounded-2xl p-4 overflow-y-auto mb-4 border border-slate-100 flex flex-col gap-3 custom-scrollbar">
                                {chatMessages.map(msg => (
                                    <div key={msg.id} className={`self-${msg.sender === 'user' ? 'end' : 'start'} bg-${msg.sender === 'user' ? 'blue-600 text-white' : 'white border border-slate-200 text-slate-700'} p-3 rounded-2xl ${msg.sender === 'user' ? 'rounded-tr-none' : 'rounded-tl-none'} text-sm shadow-sm max-w-[85%]`}>
                                        {msg.text}
                                    </div>
                                ))}
                                {isTyping && (
                                    <div className="flex gap-2 items-center text-xs text-slate-400 pl-2 mt-2">
                                        <div className="flex gap-1">
                                            <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                                            <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-75"></span>
                                            <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-150"></span>
                                        </div>
                                        Agent typing
                                    </div>
                                )}
                            </div>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Type your message..."
                                    value={chatInput}
                                    onChange={(e) => setChatInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500"
                                />
                                <button
                                    onClick={handleSendMessage}
                                    className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 transition"
                                >
                                    <Send size={20} />
                                </button>
                            </div>
                        </>
                    )}

                    {activeModal === 'email' && (
                        <>
                            <div className="flex items-center gap-4 mb-6">
                                <div className="h-14 w-14 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center">
                                    <Mail size={28} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900">Email Support</h3>
                                    <p className="text-sm text-slate-500">Submit a ticket for detailed queries.</p>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Subject</label>
                                    <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold">
                                        <option>Technical Issue</option>
                                        <option>Billing Question</option>
                                        <option>Compliance Assistance</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Message</label>
                                    <textarea className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm h-32 focus:outline-none focus:border-blue-500" placeholder="Describe your issue detailed..."></textarea>
                                </div>
                                <button onClick={closeModal} className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-black transition">Send Ticket</button>
                            </div>
                        </>
                    )}

                    {activeModal === 'phone' && (
                        <div className="text-center">
                            <div className="h-16 w-16 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Phone size={32} />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-2">Call Direct Support</h3>
                            <p className="text-slate-500 mb-8">Priority line for Enterprise customers.</p>

                            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 mb-6">
                                <div className="text-3xl font-black text-slate-900 tracking-tight">+1 (888) 123-4567</div>
                                <div className="text-xs font-bold text-green-600 uppercase mt-2 bg-green-50 inline-block px-3 py-1 rounded-full">Available Now</div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div className="bg-slate-50 p-4 rounded-xl">
                                    <div className="font-bold text-slate-700">Wait Time</div>
                                    <div className="text-slate-500">&lt; 2 mins</div>
                                </div>
                                <div className="bg-slate-50 p-4 rounded-xl">
                                    <div className="font-bold text-slate-700">Languages</div>
                                    <div className="text-slate-500">EN, ES, HI</div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="max-w-4xl mx-auto space-y-10 pb-20">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 mb-2">Help & Support</h1>
                <p className="text-slate-500">Find answers to common questions or connect with our support team.</p>
            </div>

            {/* Contact Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div
                    onClick={() => setActiveModal('chat')}
                    className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:border-blue-200 transition group cursor-pointer hover:shadow-xl"
                >
                    <div className="h-12 w-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition">
                        <MessageSquare size={24} />
                    </div>
                    <h3 className="font-bold text-slate-900 mb-1">Live Chat</h3>
                    <p className="text-xs text-slate-500 mb-4">Chat with our compliance experts in real-time.</p>
                    <button className="text-sm font-bold text-blue-600 flex items-center gap-1 group-hover:gap-2 transition-all">Start Chat <Send size={14} /></button>
                </div>

                <div
                    onClick={() => setActiveModal('email')}
                    className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:border-blue-200 transition group cursor-pointer hover:shadow-xl"
                >
                    <div className="h-12 w-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition">
                        <Mail size={24} />
                    </div>
                    <h3 className="font-bold text-slate-900 mb-1">Email Support</h3>
                    <p className="text-xs text-slate-500 mb-4">Get a response within 24 hours.</p>
                    <button className="text-sm font-bold text-green-600">support@compliancepro.com</button>
                </div>

                <div
                    onClick={() => setActiveModal('phone')}
                    className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:border-blue-200 transition group cursor-pointer hover:shadow-xl"
                >
                    <div className="h-12 w-12 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition">
                        <Phone size={24} />
                    </div>
                    <h3 className="font-bold text-slate-900 mb-1">Phone Support</h3>
                    <p className="text-xs text-slate-500 mb-4">Mon-Fri, 9am - 6pm EST.</p>
                    <button className="text-sm font-bold text-orange-600">+1 (888) 123-4567</button>
                </div>
            </div>

            {renderModal()}

            {/* FAQ Section */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 md:p-12">
                <h3 className="text-xl font-bold text-slate-900 mb-8">Frequently Asked Questions</h3>
                <div className="space-y-4">
                    {faqs.map((faq, idx) => (
                        <div key={idx} className="border border-slate-100 rounded-2xl overflow-hidden">
                            <button
                                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                                className="w-full flex items-center justify-between p-6 bg-slate-50 hover:bg-slate-100 transition text-left"
                            >
                                <span className="font-bold text-slate-700">{faq.question}</span>
                                {openFaq === idx ? <ChevronUp size={20} className="text-slate-400" /> : <ChevronDown size={20} className="text-slate-400" />}
                            </button>
                            {openFaq === idx && (
                                <div className="p-6 bg-white border-t border-slate-100">
                                    <p className="text-slate-600 leading-relaxed text-sm">{faq.answer}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Ticket Status */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-slate-900">Recent Tickets</h3>
                    <button className="text-sm font-bold text-blue-600 hover:underline">View All</button>
                </div>
                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-10 bg-white border border-slate-200 rounded-lg flex items-center justify-center text-slate-400">
                                <FileText size={20} />
                            </div>
                            <div>
                                <div className="font-bold text-slate-900 text-sm">##8821 - Invoice Correction</div>
                                <div className="text-xs text-slate-500">Updated 2 hours ago</div>
                            </div>
                        </div>
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 text-[10px] font-bold uppercase rounded-lg">In Progress</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-10 bg-white border border-slate-200 rounded-lg flex items-center justify-center text-slate-400">
                                <HelpCircle size={20} />
                            </div>
                            <div>
                                <div className="font-bold text-slate-900 text-sm">##8805 - Login Issue</div>
                                <div className="text-xs text-slate-500">Updated 1 day ago</div>
                            </div>
                        </div>
                        <span className="px-3 py-1 bg-green-100 text-green-700 text-[10px] font-bold uppercase rounded-lg">Resolved</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Support;
