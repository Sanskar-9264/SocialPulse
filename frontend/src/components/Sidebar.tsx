import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Home, Compass, User as UserIcon, Sparkles } from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { user, loginAsDemoUser } = useAuth();

  const navItems = [
    { label: 'Home Feed', path: '/', icon: Home },
    { label: 'Explore People', path: '/explore', icon: Compass },
    ...(user ? [{ label: 'My Profile', path: `/user/${user.username}`, icon: UserIcon }] : []),
  ];

  return (
    <aside className="sticky top-20 w-64 shrink-0 hidden md:block">
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-4 space-y-6">
        {/* Navigation Links */}
        <nav className="space-y-1.5">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Demo User Switcher Card */}
        <div className="pt-4 border-t border-slate-800/80">
          <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-3.5">
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Quick Demo Accounts</span>
            </div>
            <p className="text-xs text-slate-400 mb-3">Switch demo profiles instantly:</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => loginAsDemoUser('alex_dev')}
                className="text-xs bg-slate-800 hover:bg-indigo-900/50 hover:text-indigo-300 text-slate-300 py-1.5 px-2 rounded-xl transition-colors border border-slate-700/60 text-center truncate"
              >
                @alex_dev
              </button>
              <button
                onClick={() => loginAsDemoUser('sarah_design')}
                className="text-xs bg-slate-800 hover:bg-indigo-900/50 hover:text-indigo-300 text-slate-300 py-1.5 px-2 rounded-xl transition-colors border border-slate-700/60 text-center truncate"
              >
                @sarah_design
              </button>
              <button
                onClick={() => loginAsDemoUser('marcus_tech')}
                className="text-xs bg-slate-800 hover:bg-indigo-900/50 hover:text-indigo-300 text-slate-300 py-1.5 px-2 rounded-xl transition-colors border border-slate-700/60 text-center truncate"
              >
                @marcus_tech
              </button>
              <button
                onClick={() => loginAsDemoUser('emma_travel')}
                className="text-xs bg-slate-800 hover:bg-indigo-900/50 hover:text-indigo-300 text-slate-300 py-1.5 px-2 rounded-xl transition-colors border border-slate-700/60 text-center truncate"
              >
                @emma_travel
              </button>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
