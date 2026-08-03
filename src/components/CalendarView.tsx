import React, { useState } from 'react';
import { Task } from '../types';
import { Calendar as CalendarIcon, Clock, CheckCircle2, Plus, Filter } from 'lucide-react';

interface CalendarViewProps {
  tasks: Task[];
  onOpenQuickAdd: () => void;
  onToggleTask: (id: string) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({ tasks, onOpenQuickAdd, onToggleTask }) => {
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const todayStr = new Date().toISOString().split('T')[0];

  const filteredTasks = tasks.filter((t) => {
    if (t.archived) return false;
    if (filterCategory !== 'All' && t.category !== filterCategory) return false;
    return true;
  });

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-6 border-b border-white/10 gap-4">
        <div>
          <span className="text-xs font-bold text-[#c084fc] uppercase tracking-widest block mb-1">Calendar Workspace</span>
          <h1 className="text-3xl font-extrabold text-[#fafafa]">Google Calendar View</h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-[#18181b] px-3 py-1.5 rounded-full border border-white/10 text-xs text-[#fafafa]">
            <Filter className="w-3.5 h-3.5 text-[#8b5cf6]" />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="bg-transparent text-xs text-[#fafafa] focus:outline-none cursor-pointer"
            >
              <option value="All" className="bg-[#18181b]">All Categories</option>
              <option value="Work" className="bg-[#18181b]">Work</option>
              <option value="Study" className="bg-[#18181b]">Study</option>
              <option value="Coding" className="bg-[#18181b]">Coding</option>
              <option value="Health" className="bg-[#18181b]">Health</option>
              <option value="Personal" className="bg-[#18181b]">Personal</option>
            </select>
          </div>

          <button
            onClick={onOpenQuickAdd}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#8b5cf6] text-white rounded-full text-xs font-bold hover:bg-[#7c3aed] transition-all shadow-md cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Schedule Event
          </button>
        </div>
      </div>

      {/* Calendar Grid Container */}
      <div className="bg-[#18181b] rounded-3xl p-6 border border-white/10 shadow-xl space-y-4">
        <div className="flex justify-between items-center pb-2 border-b border-white/10">
          <span className="text-sm font-bold text-[#fafafa]">Scheduled Tasks & Events</span>
          <span className="text-xs text-[#a1a1aa]">{filteredTasks.length} events active</span>
        </div>

        {filteredTasks.length === 0 ? (
          <div className="text-center py-16 text-xs text-[#a1a1aa]">
            <CalendarIcon className="w-10 h-10 text-[#a1a1aa] mx-auto mb-2 opacity-40" />
            No calendar events scheduled yet. Click Schedule Event to add tasks!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTasks.map((t) => (
              <div
                key={t.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                  t.completed
                    ? 'bg-[#09090b]/40 border-white/5 opacity-60'
                    : 'bg-[#27272a]/60 border-white/10 hover:border-[#8b5cf6]/40'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold text-[#c084fc] bg-[#8b5cf6]/10 px-2 py-0.5 rounded-full uppercase">
                      {t.category}
                    </span>
                    <span className="text-xs text-[#a1a1aa] font-mono">{t.dueDate || todayStr}</span>
                  </div>
                  <h4 className={`text-sm font-bold ${t.completed ? 'line-through text-[#a1a1aa]' : 'text-[#fafafa]'}`}>
                    {t.name}
                  </h4>
                  {t.description && <p className="text-xs text-[#a1a1aa] mt-1 line-clamp-2">{t.description}</p>}
                </div>

                <div className="flex items-center justify-between pt-3 mt-3 border-t border-white/10">
                  <span className="text-[11px] text-[#a1a1aa] flex items-center gap-1 font-mono">
                    <Clock className="w-3 h-3 text-[#8b5cf6]" /> {t.startTime || '09:00'}
                  </span>
                  <button
                    onClick={() => onToggleTask(t.id)}
                    className={`text-xs px-3 py-1 rounded-full font-semibold border transition-all cursor-pointer ${
                      t.completed
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                        : 'bg-[#27272a] text-[#a1a1aa] border-white/10 hover:text-[#fafafa]'
                    }`}
                  >
                    {t.completed ? 'Completed' : 'Mark Done'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
