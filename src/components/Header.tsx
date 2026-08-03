import React, { useState, useEffect, useRef } from 'react';
import { Search, Plus, User, Volume2, VolumeX, Sun, Moon, LogIn, LogOut, ChevronDown, UserPlus } from 'lucide-react';
import { AppSettings, User as UserType } from '../types';

interface HeaderProps {
  onOpenQuickAdd: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  settings?: AppSettings;
  onToggleTheme?: () => void;
  isAudioPlaying?: boolean;
  onToggleAudio?: () => void;
  isAmbientPlaying?: boolean;
  onToggleAmbient?: () => void;
  currentUser?: UserType | null;
  onOpenAuth?: (mode?: 'login' | 'signup') => void;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenQuickAdd,
  searchQuery,
  onSearchChange,
  settings,
  onToggleTheme,
  isAudioPlaying,
  onToggleAudio,
  isAmbientPlaying,
  onToggleAmbient,
  currentUser,
  onOpenAuth,
  onLogout,
}) => {
  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>('');
  const [showProfileMenu, setShowProfileMenu] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const audioActive = isAudioPlaying || isAmbientPlaying || false;
  const toggleAudioFunc = onToggleAudio || onToggleAmbient || (() => {});

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }));
      setCurrentDate(now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }));
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="fixed top-0 left-[260px] right-0 h-[72px] bg-[#0f0f12] z-40 border-b border-white/10 flex items-center justify-between px-8">
      {/* Search Input */}
      <div className="flex items-center flex-1 max-w-md">
        <div className="relative w-full group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#a1a1aa] group-focus-within:text-[#8b5cf6] transition-colors" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search tasks, categories, habits, goals..."
            className="w-full bg-[#18181b] border border-white/10 rounded-full py-2 pl-11 pr-4 text-sm text-[#fafafa] placeholder-[#a1a1aa] focus:outline-none focus:border-[#8b5cf6] transition-all"
          />
        </div>
      </div>

      {/* Action Controls & Clock */}
      <div className="flex items-center gap-4">
        {/* Real-time Clock */}
        <div className="hidden md:flex flex-col items-end pr-2">
          <span className="text-sm font-bold text-[#c084fc] tracking-tight">{currentTime}</span>
          <span className="text-[11px] text-[#a1a1aa] font-medium">{currentDate}</span>
        </div>

        {/* Ambient Music Synthesizer Toggle */}
        <button
          onClick={toggleAudioFunc}
          className={`p-2 rounded-full border transition-all ${
            audioActive
              ? 'bg-[#8b5cf6]/20 text-[#c084fc] border-[#8b5cf6]/50 shadow-[0_0_12px_rgba(139,92,246,0.3)] animate-pulse'
              : 'bg-[#18181b] text-[#a1a1aa] border-white/10 hover:text-[#fafafa]'
          }`}
          title={audioActive ? 'Mute Focus Ambient Audio' : 'Play Focus Rain Ambient Audio'}
        >
          {audioActive ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>

        {/* Theme Switcher */}
        {onToggleTheme && settings && (
          <button
            onClick={onToggleTheme}
            className="p-2 rounded-full bg-[#18181b] text-[#a1a1aa] hover:text-[#fafafa] border border-white/10 transition-colors"
            title={`Switch to ${settings.theme === 'dark' ? 'Light' : 'Dark'} mode`}
          >
            {settings.theme === 'dark' ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-purple-400" />}
          </button>
        )}

        {/* Quick Add Button */}
        <button
          onClick={onOpenQuickAdd}
          className="flex items-center gap-1.5 bg-[#8b5cf6] text-white px-4 py-2 rounded-full font-semibold text-xs hover:bg-[#7c3aed] shadow-lg shadow-[#8b5cf6]/25 transition-all active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Quick Add</span>
        </button>

        <div className="w-[1px] h-6 bg-white/10" />

        {/* Authentication & Profile Menu */}
        {currentUser ? (
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full bg-[#18181b] border border-white/10 hover:border-[#8b5cf6]/50 transition-all cursor-pointer group"
            >
              <div className="w-7 h-7 rounded-full bg-[#8b5cf6]/20 text-[#c084fc] font-bold text-xs flex items-center justify-center border border-[#8b5cf6]/30">
                {currentUser.name.charAt(0).toUpperCase()}
              </div>
              <span className="text-xs font-semibold text-[#fafafa] max-w-[100px] truncate">
                {currentUser.name.split(' ')[0]}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-[#a1a1aa] group-hover:text-[#fafafa] transition-transform" />
            </button>

            {/* Dropdown Menu */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-[#18181b] border border-white/10 rounded-2xl shadow-2xl p-2 z-50 animate-fadeIn space-y-1">
                <div className="px-3 py-2 border-b border-white/10">
                  <p className="text-xs font-bold text-[#fafafa]">{currentUser.name}</p>
                  <p className="text-[11px] text-[#a1a1aa] truncate">{currentUser.email}</p>
                </div>
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    if (onLogout) onLogout();
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors font-semibold cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenAuth && onOpenAuth('login')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#18181b] border border-white/10 text-xs font-semibold text-[#fafafa] hover:border-[#8b5cf6] hover:text-[#c084fc] transition-all cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Log In</span>
            </button>
            <button
              onClick={() => onOpenAuth && onOpenAuth('signup')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#8b5cf6]/20 text-[#c084fc] border border-[#8b5cf6]/40 text-xs font-semibold hover:bg-[#8b5cf6] hover:text-white transition-all cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Sign Up</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
