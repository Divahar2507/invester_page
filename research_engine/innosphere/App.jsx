
import React, { useState, useEffect, createContext, useContext } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import {
  Bell,
  Search,
  Settings as SettingsIcon,
  Menu,
  X,
  LogOut,
  LayoutDashboard,
  FlaskConical,
  Users,
  MapPin,
  BookOpen,
  Sun,
  Moon
} from 'lucide-react';
import { NAV_ITEMS, ICON_MAP } from './constants';
import Dashboard from './pages/Dashboard';
import Research from './pages/Research';
import Mentors from './pages/Mentors';
import TechParks from './pages/TechParks';
import Seminars from './pages/Seminars';
import ResearchEngine from './pages/ResearchEngine';

// Shared State Contexts
export const ThemeContext = createContext({ isDark: false, toggleTheme: () => { } });
export const WatchListContext = createContext({
  watchList: new Set(),
  toggleWatchList: (id) => { }
});

const Sidebar = ({ isOpen, toggle }) => {
  const location = useLocation();
  const { isDark } = useContext(ThemeContext);

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/20 z-40 lg:hidden backdrop-blur-sm"
          onClick={toggle}
        />
      )}

      <div className={`
        fixed lg:static inset-y-0 left-0 z-50 w-60 bg-white dark:bg-slate-900 border-r border-slate-200/60 dark:border-slate-800
        transform transition-all duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        flex flex-col
      `}>
        <div className="p-6 flex items-center gap-3">
          <div>
            <h1 className="font-extrabold text-slate-900 dark:text-white tracking-tighter leading-none text-lg uppercase italic">InnoSphere</h1>
            <p className="text-[9px] text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-[0.2em] mt-1">Portal</p>
          </div>
        </div>

        <nav className="flex-1 px-4 mt-4 space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = ICON_MAP[item.icon];
            const isActive = location.pathname === item.path || (item.path === '/' && location.pathname === '');

            return (
              <Link
                key={item.id}
                to={item.path}
                onClick={() => window.innerWidth < 1024 && toggle()}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold transition-all duration-200 group
                  ${isActive
                    ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400'
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-800 dark:hover:text-slate-200'}
                `}
              >
                <Icon size={18} className={isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300'} />
                <span className="text-xs">{item.label}</span>
                {isActive && <div className="ml-auto w-1 h-1 rounded-full bg-indigo-500 dark:bg-indigo-400" />}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 space-y-3">
          <div className="bg-slate-50 dark:bg-slate-800/40 rounded-xl p-3 border border-slate-100 dark:border-slate-800">
            <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-2">System</p>
            <button className="flex items-center gap-2 text-slate-600 dark:text-slate-400 text-[11px] font-bold hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              <SettingsIcon size={14} /> Help Center
            </button>
          </div>
          <button className="flex items-center gap-2 px-3 py-2 w-full text-rose-500 font-bold text-xs rounded-xl hover:bg-rose-50 dark:hover:bg-rose-900/10 transition-colors">
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </>
  );
};

const TopNav = ({ onMenuToggle }) => {
  const { isDark, toggleTheme } = useContext(ThemeContext);

  return (
    <header className="h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-800 px-4 lg:px-8 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-4 flex-1">
        <button onClick={onMenuToggle} className="lg:hidden p-2 text-slate-700 dark:text-slate-300">
          <Menu size={20} />
        </button>
        <div className="relative max-w-sm w-full hidden md:block">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            placeholder="Search projects..."
            className="w-full pl-10 pr-4 py-2 bg-slate-100/50 dark:bg-slate-800/50 border border-transparent rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900 transition-all dark:text-white"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={toggleTheme}
          className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <button className="relative p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all">
          <Bell size={18} />
          <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-indigo-500 rounded-full border-2 border-white dark:border-slate-900"></span>
        </button>

        <div className="h-8 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block"></div>

        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold text-slate-900 dark:text-white leading-none">Dr. Sarah Chen</p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold mt-1 uppercase tracking-tighter">Level 4</p>
          </div>
          <img
            src="https://picsum.photos/seed/sarah-profile/100"
            alt="Profile"
            className="w-9 h-9 rounded-xl object-cover ring-2 ring-white dark:ring-slate-800"
          />
        </div>
      </div>
    </header>
  );
};

const App = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [watchList, setWatchList] = useState(new Set());

  const toggleWatchList = (id) => {
    setWatchList(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme: () => setIsDark(!isDark) }}>
      <WatchListContext.Provider value={{ watchList, toggleWatchList }}>
        <Router>
          <div className={`flex min-h-screen transition-colors duration-300 ${isDark ? 'bg-slate-950 text-slate-100' : 'bg-[#EEF2F7] text-slate-900'}`}>
            <Sidebar isOpen={isSidebarOpen} toggle={() => setIsSidebarOpen(!isSidebarOpen)} />

            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
              <TopNav onMenuToggle={() => setIsSidebarOpen(true)} />

              <main className="flex-1 overflow-y-auto p-4 lg:p-8">
                <div className="max-w-7xl mx-auto">
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/research" element={<Research />} />
                    <Route path="/mentors" element={<Mentors />} />
                    <Route path="/techparks" element={<TechParks />} />
                    <Route path="/seminars" element={<Seminars />} />
                    <Route path="/research-engine" element={<ResearchEngine />} />
                  </Routes>
                </div>
              </main>
            </div>
          </div>
        </Router>
      </WatchListContext.Provider>
    </ThemeContext.Provider>
  );
};

export default App;
