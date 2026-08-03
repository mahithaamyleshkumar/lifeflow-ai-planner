import React, { useState } from 'react';
import { Task } from '../types';
import { Clock, Plus, CheckCircle2, Sparkles, AlertCircle, MapPin } from 'lucide-react';
import confetti from 'canvas-confetti';

interface TodaysPlannerViewProps {
  tasks: Task[];
  onToggleTask: (id: string) => void;
  onOpenQuickAdd: () => void;
}

const HOURS = Array.from({ length: 18 }, (_, i) => i + 6); // 6 AM to 11 PM

export const TodaysPlannerView: React.FC<TodaysPlannerViewProps> = ({
  tasks,
  onToggleTask,
  onOpenQuickAdd,
}) => {
  const [viewMode, setViewMode] = useState<'timeline' | 'list' | 'agenda'>('timeline');

  const todayStr = new Date().toISOString().split('T')[0];
  const todayTasks = tasks.filter((t) => !t.archived && (t.dueDate === todayStr || !t.dueDate));

  const handleTaskCheck = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleTask(id);
    confetti({ particleCount: 40, spread: 50, origin: { y: 0.6 } });
  };

  // Helper to parse HH:mm to top percentage/pixels
  const getTimeOffset = (timeStr?: string) => {
    if (!timeStr) return 80;
    const [h, m] = timeStr.split(':').map(Number);
    if (isNaN(h)) return 80;
    const hourOffset = Math.max(h - 6, 0);
    return hourOffset * 80 + (m / 60) * 80;
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header & View Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-6 border-b border-white/10 gap-4">
        <div>
          <span className="text-xs font-bold text-[#c084fc] uppercase tracking-widest block mb-1">Daily Schedule</span>
          <h1 className="text-3xl font-extrabold text-[#fafafa]">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
          </h1>
        </div>

        <div className="flex items-center bg-[#0f0f12] p-1.5 rounded-full border border-white/10 shadow-inner">
          <button
            onClick={() => setViewMode('list')}
            className={`px-5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              viewMode === 'list' ? 'bg-[#27272a] text-[#c084fc] shadow-sm' : 'text-[#a1a1aa] hover:text-[#fafafa]'
            }`}
          >
            List
          </button>
          <button
            onClick={() => setViewMode('agenda')}
            className={`px-5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              viewMode === 'agenda' ? 'bg-[#27272a] text-[#c084fc] shadow-sm' : 'text-[#a1a1aa] hover:text-[#fafafa]'
            }`}
          >
            Agenda
          </button>
          <button
            onClick={() => setViewMode('timeline')}
            className={`px-5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              viewMode === 'timeline' ? 'bg-[#27272a] text-[#c084fc] shadow-sm' : 'text-[#a1a1aa] hover:text-[#fafafa]'
            }`}
          >
            Timeline
          </button>
        </div>
      </div>

      {/* Main Workspace */}
      {viewMode === 'timeline' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Timeline Grid (8 Cols) */}
          <div className="lg:col-span-8 bg-[#18181b] rounded-3xl p-6 border border-white/10 shadow-xl min-h-[900px] relative overflow-hidden">
            <div className="relative">
              {/* Hour Lines */}
              {HOURS.map((hour) => {
                const displayHour = hour > 12 ? `${hour - 12}:00 PM` : hour === 12 ? '12:00 PM' : `${hour}:00 AM`;
                return (
                  <div key={hour} className="h-[80px] border-t border-white/10 flex items-start pt-2">
                    <span className="text-xs font-mono text-[#a1a1aa] w-20">{displayHour}</span>
                  </div>
                );
              })}

              {/* Tasks Rendered as Blocks */}
              <div className="absolute left-20 right-0 top-0 h-full">
                {todayTasks.length === 0 ? (
                  <div className="absolute top-20 left-4 right-4 p-8 text-center bg-[#27272a]/40 rounded-2xl border border-dashed border-white/20">
                    <Clock className="w-8 h-8 text-[#a1a1aa] mx-auto mb-2 opacity-50" />
                    <p className="text-xs text-[#a1a1aa]">No tasks scheduled on timeline yet.</p>
                    <button
                      onClick={onOpenQuickAdd}
                      className="mt-3 px-4 py-2 bg-[#8b5cf6] text-white rounded-full text-xs font-semibold hover:bg-[#7c3aed] shadow-md transition-all cursor-pointer"
                    >
                      Schedule Task
                    </button>
                  </div>
                ) : (
                  todayTasks.map((task, idx) => {
                    const topPos = getTimeOffset(task.startTime) || 80 + idx * 90;
                    const heightVal = Math.max(task.estimatedMinutes || 60, 45);

                    return (
                      <div
                        key={task.id}
                        style={{ top: `${topPos}px`, height: `${heightVal}px` }}
                        className={`absolute left-2 right-4 rounded-2xl border-l-4 p-4 shadow-lg transition-all cursor-pointer group hover:scale-[1.01] ${
                          task.completed
                            ? 'bg-[#09090b]/60 border-[#a1a1aa] text-[#a1a1aa] opacity-60'
                            : 'bg-[#27272a]/90 border-[#8b5cf6] text-[#fafafa] hover:bg-[#27272a]'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className={`text-sm font-bold ${task.completed ? 'line-through' : ''}`}>{task.name}</h4>
                            <p className="text-[11px] text-[#c084fc] font-mono mt-0.5">
                              {task.startTime || '09:00'} - {task.endTime || '10:00'}
                            </p>
                          </div>
                          <button
                            onClick={(e) => handleTaskCheck(task.id, e)}
                            className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all cursor-pointer ${
                              task.completed ? 'bg-[#8b5cf6] border-[#8b5cf6] text-white' : 'border-[#a1a1aa] hover:border-[#8b5cf6]'
                            }`}
                          >
                            {task.completed && <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />}
                          </button>
                        </div>
                        {task.location && (
                          <div className="flex items-center gap-1 text-[10px] text-[#a1a1aa] mt-2">
                            <MapPin className="w-3 h-3" /> {task.location}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}

                {/* AI Suggested Break */}
                <div
                  className="absolute left-2 right-4 h-[44px] border border-dashed border-[#8b5cf6]/40 bg-[#8b5cf6]/10 rounded-xl flex items-center justify-center gap-2 text-xs text-[#c084fc]"
                  style={{ top: '340px' }}
                >
                  <Sparkles className="w-4 h-4" />
                  <span className="italic font-medium">AI Recommendation: Rejuvenation Break (15m)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side Priorities Panel (4 Cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-[#18181b] rounded-3xl p-6 border border-white/10 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-[#fafafa]">Today's Focus Stack</h3>
                <span className="text-xs bg-[#8b5cf6]/10 text-[#c084fc] px-2.5 py-0.5 rounded-full font-semibold">
                  {todayTasks.length} TASKS
                </span>
              </div>

              <div className="space-y-3">
                {todayTasks.length === 0 ? (
                  <div className="text-center py-8 text-xs text-[#a1a1aa]">
                    Your focus stack is clear. Click Quick Add to start planning!
                  </div>
                ) : (
                  todayTasks.map((t) => (
                    <div
                      key={t.id}
                      className="flex items-center justify-between p-3 rounded-2xl bg-[#27272a]/50 border border-white/10 hover:border-[#8b5cf6]/40 transition-all cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <button
                          onClick={(e) => handleTaskCheck(t.id, e)}
                          className={`w-4 h-4 rounded border flex items-center justify-center cursor-pointer ${
                            t.completed ? 'bg-[#8b5cf6] border-[#8b5cf6] text-white' : 'border-[#a1a1aa]'
                          }`}
                        >
                          {t.completed && <CheckCircle2 className="w-3 h-3" />}
                        </button>
                        <span className={`text-xs font-medium ${t.completed ? 'line-through text-[#a1a1aa]' : 'text-[#fafafa]'}`}>
                          {t.name}
                        </span>
                      </div>
                      <span className="text-[10px] text-[#c084fc] bg-[#8b5cf6]/10 px-2 py-0.5 rounded font-mono">
                        {t.priority}
                      </span>
                    </div>
                  ))
                )}
              </div>

              <button
                onClick={onOpenQuickAdd}
                className="w-full mt-4 py-2.5 bg-[#8b5cf6] text-white rounded-xl text-xs font-bold hover:bg-[#7c3aed] transition-all flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Add Task Block
              </button>
            </div>
          </div>
        </div>
      )}

      {/* List or Agenda View */}
      {(viewMode === 'list' || viewMode === 'agenda') && (
        <div className="bg-[#18181b] rounded-3xl p-6 border border-white/10 shadow-xl space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-base font-bold text-[#fafafa] uppercase tracking-wider">{viewMode} View</h3>
            <span className="text-xs text-[#a1a1aa]">{todayTasks.length} total tasks</span>
          </div>

          {todayTasks.length === 0 ? (
            <div className="text-center py-12 text-xs text-[#a1a1aa]">
              No tasks scheduled for today. Click Quick Add to get started!
            </div>
          ) : (
            todayTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between p-4 bg-[#27272a]/50 border border-white/10 rounded-2xl hover:bg-[#27272a] transition-all"
              >
                <div className="flex items-center gap-4">
                  <button
                    onClick={(e) => handleTaskCheck(task.id, e)}
                    className={`w-5 h-5 rounded-md border-2 flex items-center justify-center cursor-pointer ${
                      task.completed ? 'bg-[#8b5cf6] border-[#8b5cf6] text-white' : 'border-[#a1a1aa]'
                    }`}
                  >
                    {task.completed && <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />}
                  </button>
                  <div>
                    <h4 className={`text-sm font-bold ${task.completed ? 'line-through text-[#a1a1aa]' : 'text-[#fafafa]'}`}>
                      {task.name}
                    </h4>
                    <span className="text-xs text-[#a1a1aa]">
                      {task.category} • {task.startTime || '09:00'} - {task.endTime || '10:00'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs px-2.5 py-1 rounded-full bg-[#8b5cf6]/10 text-[#c084fc] font-semibold">
                    {task.priority}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
