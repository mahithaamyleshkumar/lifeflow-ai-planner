import React, { useState } from 'react';
import { Task, Habit, DailyJournal, StickyNote, User as UserType } from '../types';
import { 
  Zap, 
  Flame, 
  Sun, 
  CloudSun, 
  CheckCircle2, 
  Plus, 
  Sparkles, 
  ArrowRight, 
  StickyNote as NoteIcon, 
  Smile, 
  Frown, 
  Meh, 
  HeartHandshake, 
  Target
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface DashboardViewProps {
  tasks: Task[];
  habits: Habit[];
  onToggleTask: (id: string) => void;
  onOpenQuickAdd: () => void;
  onSelectView: (view: any) => void;
  aiSuggestion: { suggestion: string; peakHours: string; actionablePlan: string } | null;
  stickyNotes: StickyNote[];
  onSaveNotes: (notes: StickyNote[]) => void;
  onSaveJournal: (journal: DailyJournal) => void;
  currentUser?: UserType | null;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  tasks,
  habits,
  onToggleTask,
  onOpenQuickAdd,
  onSelectView,
  aiSuggestion,
  stickyNotes,
  onSaveNotes,
  onSaveJournal,
  currentUser,
}) => {
  const [newNote, setNewNote] = useState('');
  const [mood, setMood] = useState<'great' | 'good' | 'neutral' | 'tired' | 'stressed'>('great');
  const [journalText, setJournalText] = useState('');
  const [journalSaved, setJournalSaved] = useState(false);

  const todayStr = new Date().toISOString().split('T')[0];
  const todayTasks = tasks.filter(t => !t.archived && (t.dueDate === todayStr || !t.dueDate));
  const completedToday = todayTasks.filter(t => t.completed).length;
  const progressPercent = todayTasks.length > 0 ? Math.round((completedToday / todayTasks.length) * 100) : 0;

  // Highest streak among habits
  const streakDays = habits.length > 0 ? Math.max(...habits.map(h => h.streak), 0) : 0;

  const handleTaskCheck = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleTask(id);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 }
    });
  };

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    const note: StickyNote = {
      id: `note_${Date.now()}`,
      content: newNote.trim(),
      color: '#abc7ff',
      updatedAt: new Date().toISOString()
    };
    onSaveNotes([...stickyNotes, note]);
    setNewNote('');
  };

  const handleDeleteNote = (id: string) => {
    onSaveNotes(stickyNotes.filter(n => n.id !== id));
  };

  const handleJournalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!journalText.trim()) return;
    onSaveJournal({
      id: `j_${Date.now()}`,
      date: todayStr,
      mood,
      entry: journalText.trim(),
      energyLevel: mood === 'great' ? 9 : mood === 'good' ? 7 : 5
    });
    setJournalSaved(true);
    setTimeout(() => setJournalSaved(false), 3000);
    setJournalText('');
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Welcome & Time Hero Header */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold text-[#c084fc] uppercase tracking-widest bg-[#8b5cf6]/10 px-2.5 py-1 rounded-full border border-[#8b5cf6]/20">
              System Ready
            </span>
            <span className="text-xs text-[#a1a1aa] font-mono">LifeFlow OS v2.5</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#fafafa] tracking-tight">
            Welcome, {currentUser ? currentUser.name : 'User'}!
          </h1>
          <p className="text-sm italic text-[#a1a1aa] mt-1 max-w-xl">
            "The secret of your future is hidden in your daily routine."
          </p>
        </div>

        {/* Weather Card */}
        <div className="flex items-center gap-4 bg-[#18181b] p-4 rounded-2xl border border-white/10 shadow-lg">
          <div className="relative">
            <CloudSun className="w-10 h-10 text-[#8b5cf6] animate-pulse" />
          </div>
          <div>
            <div className="text-xl font-bold text-[#fafafa]">72°F</div>
            <div className="text-xs text-[#a1a1aa]">Partly Sunny • Daily Optimum</div>
          </div>
        </div>
      </section>

      {/* Main Bento Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Focus & Momentum Column (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Primary Focus Card */}
            <div className="relative overflow-hidden bg-[#18181b] p-6 rounded-3xl border border-white/10 shadow-xl flex flex-col justify-between group hover:border-[#8b5cf6]/40 transition-all">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-[#8b5cf6]" />
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="text-[11px] font-bold text-[#c084fc] uppercase tracking-wider block">Today's Objective</span>
                  <h3 className="text-xl font-bold text-[#fafafa] mt-1">
                    {todayTasks.length > 0 ? todayTasks[0].name : "No tasks scheduled for today"}
                  </h3>
                </div>
                <Zap className="w-6 h-6 text-[#8b5cf6] group-hover:scale-110 transition-transform" />
              </div>
              <p className="text-xs text-[#a1a1aa] line-clamp-2 mb-6">
                {todayTasks.length > 0 && todayTasks[0].description ? todayTasks[0].description : "Add tasks to organize your focus schedule and maximize velocity."}
              </p>
              <div className="flex items-center justify-between pt-3 border-t border-white/10">
                <button
                  onClick={() => onSelectView('pomodoro')}
                  className="bg-[#8b5cf6]/10 text-[#c084fc] border border-[#8b5cf6]/30 px-4 py-2 rounded-full text-xs font-semibold hover:bg-[#8b5cf6] hover:text-white transition-all cursor-pointer"
                >
                  Start Focus Session
                </button>
                <span className="text-[11px] text-[#a1a1aa] font-medium">
                  {todayTasks.length} task{todayTasks.length === 1 ? '' : 's'} total
                </span>
              </div>
            </div>

            {/* Circular Progress Ring Card */}
            <div className="bg-[#18181b] p-6 rounded-3xl border border-white/10 shadow-xl flex flex-col items-center justify-center text-center relative overflow-hidden group">
              <div className="relative w-28 h-28 mb-3">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="56" cy="56" r="48" fill="transparent" stroke="#27272a" strokeWidth="8" />
                  <circle
                    cx="56"
                    cy="56"
                    r="48"
                    fill="transparent"
                    stroke="#8b5cf6"
                    strokeWidth="8"
                    strokeDasharray="301.5"
                    strokeDashoffset={301.5 - (301.5 * progressPercent) / 100}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out drop-shadow-[0_0_8px_rgba(139,92,246,0.4)]"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-extrabold text-[#fafafa]">{progressPercent}%</span>
                  <span className="text-[10px] text-[#a1a1aa] font-medium uppercase">Completed</span>
                </div>
              </div>
              <h4 className="text-sm font-bold text-[#fafafa]">Daily Momentum</h4>
              <p className="text-xs text-[#a1a1aa] mt-1">
                {completedToday} of {todayTasks.length} tasks completed today
              </p>
            </div>
          </div>

          {/* Streak Counter & Daily Journal Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {/* Streak Card */}
            <div className="sm:col-span-1 bg-[#8b5cf6]/10 border border-[#8b5cf6]/20 p-5 rounded-3xl flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#8b5cf6] to-[#d946ef] text-white flex items-center justify-center shadow-lg shadow-[#8b5cf6]/30">
                <Flame className="w-6 h-6 fill-current" />
              </div>
              <div>
                <div className="text-2xl font-extrabold text-[#fafafa] leading-none">{streakDays}</div>
                <div className="text-[11px] text-[#c084fc] font-bold uppercase tracking-wider mt-1">Day Streak</div>
              </div>
            </div>

            {/* Quick Mood Tracker */}
            <div className="sm:col-span-2 bg-[#18181b] border border-white/10 p-5 rounded-3xl flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#c084fc] uppercase tracking-wider block">Daily Check-In</span>
                <span className="text-xs text-[#a1a1aa]">How is your energy state right now?</span>
              </div>
              <div className="flex gap-2">
                {[
                  { key: 'great', label: 'Great', icon: '⚡' },
                  { key: 'good', label: 'Good', icon: '😊' },
                  { key: 'neutral', label: 'Neutral', icon: '😐' },
                  { key: 'tired', label: 'Tired', icon: '😴' },
                ].map((m) => (
                  <button
                    key={m.key}
                    onClick={() => setMood(m.key as any)}
                    className={`p-2 rounded-xl text-lg transition-all cursor-pointer ${
                      mood === m.key ? 'bg-[#8b5cf6]/20 ring-2 ring-[#8b5cf6] scale-110' : 'bg-[#09090b] opacity-70 hover:opacity-100'
                    }`}
                    title={m.label}
                  >
                    {m.icon}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Sticky Notes Widget */}
          <div className="bg-[#18181b] p-6 rounded-3xl border border-white/10 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <NoteIcon className="w-5 h-5 text-[#8b5cf6]" />
                <h3 className="text-base font-bold text-[#fafafa]">Scratchpad & Sticky Notes</h3>
              </div>
              <span className="text-xs text-[#a1a1aa]">{stickyNotes.length} saved</span>
            </div>

            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddNote()}
                placeholder="Type a quick note or key idea..."
                className="flex-1 bg-[#09090b] border border-white/10 rounded-xl px-4 py-2 text-sm text-[#fafafa] placeholder-[#a1a1aa] focus:outline-none focus:border-[#8b5cf6]"
              />
              <button
                onClick={handleAddNote}
                className="bg-[#8b5cf6] text-white px-4 py-2 rounded-xl font-semibold text-xs hover:bg-[#7c3aed] transition-all cursor-pointer"
              >
                Save
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-48 overflow-y-auto pr-1 scrollbar-thin">
              {stickyNotes.length === 0 ? (
                <div className="col-span-full text-center py-6 text-xs text-[#a1a1aa]">
                  No notes saved yet. Capture thoughts, links, or reminders here.
                </div>
              ) : (
                stickyNotes.map((note) => (
                  <div
                    key={note.id}
                    className="p-3 bg-[#27272a]/60 border border-white/10 rounded-2xl flex flex-col justify-between group hover:border-[#8b5cf6]/40 transition-all"
                  >
                    <p className="text-xs text-[#fafafa] whitespace-pre-wrap leading-relaxed">{note.content}</p>
                    <button
                      onClick={() => handleDeleteNote(note.id)}
                      className="text-[10px] text-rose-400 opacity-0 group-hover:opacity-100 mt-2 self-end hover:underline cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Upcoming Tasks Widget (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#18181b] rounded-3xl border border-white/10 shadow-2xl flex flex-col h-full overflow-hidden">
            <div className="p-5 border-b border-white/10 flex justify-between items-center bg-[#27272a]/40">
              <h3 className="text-base font-bold text-[#fafafa]">Today's Schedule</h3>
              <button
                onClick={() => onSelectView('tasks')}
                className="text-xs font-semibold text-[#c084fc] hover:underline flex items-center gap-1 cursor-pointer"
              >
                View All <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="p-4 flex-1 space-y-2.5 overflow-y-auto max-h-[420px] scrollbar-thin">
              {todayTasks.length === 0 ? (
                <div className="text-center py-12 px-4 space-y-3">
                  <Target className="w-10 h-10 text-[#a1a1aa] mx-auto opacity-50" />
                  <p className="text-xs text-[#a1a1aa]">No tasks scheduled for today.</p>
                  <button
                    onClick={onOpenQuickAdd}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#8b5cf6] text-white rounded-full text-xs font-semibold hover:bg-[#7c3aed] shadow-md transition-all cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Task
                  </button>
                </div>
              ) : (
                todayTasks.map((task) => (
                  <div
                    key={task.id}
                    className={`group flex items-center gap-3 p-3 rounded-2xl border transition-all ${
                      task.completed
                        ? 'bg-[#09090b]/40 border-white/5 opacity-60'
                        : 'bg-[#27272a]/50 border-white/10 hover:bg-[#27272a]'
                    }`}
                  >
                    <button
                      onClick={(e) => handleTaskCheck(task.id, e)}
                      className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all cursor-pointer ${
                        task.completed
                          ? 'bg-[#8b5cf6] border-[#8b5cf6] text-white'
                          : 'border-[#a1a1aa] hover:border-[#8b5cf6]'
                      }`}
                    >
                      {task.completed && <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />}
                    </button>
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-semibold truncate ${task.completed ? 'line-through text-[#a1a1aa]' : 'text-[#fafafa]'}`}>
                        {task.name}
                      </p>
                      <span className="text-[10px] text-[#a1a1aa] block mt-0.5">{task.category} • {task.priority}</span>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-4 bg-[#27272a]/20 border-t border-white/10">
              <button
                onClick={onOpenQuickAdd}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-dashed border-white/20 text-[#a1a1aa] font-semibold text-xs hover:bg-[#27272a] hover:text-[#fafafa] hover:border-[#8b5cf6]/50 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4 text-[#8b5cf6]" />
                <span>Quick Add Task</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* AI Recommendation Optimization Banner */}
      <div className="p-6 bg-gradient-to-r from-[#8b5cf6] to-[#d946ef] text-white rounded-3xl shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="flex items-center gap-4 z-10">
          <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <div>
            <h4 className="font-extrabold text-lg text-white">AI Schedule Optimization Engine</h4>
            <p className="text-xs font-medium opacity-90 max-w-2xl mt-0.5">
              {aiSuggestion?.suggestion || "Based on your cognitive load, peak focus window is between 9:00 AM - 11:30 AM. Group high-priority tasks in morning blocks for maximum flow."}
            </p>
          </div>
        </div>
        <div className="z-10 flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={() => onSelectView('todays-planner')}
            className="px-6 py-2.5 rounded-full bg-[#0f0f12] text-white text-xs font-bold hover:bg-[#18181b] transition-all shadow-lg cursor-pointer"
          >
            Apply Optimization
          </button>
        </div>
      </div>
    </div>
  );
};
