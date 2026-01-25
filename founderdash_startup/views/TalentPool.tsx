
import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Star
} from 'lucide-react';
import { PartnerCard, UserRole } from '../types';

interface TalentPoolProps {
  initialFilter?: string;
  onConnect: (id: string, name: string) => void;
}

const TalentPool: React.FC<TalentPoolProps> = ({ initialFilter = 'All Categories', onConnect }) => {
  const [activeFilter, setActiveFilter] = useState(initialFilter);

  useEffect(() => {
    setActiveFilter(initialFilter);
  }, [initialFilter]);

  const partners: PartnerCard[] = [
    { id: '1', role: UserRole.AGENCY, name: 'Global Talent Recruiters', description: 'Premier hiring and executive search for high-growth tech firms.', image: 'https://picsum.photos/id/10/600/400', rating: 4.9, reviews: 120, tags: ['Recruiting', 'SaaS'], verified: true },
    { id: '2', role: UserRole.INSTITUTION, name: 'Tech University Internships', description: 'Direct access to top-tier engineering and design student talent.', image: 'https://picsum.photos/id/12/600/400', rating: 4.5, reviews: 85, tags: ['Academia', 'Internships'], verified: false },
    { id: '3', role: UserRole.FREELANCER, name: 'Creative Design Partners', description: 'Full-service branding and product design for early-stage startups.', image: 'https://picsum.photos/id/20/600/400', rating: 4.8, reviews: 210, tags: ['Branding', 'UX/UI'], verified: true },
    { id: '4', role: UserRole.AGENCY, name: 'Elite Staffing Solutions', description: 'C-suite and senior leadership recruitment specialists.', image: 'https://picsum.photos/id/35/600/400', rating: 4.7, reviews: 95, tags: ['Executive', 'Consulting'], verified: false },
    { id: '5', role: UserRole.INSTITUTION, name: 'Future Founders Office', description: 'Incubator-linked sourcing for founders and technical co-founders.', image: 'https://picsum.photos/id/42/600/400', rating: 4.6, reviews: 50, tags: ['Incubator', 'Startup'], verified: false },
    { id: '6', role: UserRole.FREELANCER, name: 'Nexus Business Partners', description: 'Strategic B2B partnerships and operational scaling consulting.', image: 'https://picsum.photos/id/50/600/400', rating: 4.8, reviews: 140, tags: ['B2B', 'Scaling'], verified: false }
  ];

  const categories = ['All Categories', 'Agencies', 'Institutions', 'Freelancers'];

  const filteredPartners = partners.filter(p => {
    if (activeFilter === 'All Categories') return true;
    if (activeFilter === 'Agencies' && p.role === UserRole.AGENCY) return true;
    if (activeFilter === 'Institutions' && p.role === UserRole.INSTITUTION) return true;
    if (activeFilter === 'Freelancers' && p.role === UserRole.FREELANCER) return true;
    return false;
  });

  return (
    <div className="space-y-8">
      {/* Directory Content Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Partner Ecosystem</h2>
        <p className="text-slate-500">Connect directly with professionals to fuel your growth.</p>
      </div>

      {/* Category Selection Tabs */}
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveFilter(cat)}
            className={`whitespace-nowrap px-6 py-2 rounded-full text-sm font-semibold transition-all ${
              activeFilter === cat 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' 
                : 'bg-white text-slate-500 border border-slate-200 hover:border-slate-300'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Partners Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredPartners.map((partner) => (
          <div key={partner.id} className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm flex flex-col group hover:shadow-lg transition-all">
            <div className="h-40 relative">
              <img src={partner.image} className="w-full h-full object-cover" alt="" />
              {partner.verified && (
                <div className="absolute top-4 left-4 bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1 uppercase">
                  <ShieldCheck size={12} /> Verified
                </div>
              )}
            </div>
            <div className="p-6 flex flex-col flex-1">
              <h4 className="font-bold text-slate-900 mb-2">{partner.name}</h4>
              <p className="text-xs text-slate-400 mb-6 line-clamp-2">{partner.description}</p>
              <div className="flex flex-wrap gap-2 mb-6">
                {partner.tags.map(t => <span key={t} className="text-[9px] font-bold px-2 py-1 bg-slate-50 rounded text-slate-500 uppercase tracking-widest">{t}</span>)}
              </div>
              <div className="pt-4 border-t border-slate-50 flex items-center justify-between mt-auto">
                <div className="flex items-center gap-1 text-xs font-bold text-slate-900">
                  <Star size={12} className="text-yellow-500 fill-yellow-500" /> {partner.rating}
                </div>
                <button 
                  onClick={() => onConnect(partner.id, partner.name)}
                  className="bg-blue-600 text-white px-6 py-2 rounded-xl text-xs font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-100"
                >
                  Connect Directly
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TalentPool;
