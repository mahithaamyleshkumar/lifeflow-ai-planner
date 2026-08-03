import React, { useState } from 'react';
import { Task } from '../types';
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, CheckCircle2 } from 'lucide-react';

interface MonthlyPlannerViewProps {
  tasks: Task[];
  onOpenQuickAdd: () => void;
  onToggleTask: (id: string) => void;
}

export const MonthlyPlannerView: React.FC<MonthlyPlannerViewProps> = ({ tasks, onOpenQuickAdd, onToggleTask }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewScope, setViewScope] = useState<'week' | 'month' | 'year'>('month');

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay();

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const monthName = currentDate.toLocaleString('default', { month: 'long' });

  // Map tasks by YYYY-MM-DD
  const taskMap: Record<string, Task[]> = {};
  tasks.forEach((t) => {
    if (t.dueDate) {
      if (!taskMap[t.dueDate]) taskMap[t.dueDate] = [];
      taskMap[t.dueDate].push(t);
    }
  });

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header & Scope Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-6 border-b border-white/10 gap-4">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-extrabold text-[#fafafa]">
            {monthName} {year}
          </h1>
          <div className="flex items-center gap-1 bg-[#18181b] p-1 rounded-full border border-white/10">
            <button onClick={prevMonth} className="p-1.5 rounded-full text-[#a1a1aa] hover:text-[#fafafa] hover:bg-[#27272a] cursor-pointer">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button onClick={nextMonth} className="p-1.5 rounded-full text-[#a1a1aa] hover:text-[#fafafa] hover:bg-[#27272a] cursor-pointer">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex items-center bg-[#18181b] p-1.5 rounded-full border border-white/10 shadow-inner">
          <button
            onClick={() => setViewScope('week')}
            className={`px-5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              viewScope === 'week' ? 'bg-[#8b5cf6] text-white' : 'text-[#a1a1aa] hover:text-[#fafafa]'
            }`}
          >
            Week
          </button>
          <button
            onClick={() => setViewScope('month')}
            className={`px-5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              viewScope === 'month' ? 'bg-[#8b5cf6] text-white' : 'text-[#a1a1aa] hover:text-[#fafafa]'
            }`}
          >
            Month
          </button>
          <button
            onClick={() => setViewScope('year')}
            className={`px-5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              viewScope === 'year' ? 'bg-[#8b5cf6] text-white' : 'text-[#a1a1aa] hover:text-[#fafafa]'
            }`}
          >
            Year
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-[#18181b] rounded-3xl p-6 border border-white/10 shadow-xl">
        {/* Day Header Row */}
        <div className="grid grid-cols-7 gap-2 mb-3 text-center text-xs font-bold text-[#c084fc] uppercase tracking-wider">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
            <div key={d} className="py-1.5">{d}</div>
          ))}
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-2">
          {/* Empty lead-in cells */}
          {Array.from({ length: firstDayIndex }).map((_, i) => (
            <div key={`empty_${i}`} className="min-h-[100px] bg-[#09090b]/30 rounded-2xl border border-transparent" />
          ))}

          {/* Month Day Cells */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const dayNum = i + 1;
            const formattedMonth = String(month + 1).padStart(2, '0');
            const formattedDay = String(dayNum).padStart(2, '0');
            const dateStr = `${year}-${formattedMonth}-${formattedDay}`;

            const isToday = new Date().toISOString().split('T')[0] === dateStr;
            const dayTasks = taskMap[dateStr] || [];

            return (
              <div
                key={dayNum}
                onClick={onOpenQuickAdd}
                className={`min-h-[110px] p-2.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between group hover:border-[#8b5cf6]/50 ${
                  isToday
                    ? 'bg-[#8b5cf6]/10 border-[#8b5cf6] shadow-[0_0_12px_rgba(139,92,246,0.2)]'
                    : 'bg-[#27272a]/40 border-white/10 hover:bg-[#27272a]/80'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span
                    className={`text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full ${
                      isToday ? 'bg-[#8b5cf6] text-white' : 'text-[#fafafa]'
                    }`}
                  >
                    {dayNum}
                  </span>
                  {dayTasks.length > 0 && (
                    <span className="text-[10px] text-[#c084fc] font-bold bg-[#8b5cf6]/10 px-1.5 py-0.5 rounded-full">
                      {dayTasks.length}
                    </span>
                  )}
                </div>

                <div className="space-y-1 my-1 overflow-y-auto max-h-[60px] scrollbar-thin">
                  {dayTasks.slice(0, 2).map((t) => (
                    <div
                      key={t.id}
                      onClick={(e) => { e.stopPropagation(); onToggleTask(t.id); }}
                      className={`text-[10px] truncate px-1.5 py-0.5 rounded font-medium ${
                        t.completed
                          ? 'line-through text-[#a1a1aa] bg-[#09090b]'
                          : 'bg-[#8b5cf6]/20 text-[#c084fc]'
                      }`}
                    >
                      {t.name}
                    </div>
                  ))}
                  {dayTasks.length > 2 && (
                    <span className="text-[9px] text-[#a1a1aa] block font-mono">
                      +{dayTasks.length - 2} more
                    </span>
                  )}
                </div>

                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex justify-end">
                  <Plus className="w-3.5 h-3.5 text-[#8b5cf6]" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
