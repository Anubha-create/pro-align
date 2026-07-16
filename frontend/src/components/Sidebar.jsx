import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  LayoutDashboard, 
  FileSearch, 
  HelpCircle, 
  Settings as SettingsIcon, 
  LogOut, 
  Sun, 
  Moon 
} from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const { user, logout, theme, toggleTheme } = useApp();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'analyzer', label: 'Analyzer', icon: FileSearch },
    { id: 'questions', label: 'Questions', icon: HelpCircle },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-400 flex flex-col border-r border-slate-800 h-screen sticky top-0">
      {/* Brand logo with stylish vector target icon */}
      <div className="h-16 flex items-center px-6 border-b border-slate-800 gap-3">
        <svg 
          className="w-8 h-8 text-teal-400 drop-shadow-[0_2px_8px_rgba(45,212,191,0.2)]" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" stroke="url(#logo-grad)" />
          <circle cx="12" cy="12" r="6" />
          <circle cx="12" cy="12" r="2" fill="currentColor" />
          <line x1="12" y1="2" x2="12" y2="6" />
          <line x1="12" y1="18" x2="12" y2="22" />
          <line x1="2" y1="12" x2="6" y2="12" />
          <line x1="18" y1="12" x2="22" y2="12" />
          <defs>
            <linearGradient id="logo-grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#14b8a6" />
            </linearGradient>
          </defs>
        </svg>
        <span className="font-bold text-slate-100 text-lg tracking-wider">PRO-ALIGN</span>
      </div>

      {/* Nav Menu */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition ${
                isActive 
                  ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-md shadow-blue-500/10' 
                  : 'hover:bg-slate-800/60 hover:text-slate-200'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`} />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Footer / User Profile & Actions */}
      <div className="p-4 border-t border-slate-800 space-y-4">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl hover:bg-slate-800/60 hover:text-slate-200 text-sm font-semibold transition"
        >
          <span className="flex items-center gap-3">
            {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-yellow-400" />}
            {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
          </span>
          <div className="w-7 h-4 bg-slate-700 rounded-full p-0.5 flex justify-start dark:justify-end transition duration-300">
            <div className="w-3 h-3 rounded-full bg-slate-300 dark:bg-teal-400 shadow-sm" />
          </div>
        </button>

        {/* User Info with Optional Chaining Protection */}
        {user && (
          <div className="flex items-center gap-3 px-2 py-1">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-slate-700 to-slate-600 flex items-center justify-center font-bold text-slate-100 text-xs">
              {(user?.username || user?.email || 'US').slice(0, 2).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-slate-200 truncate">{user?.username || 'User'}</p>
              <p className="text-[10px] text-slate-500 truncate">{user?.email || ''}</p>
            </div>
          </div>
        )}

        {/* Logout */}
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-red-400 hover:bg-red-950/20 hover:text-red-300 transition"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
