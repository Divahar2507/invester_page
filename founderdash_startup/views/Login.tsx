
import React, { useState } from 'react';
import { Rocket, Briefcase, GraduationCap, User, Building2 } from 'lucide-react';
import { UserRole, User as UserType } from '../types';

interface LoginProps {
  onLogin: (user: UserType) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>(UserRole.STARTUP);

  const roles = [
    { id: UserRole.STARTUP, label: 'Startup', icon: Rocket, color: 'blue' },
    { id: UserRole.AGENCY, label: 'Agency', icon: Building2, color: 'purple' },
    { id: UserRole.INSTITUTION, label: 'College & Institution', icon: GraduationCap, color: 'orange' },
    { id: UserRole.FREELANCER, label: 'Freelancer', icon: User, color: 'emerald' },
  ];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const mockUser: UserType = {
      id: Math.random().toString(36).substr(2, 9),
      name: selectedRole === UserRole.STARTUP ? 'Alex Chen' :
        selectedRole === UserRole.AGENCY ? 'Sarah Agency' :
          selectedRole === UserRole.INSTITUTION ? 'Dean Miller' : 'John Freelancer',
      role: selectedRole,
      avatar: `https://picsum.photos/seed/${selectedRole}/100/100`,
      organization: selectedRole === UserRole.STARTUP ? 'Nexus AI' :
        selectedRole === UserRole.AGENCY ? 'Global Talent' :
          selectedRole === UserRole.INSTITUTION ? 'Tech Institute' : undefined
    };
    onLogin(mockUser);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-4xl w-full flex flex-col md:flex-row">
        {/* Left Side: Branding */}
        <div className="bg-blue-600 md:w-2/5 p-12 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-8">
              <Rocket size={28} />
            </div>
            {/* Branding removed */}
            <p className="text-blue-100 leading-relaxed">
              The unified ecosystem for startups, talent agencies, and freelancers to build the future together.
            </p>
          </div>
          <div className="relative z-10 pt-8 border-t border-white/10">
            <p className="text-xs font-bold uppercase tracking-widest opacity-60">Empowering 5k+ Startups</p>
          </div>
          {/* Decorative blurs */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-3xl rounded-full -translate-x-10 -translate-y-10"></div>
        </div>

        {/* Right Side: Form */}
        <div className="p-12 md:w-3/5">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Welcome Back</h2>
          <p className="text-slate-400 mb-8">Please select your role to sign in to your workspace.</p>

          <div className="grid grid-cols-2 gap-3 mb-8">
            {roles.map((role) => {
              const Icon = role.icon;
              const isSelected = selectedRole === role.id;
              return (
                <button
                  key={role.id}
                  onClick={() => setSelectedRole(role.id)}
                  className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 group text-center ${isSelected
                    ? `border-blue-600 bg-blue-50 text-blue-600`
                    : 'border-slate-100 hover:border-slate-200 text-slate-400'
                    }`}
                >
                  <Icon size={24} className={isSelected ? 'text-blue-600' : 'group-hover:text-slate-600'} />
                  <span className="text-[10px] font-bold uppercase tracking-wide">{role.label}</span>
                </button>
              );
            })}
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 block">Email Address</label>
              <input
                type="email"
                defaultValue="demo@founderdash.io"
                className="w-full p-4 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-900"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 block">Password</label>
              <input
                type="password"
                defaultValue="password"
                className="w-full p-4 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-900"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition-colors shadow-lg"
            >
              Sign In
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-slate-400">
            Don't have an account? <span className="text-blue-600 font-bold cursor-pointer hover:underline">Register your business</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
