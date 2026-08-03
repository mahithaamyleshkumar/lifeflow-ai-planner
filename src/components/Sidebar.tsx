import React from 'react';
import { ViewPath } from '../types';
import { 
  LayoutDashboard, 
  Clock, 
  CalendarRange, 
  Calendar, 
  CheckSquare, 
  Flame, 
  Target, 
  Timer, 
  TrendingUp, 
  Trophy, 
  Settings
} from 'lucide-react';

interface SidebarProps {
  currentView?: ViewPath;
  activeView?: ViewPath;
  onSelectView: (view: ViewPath) => void;
  taskCount?: number;
  pendingTasksCount?: number;
  streakCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  activeView,
  onSelectView,
  taskCount = 0,
  pendingTasksCount = 0,
  streakCount = 0,
}) => {
  const selectedView = currentView || activeView || 'dashboard';
  const effectiveTaskCount = taskCount || pendingTasksCount || 0;

  const menuItems: { path: ViewPath; label: string; icon: React.ReactNode; badge?: string }[] = [
    { path: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { path: 'todays-planner', label: "Today's Planner", icon: <Clock className="w-5 h-5" /> },
    { path: 'monthly-planner', label: 'Monthly Planner', icon: <CalendarRange className="w-5 h-5" /> },
    { path: 'calendar', label: 'Calendar', icon: <Calendar className="w-5 h-5" /> },
    { path: 'tasks', label: 'Tasks', icon: <CheckSquare className="w-5 h-5" />, badge: effectiveTaskCount > 0 ? `${effectiveTaskCount}` : undefined },
    { path: 'habits', label: 'Habits', icon: <Flame className="w-5 h-5" />, badge: streakCount > 0 ? `${streakCount}d` : undefined },
    { path: 'goals', label: 'Goals', icon: <Target className="w-5 h-5" /> },
    { path: 'pomodoro', label: 'Pomodoro', icon: <Timer className="w-5 h-5" /> },
    { path: 'analytics', label: 'Analytics', icon: <TrendingUp className="w-5 h-5" /> },
    { path: 'achievements', label: 'Achievements', icon: <Trophy className="w-5 h-5" /> },
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-[260px] bg-[#0f0f12] border-r border-white/10 z-50 flex flex-col justify-between select-none">
      <div>
        {/* Brand Header */}
        <div className="p-6 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onSelectView('dashboard')}>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#8b5cf6] to-[#d946ef] flex items-center justify-center shadow-lg shadow-[#8b5cf6]/30 font-bold text-white">
              L
            </div>
            <div>
              <span className="font-bold text-lg text-[#fafafa] tracking-tight block leading-none">LifeFlow</span>
              <span className="text-[10px] text-[#8b5cf6] font-medium tracking-widest uppercase mt-0.5 block">AI Planner</span>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-180px)] scrollbar-thin">
          {menuItems.map((item) => {
            const active = selectedView === item.path;
            return (
              <button
                key={item.path}
                onClick={() => onSelectView(item.path)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all duration-200 group text-sm font-medium ${
                  active
                    ? 'bg-[#18181b] text-[#fafafa] border-l-4 border-[#8b5cf6] shadow-sm'
                    : 'text-[#a1a1aa] hover:bg-white/5 hover:text-[#fafafa]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`transition-transform duration-200 group-hover:scale-110 ${active ? 'text-[#8b5cf6]' : 'text-[#a1a1aa] group-hover:text-[#fafafa]'}`}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[11px] px-2 py-0.5 rounded-full font-semibold ${
                    active ? 'bg-[#8b5cf6]/20 text-[#c084fc]' : 'bg-[#27272a] text-[#a1a1aa]'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Settings */}
      <div className="p-3 border-t border-white/10 space-y-1">
        <button
          onClick={() => onSelectView('settings')}
          className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
            selectedView === 'settings'
              ? 'bg-[#18181b] text-[#fafafa] border-l-4 border-[#8b5cf6]'
              : 'text-[#a1a1aa] hover:bg-white/5 hover:text-[#fafafa]'
          }`}
        >
          <Settings className="w-5 h-5 text-[#a1a1aa]" />
          <span>Settings</span>
        </button>
      </div>
    </aside>
  );
};
