import * as React from 'react';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
    TrendingUp,
    Mail,
    Phone,
    Clock,
    MessageSquare,
    Paperclip,
    ChevronDown,
    Send,
    X,
    MessageCircle
} from 'lucide-react';

const ContactSupport = () => {
    const navigate = useNavigate();
    const [openFaq, setOpenFaq] = useState(null);
    const [isChatOpen, setIsChatOpen] = useState(false);

    const faqs = [
        {
            question: "How does the investor matching algorithm work?",
            answer: "Our proprietary algorithm analyzes over 50 data points including sector focus, investment stage, geographical preference, and past investment patterns to connect you with the most compatible partners."
        },
        {
            question: "Can I collaborate with my team in real-time?",
            answer: "Yes! You can invite team members to your workspace, share drafts of your pitch deck, and leave contextual comments on specific slides or data room documents."
        },
        {
            question: "How do I export my pitch deck?",
            answer: "You can export your pitch deck in high-quality PDF or interactive HTML formats directly from the 'Project' menu in your dashboard."
        },
        {
            question: "What is the typical support response time?",
            answer: "Our standard response time for email inquiries is under 4 hours during business hours. Live chat typically connects you with an agent in less than 2 minutes."
        }
    ];

    const toggleFaq = (index) => {
        setOpenFaq(openFaq === index ? null : index);
    };

    return (
        <div className="min-h-screen bg-slate-50/30 font-sans text-slate-900 pb-20">
            {/* Header / Nav */}
            <div className="w-full px-8 py-6 flex items-center justify-between border-b border-white bg-white/50 backdrop-blur-md sticky top-0 z-50">
                <div className="flex items-center gap-2">
                    <div className="bg-blue-600 w-8 h-8 rounded-lg flex items-center justify-center">
                        <TrendingUp size={18} className="text-white" />
                    </div>
                    <span className="text-xl font-black text-slate-900 tracking-tight">StartupPitch</span>
                </div>
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-900"
                >
                    <X size={24} />
                </button>
            </div>

            <div className="max-w-6xl mx-auto px-6 pt-16 space-y-16">
                {/* Hero section */}
                <div className="space-y-4">
                    <h1 className="text-5xl font-black tracking-tight">Contact Support</h1>
                    <p className="text-lg text-slate-500 font-medium max-w-2xl leading-relaxed">
                        Having trouble with your pitch deck or investor matching? Fill out the form below or chat with us for immediate assistance.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    {/* Form Section */}
                    <div className="lg:col-span-8 bg-white rounded-[32px] border border-slate-100 shadow-xl shadow-slate-200/50 p-10 space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="text-sm font-bold text-slate-900 ml-1">Name</label>
                                <input
                                    type="text"
                                    placeholder="Alex Johnson"
                                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium text-slate-900 placeholder:text-slate-300"
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-sm font-bold text-slate-900 ml-1">Email</label>
                                <input
                                    type="email"
                                    placeholder="alex@startup.io"
                                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium text-slate-900 placeholder:text-slate-300"
                                />
                            </div>
                        </div>

                        <div className="space-y-3 font-semibold">
                            <label className="text-sm font-bold text-slate-900 ml-1">Subject</label>
                            <div className="relative">
                                <select className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium text-slate-900 appearance-none cursor-pointer">
                                    <option value="">Select a topic</option>
                                    <option>Account Access</option>
                                    <option>Investment Matching</option>
                                    <option>Technical Issue</option>
                                    <option>Billing</option>
                                </select>
                                <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={20} />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-sm font-bold text-slate-900 ml-1">Message</label>
                            <textarea
                                rows={6}
                                placeholder="Describe your issue or question in detail..."
                                className="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-[28px] focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium text-slate-900 placeholder:text-slate-300 resize-none leading-relaxed"
                            ></textarea>
                        </div>

                        <button className="flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors px-2">
                            <Paperclip size={18} />
                            Attach screenshot or file
                        </button>

                        <button className="w-full py-5 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 shadow-2xl shadow-blue-200 transition-all active:scale-95 flex items-center justify-center gap-3 text-lg tracking-tight">
                            Send Message <Send size={20} />
                        </button>
                    </div>

                    {/* Sidebar Section */}
                    <div className="lg:col-span-4 space-y-6">
                        {/* Live Chat Card */}
                        <div className="bg-white rounded-[32px] border border-slate-100 shadow-xl shadow-slate-200/50 p-8 space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                                    <MessageSquare size={24} />
                                </div>
                                <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100">
                                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                                    <span className="text-[10px] font-black uppercase tracking-wider">Online</span>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-xl font-black tracking-tight">Live Chat Support</h3>
                                <p className="text-sm text-slate-500 font-medium leading-relaxed">
                                    Need immediate help? Start a chat with our support team. Typical reply time: <span className="text-slate-900 font-bold">~2 mins</span>.
                                </p>
                            </div>
                            <button className="w-full py-4 bg-slate-900 text-white font-black rounded-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-3 text-sm active:scale-95">
                                Start Live Chat <MessageCircle size={18} />
                            </button>
                        </div>

                        {/* Direct Contact Card */}
                        <div className="bg-blue-600 rounded-[32px] p-8 text-white space-y-8 shadow-2xl shadow-blue-200">
                            <h3 className="text-xl font-black tracking-tight">Direct Contact</h3>
                            <div className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center border border-white/20">
                                        <Mail size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-blue-200">Email Us</p>
                                        <p className="text-sm font-bold">support@pitchperfect.com</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center border border-white/20">
                                        <Phone size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-blue-200">Call Us</p>
                                        <p className="text-sm font-bold">+1 (555) 012-3456</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center border border-white/20">
                                        <Clock size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-blue-200">Support Hours</p>
                                        <p className="text-sm font-bold">Mon-Fri, 9am - 6pm EST</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* FAQ Section */}
                <div className="space-y-10 pt-10">
                    <h2 className="text-2xl font-black tracking-tight">Frequently Asked Questions</h2>
                    <div className="grid grid-cols-1 gap-4">
                        {faqs.map((faq, index) => (
                            <div key={index} className="bg-white border border-slate-100 rounded-2xl overflow-hidden active:scale-[0.99] transition-all">
                                <button
                                    onClick={() => toggleFaq(index)}
                                    className="w-full px-8 py-6 flex items-center justify-between hover:bg-slate-50/50 transition-colors"
                                >
                                    <span className="text-lg font-bold text-slate-900 text-left">{faq.question}</span>
                                    <ChevronDown
                                        size={20}
                                        className={`text-slate-400 transition-transform duration-300 ${openFaq === index ? 'rotate-180' : ''}`}
                                    />
                                </button>
                                {openFaq === index && (
                                    <div className="px-8 pb-8 pt-2 text-slate-500 font-medium leading-relaxed animate-in slide-in-from-top-4 duration-300">
                                        {faq.answer}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Footer Branding */}
            <div className="max-w-6xl mx-auto px-6 mt-24 pt-8 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-2 grayscale brightness-0 opacity-20">
                    <TrendingUp size={24} />
                    <span className="text-xl font-black tracking-tight">StartupPitch</span>
                </div>
                <p className="text-[10px] font-bold text-slate-400">© 2024 StartupPitch Inc. All rights reserved.</p>
                <div className="flex items-center gap-6">
                    <a href="#" className="text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors">Privacy Policy</a>
                    <a href="#" className="text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors">Terms of Service</a>
                </div>
            </div>

            {/* Floating Widget */}
            <button
                onClick={() => setIsChatOpen(!isChatOpen)}
                className="fixed bottom-10 right-10 bg-blue-600 text-white px-6 py-4 rounded-full shadow-2xl shadow-blue-200 hover:bg-blue-700 transition-all hover:-translate-y-1 active:scale-95 flex items-center gap-3 z-50 overflow-hidden"
            >
                <div className="relative">
                    <MessageSquare size={20} />
                    <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-blue-600"></div>
                </div>
                <span className="text-sm font-black tracking-tight">{isChatOpen ? 'Close Chat' : 'Chat with us'}</span>
            </button>

            {/* Chat Window */}
            {isChatOpen && (
                <div className="fixed bottom-28 right-10 w-[380px] bg-white rounded-[32px] shadow-2xl border border-slate-100 z-[60] overflow-hidden animate-in slide-in-from-bottom-8 zoom-in-95 duration-300">
                    {/* Chat Header */}
                    <div className="bg-blue-600 p-6 text-white text-left">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-white/20 border border-white/20 flex items-center justify-center font-bold">SP</div>
                                <div>
                                    <h4 className="text-sm font-bold">Support Agent</h4>
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></div>
                                        <span className="text-[10px] font-bold text-blue-100 uppercase tracking-wider">Online</span>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsChatOpen(false)}
                                className="p-2 hover:bg-white/10 rounded-full transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <p className="text-xs text-blue-50 font-medium">Hello! How can we help you today?</p>
                    </div>

                    {/* Chat Messages */}
                    <div className="h-80 overflow-y-auto p-6 space-y-4 bg-slate-50/50">
                        <div className="flex gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-[10px] font-bold shrink-0">SP</div>
                            <div className="bg-white border border-slate-100 p-3 rounded-2xl rounded-tl-sm shadow-sm">
                                <p className="text-xs font-medium text-slate-700 leading-relaxed text-left">
                                    Welcome to StartupPitch support! One of our agents will be with you in a moment.
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-row-reverse gap-3">
                            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 text-[10px] font-bold shrink-0 border border-slate-300">ME</div>
                            <div className="bg-blue-600 p-3 rounded-2xl rounded-tr-sm shadow-sm">
                                <p className="text-xs font-medium text-white leading-relaxed text-left">
                                    Hi, I have a question about my pitch deck export.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Chat Input */}
                    <div className="p-4 bg-white border-t border-slate-100">
                        <div className="flex items-center gap-2 bg-slate-50 rounded-2xl px-4 py-1 border border-slate-100 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-500/10 transition-all">
                            <input
                                type="text"
                                placeholder="Type a message..."
                                className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-medium py-3 outline-none"
                            />
                            <div className="flex items-center gap-1">
                                <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors">
                                    <Paperclip size={18} />
                                </button>
                                <button className="p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-md active:scale-95">
                                    <Send size={14} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ContactSupport;
