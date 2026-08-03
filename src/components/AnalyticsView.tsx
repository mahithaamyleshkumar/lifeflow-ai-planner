import React from 'react';
import { Task, Habit, PomodoroSession } from '../types';
import { 
  TrendingUp, 
  BarChart3, 
  PieChart as PieIcon, 
  Clock, 
  Flame, 
  CheckCircle2, 
  AlertCircle,
  Activity
} from 'lucide-react';

interface AnalyticsViewProps {
  tasks: Task[];
  habits: Habit[];
  pomodoroSessions: PomodoroSession[];
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ tasks, habits, pomodoroSessions }) => {
  const completedTasks = tasks.filter((t) => t.completed).length;
  const pendingTasks = tasks.filter((t) => !t.completed && !t.archived).length;
  const totalTasks = tasks.length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Category distribution
  const categoryCounts: Record<string, number> = {};
  tasks.forEach((t) => {
    categoryCounts[t.category] = (categoryCounts[t.category] || 0) + 1;
  });

  const topCategory = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'None';

  // Total Focus Minutes from Pomodoro
  const totalFocusMins = pomodoroSessions.filter((s) => s.mode === 'work').reduce((acc, s) => acc + s.durationMinutes, 0);

  // Highest Habit Streak
  const maxStreak = habits.length > 0 ? Math.max(...habits.map((h) => h.streak), 0) : 0;

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-6 border-b border-white/10 gap-4">
        <div>
          <span className="text-xs font-bold text-[#c084fc] uppercase tracking-widest block mb-1">Intelligence Analytics</span>
          <h1 className="text-3xl font-extrabold text-[#fafafa]">Productivity Dynamics</h1>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-[#18181b] p-5 rounded-3xl border border-white/10 shadow-xl flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-[#a1a1aa] uppercase block">Task Velocity</span>
            <span className="text-2xl font-extrabold text-[#fafafa] mt-1 block">{completedTasks} <span className="text-xs font-medium text-[#a1a1aa]">done</span></span>
          </div>
          <div className="p-3 bg-[#8b5cf6]/10 text-[#8b5cf6] rounded-2xl">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-[#18181b] p-5 rounded-3xl border border-white/10 shadow-xl flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-[#a1a1aa] uppercase block">Completion Rate</span>
            <span className="text-2xl font-extrabold text-[#c084fc] mt-1 block">{completionRate}%</span>
          </div>
          <div className="p-3 bg-[#8b5cf6]/10 text-[#8b5cf6] rounded-2xl">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-[#18181b] p-5 rounded-3xl border border-white/10 shadow-xl flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-[#a1a1aa] uppercase block">Focus Time</span>
            <span className="text-2xl font-extrabold text-[#fafafa] mt-1 block">{(totalFocusMins / 60).toFixed(1)} <span className="text-xs font-medium text-[#a1a1aa]">hrs</span></span>
          </div>
          <div className="p-3 bg-[#8b5cf6]/10 text-[#8b5cf6] rounded-2xl">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-[#18181b] p-5 rounded-3xl border border-white/10 shadow-xl flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-[#a1a1aa] uppercase block">Best Habit Streak</span>
            <span className="text-2xl font-extrabold text-amber-400 mt-1 block">{maxStreak} <span className="text-xs font-medium text-[#a1a1aa]">days</span></span>
          </div>
          <div className="p-3 bg-amber-400/10 text-amber-400 rounded-2xl">
            <Flame className="w-6 h-6 fill-current" />
          </div>
        </div>
      </div>

      {/* Main Analytics Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Category Breakdown (8 Cols) */}
        <div className="lg:col-span-8 bg-[#18181b] rounded-3xl p-6 border border-white/10 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <h3 className="text-base font-bold text-[#fafafa]">Task Category Allocation</h3>
            <span className="text-xs text-[#c084fc] font-semibold">Top Domain: {topCategory}</span>
          </div>

          {Object.keys(categoryCounts).length === 0 ? (
            <div className="text-center py-12 text-xs text-[#a1a1aa]">
              No tasks created yet. Add tasks across categories to render distribution breakdown!
            </div>
          ) : (
            <div className="space-y-3 pt-2">
              {Object.entries(categoryCounts).map(([cat, count]) => {
                const pct = Math.round((count / totalTasks) * 100);
                return (
                  <div key={cat} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold text-[#fafafa]">{cat}</span>
                      <span className="text-[#c084fc] font-bold">{count} ({pct}%)</span>
                    </div>
                    <div className="h-2 w-full bg-[#09090b] rounded-full overflow-hidden">
                      <div
                        style={{ width: `${pct}%` }}
                        className="h-full bg-[#8b5cf6] rounded-full transition-all duration-700 shadow-[0_0_8px_rgba(139,92,246,0.4)]"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Task Status Meter (4 Cols) */}
        <div className="lg:col-span-4 bg-[#18181b] rounded-3xl p-6 border border-white/10 shadow-xl space-y-4 flex flex-col justify-between">
          <h3 className="text-base font-bold text-[#fafafa]">Task Status Meter</h3>

          <div className="space-y-4 my-auto">
            <div className="p-4 bg-[#27272a]/50 rounded-2xl border border-white/10 flex justify-between items-center">
              <div>
                <span className="text-xs text-[#a1a1aa]">Completed</span>
                <p className="text-xl font-bold text-emerald-400">{completedTasks}</p>
              </div>
              <CheckCircle2 className="w-8 h-8 text-emerald-400" />
            </div>

            <div className="p-4 bg-[#27272a]/50 rounded-2xl border border-white/10 flex justify-between items-center">
              <div>
                <span className="text-xs text-[#a1a1aa]">Pending</span>
                <p className="text-xl font-bold text-[#c084fc]">{pendingTasks}</p>
              </div>
              <Activity className="w-8 h-8 text-[#8b5cf6]" />
            </div>
          </div>

          <div className="pt-3 border-t border-white/10 text-center">
            <span className="text-xs text-[#a1a1aa]">Data synchronized in real time</span>
          </div>
        </div>
      </div>
    </div>
  );
};
