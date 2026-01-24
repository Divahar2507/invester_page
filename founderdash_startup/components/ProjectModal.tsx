
import React, { useState } from 'react';
import { X, Briefcase, Users, IndianRupee, FileText, Zap } from 'lucide-react';
import { ProjectType, Project } from '../types';

interface ProjectModalProps {
  type: ProjectType;
  onClose: () => void;
  onSave: (data: Partial<Project>) => void;
}

const ProjectModal: React.FC<ProjectModalProps> = ({ type, onClose, onSave }) => {
  const [formData, setFormData] = useState<Partial<Project>>({
    title: '',
    description: '',
    budget: '',
    category: type === 'execution' ? 'Freelance' : 'Full-time',
    skills: []
  });

  const [skillInput, setSkillInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const addSkill = () => {
    if (skillInput.trim()) {
      setFormData({ ...formData, skills: [...(formData.skills || []), skillInput.trim()] });
      setSkillInput('');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className={`p-6 text-white flex items-center justify-between ${type === 'execution' ? 'bg-blue-600' : 'bg-purple-600'}`}>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              {type === 'execution' ? <Zap size={20} /> : <Users size={20} />}
            </div>
            <div>
              <h2 className="text-lg font-bold">{type === 'execution' ? 'Post a New Project' : 'Find New Talent'}</h2>
              <p className="text-xs opacity-80">{type === 'execution' ? 'Describe the task you need a freelancer for' : 'Specify the roles you need from agencies/colleges'}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Title</label>
            <div className="relative">
              <FileText className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input 
                required
                type="text" 
                placeholder={type === 'execution' ? "e.g. Mobile App UI Redesign" : "e.g. React Developer for Q4 Sprint"}
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 text-sm"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Description</label>
            <textarea 
              required
              rows={3}
              placeholder="Provide a brief overview of the requirements..."
              className="w-full p-4 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 text-sm resize-none"
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Budget/Pay</label>
              <div className="relative">
                <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input 
                  type="text" 
                  placeholder="e.g. ₹50,000 - ₹1,00,000"
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 text-sm"
                  value={formData.budget}
                  onChange={e => setFormData({ ...formData, budget: e.target.value })}
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Category</label>
              <select 
                className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 text-sm appearance-none"
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value as any })}
              >
                <option value="Freelance">Freelance</option>
                <option value="Full-time">Full-time</option>
                <option value="Internship">Internship</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Required Skills</label>
            <div className="flex flex-wrap gap-2 mb-3">
              {formData.skills?.map(skill => (
                <span key={skill} className="bg-slate-100 text-slate-600 px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1">
                  {skill}
                  <button type="button" onClick={() => setFormData({ ...formData, skills: formData.skills?.filter(s => s !== skill) })}><X size={12} /></button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="Press Enter to add"
                className="flex-1 px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 text-sm"
                value={skillInput}
                onChange={e => setSkillInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSkill())}
              />
              <button 
                type="button"
                onClick={addSkill}
                className="px-4 bg-slate-200 text-slate-600 rounded-xl hover:bg-slate-300 transition-colors"
              >
                Add
              </button>
            </div>
          </div>

          <button 
            type="submit"
            className={`w-full py-4 text-white rounded-xl font-black uppercase tracking-widest shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98] ${type === 'execution' ? 'bg-blue-600 shadow-blue-200' : 'bg-purple-600 shadow-purple-200'}`}
          >
            Submit for Global Review
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProjectModal;
