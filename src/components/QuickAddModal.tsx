import React, { useState } from 'react';
import { X, Calendar, Clock, Tag, MapPin, AlertCircle, FileText, CheckCircle2 } from 'lucide-react';
import { Task, TaskCategory, PriorityLevel, DifficultyLevel } from '../types';

interface QuickAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTask: (task: Partial<Task>) => void;
}

const CATEGORIES: TaskCategory[] = [
  'College', 'Work', 'Study', 'Health', 'Fitness', 'Finance', 
  'Shopping', 'Travel', 'Reading', 'Projects', 'Coding', 'Personal', 'Family', 'Others'
];

const PRIORITIES: PriorityLevel[] = ['Critical', 'High', 'Medium', 'Low'];
const DIFFICULTIES: DifficultyLevel[] = ['Easy', 'Medium', 'Hard'];

const COLOR_TAGS = [
  '#8b5cf6', '#d946ef', '#38bdf8', '#10b981', '#f59e0b', '#f43f5e', '#a855f7'
];

export const QuickAddModal: React.FC<QuickAddModalProps> = ({ isOpen, onClose, onAddTask }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<TaskCategory>('Work');
  const [priority, setPriority] = useState<PriorityLevel>('High');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('Medium');
  const [estimatedMinutes, setEstimatedMinutes] = useState(30);
  const [dueDate, setDueDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [recurring, setRecurring] = useState<'None' | 'Daily' | 'Weekly' | 'Monthly'>('None');
  const [location, setLocation] = useState('');
  const [colorTag, setColorTag] = useState(COLOR_TAGS[0]);
  const [notes, setNotes] = useState('');
  const [pinned, setPinned] = useState(false);
  const [starred, setStarred] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onAddTask({
      id: `task_${Date.now()}`,
      name: name.trim(),
      description: description.trim(),
      category,
      priority,
      difficulty,
      estimatedMinutes: Number(estimatedMinutes) || 30,
      dueDate,
      startTime,
      endTime,
      recurring,
      location: location.trim(),
      colorTag,
      notes: notes.trim(),
      completed: false,
      archived: false,
      pinned,
      starred,
      createdAt: new Date().toISOString(),
    });

    // Reset form
    setName('');
    setDescription('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-[#18181b] border border-white/10 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10 bg-[#0f0f12]">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-[#8b5cf6]" />
            <h2 className="text-lg font-bold text-[#fafafa]">Create New Task</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#a1a1aa] hover:text-[#fafafa] hover:bg-[#27272a] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1 scrollbar-thin">
          {/* Task Name */}
          <div>
            <label className="block text-xs font-semibold text-[#c084fc] uppercase tracking-wider mb-1.5">
              Task Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Complete Q3 Product Design Specs"
              className="w-full bg-[#09090b] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-[#fafafa] placeholder-[#a1a1aa] focus:outline-none focus:border-[#8b5cf6] transition-all"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-[#a1a1aa] uppercase tracking-wider mb-1.5">
              Description
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add contextual details or objectives..."
              className="w-full bg-[#09090b] border border-white/10 rounded-xl p-3 text-sm text-[#fafafa] placeholder-[#a1a1aa] focus:outline-none focus:border-[#8b5cf6] transition-all resize-none"
            />
          </div>

          {/* Category & Priority Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#a1a1aa] uppercase tracking-wider mb-1.5">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as TaskCategory)}
                className="w-full bg-[#09090b] border border-white/10 rounded-xl px-3 py-2 text-sm text-[#fafafa] focus:outline-none focus:border-[#8b5cf6]"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat} className="bg-[#18181b]">{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#a1a1aa] uppercase tracking-wider mb-1.5">
                Priority
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {PRIORITIES.map((p) => {
                  const active = priority === p;
                  let colorClass = 'text-gray-400';
                  if (p === 'Critical') colorClass = 'text-rose-400';
                  if (p === 'High') colorClass = 'text-amber-400';
                  if (p === 'Medium') colorClass = 'text-sky-400';
                  if (p === 'Low') colorClass = 'text-emerald-400';

                  return (
                    <button
                      type="button"
                      key={p}
                      onClick={() => setPriority(p)}
                      className={`py-1.5 px-2 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                        active
                          ? 'bg-[#27272a] border-[#8b5cf6] text-[#fafafa] shadow-sm'
                          : 'bg-[#09090b] border-white/10 text-[#a1a1aa] hover:border-white/20'
                      }`}
                    >
                      <span className={colorClass}>{p[0]}</span> {p}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Time & Scheduling Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#a1a1aa] uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-[#8b5cf6]" /> Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full bg-[#09090b] border border-white/10 rounded-xl px-3 py-2 text-sm text-[#fafafa] focus:outline-none focus:border-[#8b5cf6]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#a1a1aa] uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#8b5cf6]" /> Start Time
              </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full bg-[#09090b] border border-white/10 rounded-xl px-3 py-2 text-sm text-[#fafafa] focus:outline-none focus:border-[#8b5cf6]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#a1a1aa] uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#8b5cf6]" /> End Time
              </label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full bg-[#09090b] border border-white/10 rounded-xl px-3 py-2 text-sm text-[#fafafa] focus:outline-none focus:border-[#8b5cf6]"
              />
            </div>
          </div>

          {/* Additional Parameters: Estimated Time, Recurring, Location */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#a1a1aa] uppercase tracking-wider mb-1.5">
                Est. Duration (mins)
              </label>
              <input
                type="number"
                min={5}
                step={5}
                value={estimatedMinutes}
                onChange={(e) => setEstimatedMinutes(Number(e.target.value))}
                className="w-full bg-[#09090b] border border-white/10 rounded-xl px-3 py-2 text-sm text-[#fafafa] focus:outline-none focus:border-[#8b5cf6]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#a1a1aa] uppercase tracking-wider mb-1.5">
                Recurring
              </label>
              <select
                value={recurring}
                onChange={(e) => setRecurring(e.target.value as any)}
                className="w-full bg-[#09090b] border border-white/10 rounded-xl px-3 py-2 text-sm text-[#fafafa] focus:outline-none focus:border-[#8b5cf6]"
              >
                <option value="None" className="bg-[#18181b]">None</option>
                <option value="Daily" className="bg-[#18181b]">Daily</option>
                <option value="Weekly" className="bg-[#18181b]">Weekly</option>
                <option value="Monthly" className="bg-[#18181b]">Monthly</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#a1a1aa] uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#8b5cf6]" /> Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Remote / SF Office"
                className="w-full bg-[#09090b] border border-white/10 rounded-xl px-3 py-2 text-sm text-[#fafafa] placeholder-[#a1a1aa] focus:outline-none focus:border-[#8b5cf6]"
              />
            </div>
          </div>

          {/* Color Tag & Flags */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-white/10">
            <div>
              <label className="block text-xs font-semibold text-[#a1a1aa] uppercase tracking-wider mb-1.5">
                Accent Tag
              </label>
              <div className="flex items-center gap-2">
                {COLOR_TAGS.map((color) => (
                  <button
                    type="button"
                    key={color}
                    onClick={() => setColorTag(color)}
                    style={{ backgroundColor: color }}
                    className={`w-6 h-6 rounded-full transition-transform cursor-pointer ${
                      colorTag === color ? 'ring-2 ring-white scale-110' : 'opacity-70 hover:opacity-100'
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-[#fafafa]">
                <input
                  type="checkbox"
                  checked={pinned}
                  onChange={(e) => setPinned(e.target.checked)}
                  className="rounded border-white/20 bg-[#09090b] text-[#8b5cf6] focus:ring-0"
                />
                Pin to Top
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-xs text-[#fafafa]">
                <input
                  type="checkbox"
                  checked={starred}
                  onChange={(e) => setStarred(e.target.checked)}
                  className="rounded border-white/20 bg-[#09090b] text-[#8b5cf6] focus:ring-0"
                />
                Star / Favorite
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-full text-sm font-semibold text-[#a1a1aa] hover:text-[#fafafa] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-full text-sm font-semibold bg-[#8b5cf6] text-white hover:bg-[#7c3aed] shadow-lg shadow-[#8b5cf6]/25 transition-all active:scale-95 cursor-pointer"
            >
              Add Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
