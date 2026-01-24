
import React from 'react';
import { 
  TrendingUp, 
  Users, 
  Search, 
  ArrowRight, 
  Lightbulb, 
  Leaf, 
  HeartPulse, 
  Wallet,
  Star
} from 'lucide-react';
import { ProjectConcept } from '../types';

const Marketplace: React.FC = () => {
  const concepts: ProjectConcept[] = [
    {
      id: '1',
      title: 'Eco-Track: Carbon Credits',
      description: 'Simplifying corporate sustainability by using AI to automate tracking and...',
      image: 'https://picsum.photos/id/11/600/400',
      tags: ['AI', 'SaaS'],
      maturity: 25,
      maturityLabel: 'IDEATION',
      rating: 4.9,
      author: { name: 'Sarah Chen', avatar: 'https://picsum.photos/id/100/50/50' }
    },
    {
      id: '2',
      title: 'HealthBridge: Rural Clinics',
      description: 'Low-cost diagnostic hardware that connects remote village clinics directly to specialist...',
      image: 'https://picsum.photos/id/21/600/400',
      tags: ['HARDWARE', 'IOT'],
      maturity: 60,
      maturityLabel: 'PROTOTYPE',
      rating: 4.7,
      author: { name: 'Marcus Thorne', avatar: 'https://picsum.photos/id/101/50/50' }
    },
    {
      id: '3',
      title: 'FinFlow: Decentralized Payroll',
      description: 'Automating global payroll compliance and payments using stablecoins and smart contract...',
      image: 'https://picsum.photos/id/31/600/400',
      tags: ['FINTECH', 'WEB3'],
      maturity: 85,
      maturityLabel: 'MVP',
      rating: 5.0,
      author: { name: 'Elena Rodriguez', avatar: 'https://picsum.photos/id/102/50/50' }
    }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Main Content Area */}
      <div className="lg:col-span-3 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Marketplace</h2>
            <p className="text-slate-500 mt-2">Discover vetted concepts and find your next venture partner.</p>
          </div>
          <button className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 transition-all shadow-xl shadow-blue-200">
            <PlusIcon />
            Pitch Your Idea
          </button>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4 py-2 overflow-x-auto scrollbar-hide">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest shrink-0">Filters:</span>
          <select className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold text-sm focus:outline-none">
            <option>All Sectors</option>
          </select>
          <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-500 hover:border-slate-300">AI & ML</button>
          <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-500 hover:border-slate-300">Fintech</button>
          <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-500 hover:border-slate-300">Sustainability</button>
          <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-500 hover:border-slate-300">Healthcare</button>
          <button className="px-4 py-2 bg-slate-100 rounded-lg text-sm font-bold text-slate-900 flex items-center gap-2">
            Stage: Ideation
            <XIcon />
          </button>
        </div>

        {/* Concept Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {concepts.map((concept) => (
            <div key={concept.id} className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm flex flex-col group hover:shadow-lg transition-all border-b-4 border-b-transparent hover:border-b-blue-600">
              <div className="h-48 relative overflow-hidden">
                <img src={concept.image} alt={concept.title} className="w-full h-full object-cover" />
                <div className="absolute top-4 right-4 bg-white/95 px-2 py-1 rounded-lg flex items-center gap-1 text-[10px] font-bold">
                  <Star size={10} className="text-yellow-500 fill-yellow-500" />
                  {concept.rating}
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex gap-2">
                  {concept.tags.map(tag => (
                    <span key={tag} className="text-[9px] font-black tracking-widest bg-blue-50 text-blue-600 px-2 py-0.5 rounded uppercase">{tag}</span>
                  ))}
                </div>
                <div>
                  <h4 className="font-bold text-lg text-slate-900 mb-1 leading-tight">{concept.title}</h4>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{concept.description}</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-[9px] font-black uppercase tracking-widest">
                    <span className="text-slate-400">Maturity: {concept.maturityLabel}</span>
                    <span className="text-blue-600">{concept.maturity}%</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 rounded-full transition-all duration-1000" style={{ width: `${concept.maturity}%` }}></div>
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-between border-t border-slate-50">
                  <div className="flex items-center gap-2">
                    <img src={concept.author.avatar} alt={concept.author.name} className="w-6 h-6 rounded-full border border-slate-100" />
                    <div className="w-6 h-6 rounded-full bg-slate-900 flex items-center justify-center">
                      <PlusIcon size={10} color="white" />
                    </div>
                  </div>
                  <button className="text-blue-600 text-xs font-bold flex items-center gap-1 group-hover:gap-2 transition-all">
                    View Details
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="space-y-8">
        
        {/* Trending Concepts */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp size={20} className="text-blue-600" />
            <h3 className="font-bold text-slate-900">Trending Concepts</h3>
          </div>
          <div className="space-y-6">
            <TrendingItem icon={Lightbulb} color="bg-orange-100 text-orange-600" title="SolarShare Grid" views="1.2k" likes="450" />
            <TrendingItem icon={Leaf} color="bg-green-100 text-green-600" title="Bio-Meat Pro" views="940" likes="321" />
            <button className="w-full py-3 border border-slate-200 rounded-xl text-xs font-bold text-slate-400 hover:bg-slate-50 transition-colors uppercase tracking-widest">
              View All Trending
            </button>
          </div>
        </div>

        {/* Top Innovators */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <Users size={20} className="text-blue-600" />
            <h3 className="font-bold text-slate-900">Top Innovators</h3>
          </div>
          <div className="space-y-6">
            <InnovatorItem name="Sarah Chen" desc="3 Successful Exits" score={4.9} avatar="https://picsum.photos/id/64/100/100" />
            <InnovatorItem name="Marcus Thorne" desc="Tech Lead @ Neuro" score={4.8} avatar="https://picsum.photos/id/65/100/100" />
            <InnovatorItem name="Elena Rodriguez" desc="Sustainability Expert" score={4.8} avatar="https://picsum.photos/id/66/100/100" />
          </div>
        </div>

        {/* Call to Action Card */}
        <div className="bg-blue-600 rounded-2xl p-8 text-white relative overflow-hidden group">
          <div className="relative z-10">
            <h3 className="text-lg font-bold mb-4">Need a Team?</h3>
            <p className="text-xs opacity-80 mb-8 leading-relaxed">
              Our agency partners can help you build your MVP in weeks.
            </p>
            <button className="bg-white text-blue-600 px-6 py-2.5 rounded-lg font-bold text-sm hover:scale-105 transition-transform">
              Find Agency
            </button>
          </div>
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/10 rounded-full translate-x-10 translate-y-10 group-hover:scale-150 transition-transform duration-700"></div>
        </div>
      </div>
    </div>
  );
};

const TrendingItem = ({ icon: Icon, color, title, views, likes }: any) => (
  <div className="flex items-start gap-3">
    <div className={`p-2 rounded-lg shrink-0 ${color}`}>
      <Icon size={18} />
    </div>
    <div className="flex-1 min-w-0">
      <h4 className="text-sm font-bold text-slate-900 mb-1">{title}</h4>
      <p className="text-[10px] text-slate-400 mb-2">P2P energy marketplace for urban centers.</p>
      <div className="flex items-center gap-3 text-[10px] font-bold text-blue-600">
        <span className="flex items-center gap-1 opacity-70"><EyeIcon /> {views}</span>
        <span className="flex items-center gap-1"><ThumbsUpIcon /> {likes}</span>
      </div>
    </div>
  </div>
);

const InnovatorItem = ({ name, desc, score, avatar }: any) => (
  <div className="flex items-center gap-3">
    <img src={avatar} className="w-10 h-10 rounded-full border border-slate-100" alt={name} />
    <div className="flex-1 min-w-0">
      <h4 className="text-sm font-bold text-slate-900 truncate">{name}</h4>
      <p className="text-[10px] text-slate-400">{desc}</p>
    </div>
    <div className="flex items-center gap-1 text-[10px] font-bold text-yellow-600">
      <Star size={10} className="fill-yellow-600" />
      {score}
    </div>
  </div>
);

// Minimal Icon replacements
const PlusIcon = ({ size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
);
const EyeIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
);
const ThumbsUpIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg>
);
const XIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
);

export default Marketplace;
