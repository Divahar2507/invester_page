
import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Star
} from 'lucide-react';
import { UserRole, User, PartnerCard } from '../types';
import { talentApi } from '../api';

interface TalentPoolProps {
  initialFilter?: string;
  onConnect: (id: string, name: string) => void;
}

const TalentPool: React.FC<TalentPoolProps> = ({ initialFilter = 'All Categories', onConnect }) => {
  const [activeFilter, setActiveFilter] = useState(initialFilter);
  const [partners, setPartners] = useState<PartnerCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setActiveFilter(initialFilter);
  }, [initialFilter]);

  useEffect(() => {
    const fetchTalent = async () => {
      try {
        setIsLoading(true);
        const talent = await talentApi.list();
        const mappedPartners: PartnerCard[] = talent.map(user => ({
          id: user.id,
          role: user.role,
          name: user.organization || user.name,
          description: user.bio || `${user.role.charAt(0).toUpperCase() + user.role.slice(1)} providing professional services.`,
          image: user.avatar || `https://picsum.photos/seed/${user.id}/600/400`,
          rating: 4.5 + Math.random() * 0.5,
          reviews: Math.floor(Math.random() * 200),
          tags: [user.role.toUpperCase()],
          verified: true
        }));
        setPartners(mappedPartners);
      } catch (error) {
        console.error("Error fetching talent:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTalent();
  }, []);

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
            className={`whitespace-nowrap px-6 py-2 rounded-full text-sm font-semibold transition-all ${activeFilter === cat
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
