import React, { useState } from 'react';
import { Habit, TaskCategory } from '../types';
import { Flame, Plus, Check, Award, Sparkles, Droplets, Dumbbell, BookOpen, Moon, Terminal, Heart } from 'lucide-react';
import confetti from 'canvas-confetti';

interface HabitsViewProps {
  habits: Habit[];
  onAddHabit: (habit: Partial<Habit>) => void;
  onUpdateHabit: (habit: Partial<Habit>) => void;
  onDeleteHabit: (id: string) => void;
}

const DEFAULT_TEMPLATES = [
  { title: 'Drink Water', category: 'Health' as TaskCategory, unit: 'Cups', targetCount: 8, icon: <Droplets className="w-5 h-5 text-sky-400" /> },
  { title: 'Daily Workout', category: 'Fitness' as TaskCategory, unit: 'Mins', targetCount: 45, icon: <Dumbbell className="w-5 h-5 text-amber-400" /> },
  { title: 'Read Book', category: 'Reading' as TaskCategory, unit: 'Pages', targetCount: 20, icon: <BookOpen className="w-5 h-5 text-purple-400" /> },
  { title: 'Quality Sleep', category: 'Health' as TaskCategory, unit: 'Hours', targetCount: 8, icon: <Moon className="w-5 h-5 text-[#abc7ff]" /> },
  { title: 'Deep Coding', category: 'Coding' as TaskCategory, unit: 'Hours', targetCount: 2, icon: <Terminal className="w-5 h-5 text-emerald-400" /> },
];

export const HabitsView: React.FC<HabitsViewProps> = ({
  habits,
  onAddHabit,
  onUpdateHabit,
  onDeleteHabit,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<TaskCategory>('Health');
  const [targetCount, setTargetCount] = useState(1);
  const [unit, setUnit] = useState('times');

  const todayStr = new Date().toISOString().split('T')[0];

  const handleCheckIn = (habit: Habit) => {
    const alreadyCompleted = habit.completedDates.includes(todayStr);
    let newDates = [...habit.completedDates];
    let newStreak = habit.streak;

    if (alreadyCompleted) {
      newDates = newDates.filter(d => d !== todayStr);
      newStreak = Math.max(newStreak - 1, 0);
    } else {
      newDates.push(todayStr);
      newStreak += 1;
      confetti({ particleCount: 35, spread: 50, origin: { y: 0.6 } });
    }

    onUpdateHabit({
      ...habit,
      completedDates: newDates,
      streak: newStreak,
      bestStreak: Math.max(habit.bestStreak || 0, newStreak)
    });
  };

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddHabit({
      id: `habit_${Date.now()}`,
      title: title.trim(),
      category,
      targetCount: Number(targetCount) || 1,
      unit,
      currentCount: 0,
      colorTag: '#abc7ff',
      streak: 0,
      bestStreak: 0,
      completedDates: [],
      createdAt: new Date().toISOString()
    });

    setTitle('');
    setShowAddModal(false);
  };

  const addTemplate = (tpl: typeof DEFAULT_TEMPLATES[0]) => {
    onAddHabit({
      id: `habit_${Date.now()}`,
      title: tpl.title,
      category: tpl.category,
      targetCount: tpl.targetCount,
      unit: tpl.unit,
      currentCount: 0,
      colorTag: '#abc7ff',
      streak: 0,
      bestStreak: 0,
      completedDates: [],
      createdAt: new Date().toISOString()
    });
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-6 border-b border-white/10 gap-4">
        <div>
          <span className="text-xs font-bold text-[#c084fc] uppercase tracking-widest block mb-1">Atomic Habits Engine</span>
          <h1 className="text-3xl font-extrabold text-[#fafafa]">Habit Tracker & Heatmap</h1>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#8b5cf6] text-white rounded-full text-xs font-bold hover:bg-[#7c3aed] shadow-lg shadow-[#8b5cf6]/20 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Create Custom Habit
        </button>
      </div>

      {/* Quick Habit Template Recommendations */}
      <div className="bg-[#18181b] p-5 rounded-3xl border border-white/10 space-y-3">
        <span className="text-xs font-bold text-[#c084fc] uppercase tracking-wider block">Starter Atomic Templates</span>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {DEFAULT_TEMPLATES.map((tpl) => (
            <button
              key={tpl.title}
              onClick={() => addTemplate(tpl)}
              className="p-3 rounded-2xl bg-[#27272a]/50 border border-white/10 hover:border-[#8b5cf6]/50 hover:bg-[#27272a] transition-all flex flex-col items-center text-center group cursor-pointer"
            >
              <div className="mb-2 p-2 bg-[#09090b] rounded-xl group-hover:scale-110 transition-transform">
                {tpl.icon}
              </div>
              <span className="text-xs font-bold text-[#fafafa] truncate w-full">{tpl.title}</span>
              <span className="text-[10px] text-[#a1a1aa] mt-0.5">{tpl.targetCount} {tpl.unit}/day</span>
            </button>
          ))}
        </div>
      </div>

      {/* Active Habits List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {habits.length === 0 ? (
          <div className="col-span-full bg-[#18181b]/40 p-12 rounded-3xl text-center border border-dashed border-white/10">
            <Flame className="w-10 h-10 text-[#a1a1aa] mx-auto mb-2 opacity-50" />
            <p className="text-xs text-[#a1a1aa]">No habits created yet. Click above or select a template to build momentum!</p>
          </div>
        ) : (
          habits.map((habit) => {
            const isDoneToday = habit.completedDates.includes(todayStr);

            return (
              <div
                key={habit.id}
                className={`p-6 rounded-3xl border backdrop-blur-xl transition-all flex flex-col justify-between shadow-xl ${
                  isDoneToday
                    ? 'bg-[#8b5cf6]/10 border-[#8b5cf6]/50 shadow-[0_0_15px_rgba(139,92,246,0.15)]'
                    : 'bg-[#18181b] border-white/10 hover:border-[#8b5cf6]/40'
                }`}
              >
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-[10px] font-bold text-[#c084fc] bg-[#8b5cf6]/10 px-2 py-0.5 rounded-full uppercase">
                      {habit.category}
                    </span>
                    <div className="flex items-center gap-1 text-xs font-bold text-amber-400">
                      <Flame className="w-4 h-4 fill-amber-400" />
                      <span>{habit.streak}d streak</span>
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-[#fafafa] mb-1">{habit.title}</h3>
                  <p className="text-xs text-[#a1a1aa] mb-4">Target: {habit.targetCount} {habit.unit} daily</p>
                </div>

                {/* Daily Check-in Button */}
                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <span className="text-[11px] text-[#a1a1aa]">
                    Best Streak: <strong className="text-[#fafafa]">{habit.bestStreak || habit.streak}d</strong>
                  </span>

                  <button
                    onClick={() => handleCheckIn(habit)}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer ${
                      isDoneToday
                        ? 'bg-[#8b5cf6] text-white'
                        : 'bg-[#27272a] text-[#a1a1aa] hover:bg-[#3f3f46] hover:text-[#fafafa]'
                    }`}
                  >
                    <Check className="w-4 h-4" />
                    <span>{isDoneToday ? 'Completed' : 'Check In'}</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal for Creating Custom Habit */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="w-full max-w-md bg-[#18181b] border border-white/10 rounded-3xl p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-[#fafafa]">Create New Habit</h3>
            <form onSubmit={handleAddCustom} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#c084fc] uppercase mb-1">Habit Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Morning Meditation"
                  className="w-full bg-[#09090b] border border-white/10 rounded-xl px-3 py-2 text-sm text-[#fafafa] placeholder-[#a1a1aa] focus:outline-none focus:border-[#8b5cf6]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#a1a1aa] uppercase mb-1">Target Count</label>
                  <input
                    type="number"
                    min={1}
                    value={targetCount}
                    onChange={(e) => setTargetCount(Number(e.target.value))}
                    className="w-full bg-[#09090b] border border-white/10 rounded-xl px-3 py-2 text-sm text-[#fafafa] focus:outline-none focus:border-[#8b5cf6]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#a1a1aa] uppercase mb-1">Unit</label>
                  <input
                    type="text"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    placeholder="e.g. Mins / Times"
                    className="w-full bg-[#09090b] border border-white/10 rounded-xl px-3 py-2 text-sm text-[#fafafa] placeholder-[#a1a1aa] focus:outline-none focus:border-[#8b5cf6]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#a1a1aa] hover:text-[#fafafa] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-[#8b5cf6] text-white text-xs font-bold hover:bg-[#7c3aed] shadow-md cursor-pointer"
                >
                  Save Habit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
