import React, { useState } from 'react';
import { AppSettings, User as UserType } from '../types';
import { Settings, Download, Upload, RotateCcw, Sun, Moon, Bell, Sparkles, Shield, Palette, User, LogOut, LogIn, UserPlus } from 'lucide-react';

interface SettingsViewProps {
  settings: AppSettings;
  onUpdateSettings: (settings: Partial<AppSettings>) => void;
  onResetDatabase: () => void;
  appStateJSON: string;
  onImportStateJSON: (json: string) => void;
  currentUser?: UserType | null;
  onOpenAuth?: (mode?: 'login' | 'signup') => void;
  onLogout?: () => void;
}

const ACCENT_COLORS = [
  '#8b5cf6', '#a855f7', '#c084fc', '#ec4899', '#f43f5e', '#10b981', '#3b82f6'
];

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  onUpdateSettings,
  onResetDatabase,
  appStateJSON,
  onImportStateJSON,
  currentUser,
  onOpenAuth,
  onLogout,
}) => {
  const [importText, setImportText] = useState('');
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleDownloadJSON = () => {
    const blob = new Blob([appStateJSON], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lifeflow-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!importText.trim()) return;
    try {
      JSON.parse(importText);
      onImportStateJSON(importText);
      setImportText('');
      alert('Backup imported successfully!');
    } catch (err) {
      alert('Invalid JSON format. Please paste valid LifeFlow backup JSON.');
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12 max-w-4xl">
      {/* Header */}
      <div className="pb-6 border-b border-white/10">
        <span className="text-xs font-bold text-[#c084fc] uppercase tracking-widest block mb-1">Preferences & Account</span>
        <h1 className="text-3xl font-extrabold text-[#fafafa]">Settings & User Account</h1>
      </div>

      {/* User Account Section */}
      <div className="bg-[#18181b] p-6 rounded-3xl border border-white/10 shadow-xl space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-white/10">
          <User className="w-5 h-5 text-[#8b5cf6]" />
          <h3 className="text-base font-bold text-[#fafafa]">User Account</h3>
        </div>

        {currentUser ? (
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-1">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-[#8b5cf6]/20 text-[#c084fc] font-bold text-lg flex items-center justify-center border border-[#8b5cf6]/30 shadow-md">
                {currentUser.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <span className="text-sm font-bold text-[#fafafa] block">{currentUser.name}</span>
                <span className="text-xs text-[#a1a1aa]">{currentUser.email}</span>
              </div>
            </div>

            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-5 py-2.5 bg-rose-500/10 text-rose-300 border border-rose-500/30 rounded-full text-xs font-bold hover:bg-rose-500 hover:text-white transition-all cursor-pointer shadow-md"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-1">
            <div>
              <span className="text-sm font-bold text-[#fafafa] block">Not Signed In</span>
              <span className="text-xs text-[#a1a1aa]">Log in or create an account to sync across devices</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenAuth && onOpenAuth('login')}
                className="flex items-center gap-2 px-4 py-2 bg-[#27272a] text-[#fafafa] border border-white/10 rounded-full text-xs font-bold hover:border-[#8b5cf6] transition-all cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                <span>Log In</span>
              </button>
              <button
                onClick={() => onOpenAuth && onOpenAuth('signup')}
                className="flex items-center gap-2 px-4 py-2 bg-[#8b5cf6] text-white rounded-full text-xs font-bold hover:bg-[#7c3aed] transition-all cursor-pointer shadow-md"
              >
                <UserPlus className="w-4 h-4" />
                <span>Sign Up</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Appearance Section */}
      <div className="bg-[#18181b] p-6 rounded-3xl border border-white/10 shadow-xl space-y-5">
        <div className="flex items-center gap-2 pb-3 border-b border-white/10">
          <Palette className="w-5 h-5 text-[#8b5cf6]" />
          <h3 className="text-base font-bold text-[#fafafa]">Appearance & Theme</h3>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-sm font-semibold text-[#fafafa] block">Color Mode</span>
            <span className="text-xs text-[#a1a1aa]">Toggle dark or light theme interface</span>
          </div>
          <button
            onClick={() => onUpdateSettings({ theme: settings.theme === 'dark' ? 'light' : 'dark' })}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#27272a] text-[#fafafa] border border-white/10 text-xs font-bold hover:border-[#8b5cf6] transition-all cursor-pointer"
          >
            {settings.theme === 'dark' ? <Moon className="w-4 h-4 text-purple-400" /> : <Sun className="w-4 h-4 text-amber-300" />}
            <span>{settings.theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</span>
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-sm font-semibold text-[#fafafa] block">Accent Color</span>
            <span className="text-xs text-[#a1a1aa]">Custom primary highlight tint</span>
          </div>
          <div className="flex items-center gap-2">
            {ACCENT_COLORS.map((color) => (
              <button
                key={color}
                onClick={() => onUpdateSettings({ accentColor: color })}
                style={{ backgroundColor: color }}
                className={`w-6 h-6 rounded-full transition-transform cursor-pointer ${
                  settings.accentColor === color ? 'ring-2 ring-white scale-110' : 'opacity-70 hover:opacity-100'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Backup & Export Section */}
      <div className="bg-[#18181b] p-6 rounded-3xl border border-white/10 shadow-xl space-y-5">
        <div className="flex items-center gap-2 pb-3 border-b border-white/10">
          <Download className="w-5 h-5 text-[#8b5cf6]" />
          <h3 className="text-base font-bold text-[#fafafa]">Export & Backup</h3>
        </div>

        <div>
          <button
            onClick={handleDownloadJSON}
            className="w-full p-5 bg-[#8b5cf6] text-white rounded-2xl font-bold text-xs hover:bg-[#7c3aed] transition-all shadow-lg flex items-center justify-between group cursor-pointer"
          >
            <div>
              <span className="block text-sm">Export Data JSON</span>
              <span className="text-[10px] font-normal opacity-80 mt-0.5 block">Export tasks, habits, goals & notes backup</span>
            </div>
            <Download className="w-5 h-5 group-hover:translate-y-0.5 transition-transform" />
          </button>
        </div>

        {/* Import JSON Form */}
        <form onSubmit={handleImportSubmit} className="pt-2 space-y-3">
          <label className="block text-xs font-semibold text-[#a1a1aa] uppercase">Import Data from JSON</label>
          <textarea
            rows={3}
            value={importText}
            onChange={(e) => setImportText(e.target.value)}
            placeholder="Paste exported LifeFlow JSON backup string here..."
            className="w-full bg-[#09090b] border border-white/10 rounded-xl p-3 text-xs text-[#fafafa] placeholder-[#a1a1aa] focus:outline-none focus:border-[#8b5cf6]"
          />
          <button
            type="submit"
            className="px-5 py-2 rounded-full bg-[#27272a] border border-white/10 text-[#fafafa] text-xs font-bold hover:bg-[#3f3f46] hover:text-[#c084fc] transition-all cursor-pointer"
          >
            Import Backup
          </button>
        </form>
      </div>

      {/* Database Reset Section */}
      <div className="bg-rose-500/10 border border-rose-500/30 p-6 rounded-3xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-rose-300">Reset Database</h3>
            <p className="text-xs text-[#a1a1aa] mt-0.5">Wipe all tasks, habits, goals, and settings to start clean.</p>
          </div>

          {!showResetConfirm ? (
            <button
              onClick={() => setShowResetConfirm(true)}
              className="px-4 py-2 bg-rose-500/20 text-rose-300 border border-rose-500/40 rounded-full text-xs font-bold hover:bg-rose-500 hover:text-white transition-all cursor-pointer"
            >
              Reset Database
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-3 py-1.5 text-xs text-[#a1a1aa] cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onResetDatabase();
                  setShowResetConfirm(false);
                }}
                className="px-4 py-2 bg-rose-600 text-white rounded-full text-xs font-bold shadow-lg cursor-pointer"
              >
                Confirm Reset
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
