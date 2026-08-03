import React, { useState } from 'react';
import { Task, TaskCategory, PriorityLevel } from '../types';
import { 
  CheckCircle2, 
  Plus, 
  Search, 
  Filter, 
  Star, 
  Pin, 
  Trash2, 
  Copy, 
  Archive, 
  CheckSquare, 
  AlertCircle,
  ArrowUpDown
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface TasksViewProps {
  tasks: Task[];
  onToggleTask: (id: string) => void;
  onAddTask: (task: Partial<Task>) => void;
  onDeleteTask: (id: string) => void;
  onUpdateTask: (task: Partial<Task>) => void;
  onOpenQuickAdd: () => void;
}

const CATEGORIES: (TaskCategory | 'All')[] = [
  'All', 'Work', 'Study', 'Coding', 'Health', 'Fitness', 'Finance', 
  'Projects', 'College', 'Reading', 'Personal', 'Family', 'Shopping', 'Travel', 'Others'
];

export const TasksView: React.FC<TasksViewProps> = ({
  tasks,
  onToggleTask,
  onAddTask,
  onDeleteTask,
  onUpdateTask,
  onOpenQuickAdd,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<TaskCategory | 'All'>('All');
  const [selectedPriority, setSelectedPriority] = useState<PriorityLevel | 'All'>('All');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Pending' | 'Completed' | 'Starred'>('All');
  const [sortBy, setSortBy] = useState<'Priority' | 'Date' | 'Alphabetical'>('Date');
  const [localSearch, setLocalSearch] = useState('');

  const handleTaskCheck = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleTask(id);
    confetti({
      particleCount: 45,
      spread: 60,
      origin: { y: 0.6 }
    });
  };

  const handleDuplicate = (task: Task) => {
    onAddTask({
      ...task,
      id: `task_${Date.now()}`,
      name: `${task.name} (Copy)`,
      completed: false,
      createdAt: new Date().toISOString()
    });
  };

  const handleToggleStar = (task: Task) => {
    onUpdateTask({ id: task.id, starred: !task.starred });
  };

  const handleTogglePin = (task: Task) => {
    onUpdateTask({ id: task.id, pinned: !task.pinned });
  };

  // Filtering & Sorting logic
  let filtered = tasks.filter((t) => !t.archived);

  if (selectedCategory !== 'All') {
    filtered = filtered.filter((t) => t.category === selectedCategory);
  }
  if (selectedPriority !== 'All') {
    filtered = filtered.filter((t) => t.priority === selectedPriority);
  }
  if (statusFilter === 'Pending') {
    filtered = filtered.filter((t) => !t.completed);
  } else if (statusFilter === 'Completed') {
    filtered = filtered.filter((t) => t.completed);
  } else if (statusFilter === 'Starred') {
    filtered = filtered.filter((t) => t.starred);
  }
  if (localSearch.trim()) {
    const q = localSearch.toLowerCase();
    filtered = filtered.filter((t) => t.name.toLowerCase().includes(q) || t.description?.toLowerCase().includes(q));
  }

  // Sort
  filtered.sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;

    if (sortBy === 'Priority') {
      const pMap = { Critical: 1, High: 2, Medium: 3, Low: 4 };
      return (pMap[a.priority] || 5) - (pMap[b.priority] || 5);
    }
    if (sortBy === 'Alphabetical') {
      return a.name.localeCompare(b.name);
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-6 border-b border-white/10 gap-4">
        <div>
          <span className="text-xs font-bold text-[#c084fc] uppercase tracking-widest block mb-1">Master Task System</span>
          <h1 className="text-3xl font-extrabold text-[#fafafa]">Tasks & Checklists</h1>
        </div>

        <button
          onClick={onOpenQuickAdd}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#8b5cf6] text-white rounded-full text-xs font-bold hover:bg-[#7c3aed] shadow-lg shadow-[#8b5cf6]/20 transition-all active:scale-95 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Create Task
        </button>
      </div>

      {/* Control Bar: Filters, Search & Sorting */}
      <div className="bg-[#18181b] p-4 rounded-3xl border border-white/10 space-y-4 shadow-lg">
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
          {/* Status Tabs */}
          <div className="flex items-center gap-1 bg-[#09090b] p-1 rounded-full border border-white/10 w-full md:w-auto">
            {(['All', 'Pending', 'Completed', 'Starred'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`flex-1 md:flex-none px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  statusFilter === status
                    ? 'bg-[#27272a] text-[#c084fc] shadow-sm'
                    : 'text-[#a1a1aa] hover:text-[#fafafa]'
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          {/* Search & Sort Dropdowns */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#a1a1aa]" />
              <input
                type="text"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                placeholder="Filter tasks..."
                className="w-full bg-[#09090b] border border-white/10 rounded-full py-1.5 pl-9 pr-3 text-xs text-[#fafafa] placeholder-[#a1a1aa] focus:outline-none focus:border-[#8b5cf6]"
              />
            </div>

            <div className="flex items-center gap-1 bg-[#09090b] px-3 py-1.5 rounded-full border border-white/10 text-xs text-[#fafafa]">
              <ArrowUpDown className="w-3.5 h-3.5 text-[#8b5cf6]" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-xs text-[#fafafa] focus:outline-none cursor-pointer"
              >
                <option value="Date" className="bg-[#18181b]">Sort: Newest</option>
                <option value="Priority" className="bg-[#18181b]">Sort: Priority</option>
                <option value="Alphabetical" className="bg-[#18181b]">Sort: Name</option>
              </select>
            </div>
          </div>
        </div>

        {/* Categories Chips Row */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none pt-2 border-t border-white/10">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all border cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#8b5cf6]/20 text-[#c084fc] border-[#8b5cf6]/50'
                  : 'bg-[#27272a]/40 text-[#a1a1aa] border-white/10 hover:text-[#fafafa]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-[#18181b]/40 rounded-3xl p-12 text-center border border-dashed border-white/10 space-y-3">
            <CheckSquare className="w-12 h-12 text-[#a1a1aa] mx-auto opacity-40" />
            <p className="text-sm text-[#a1a1aa]">No tasks found matching current filters.</p>
            <button
              onClick={onOpenQuickAdd}
              className="inline-flex items-center gap-1.5 px-5 py-2 bg-[#8b5cf6] text-white rounded-full text-xs font-bold hover:bg-[#7c3aed] transition-all shadow-md cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add Your First Task
            </button>
          </div>
        ) : (
          filtered.map((task) => (
            <div
              key={task.id}
              className={`group p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                task.completed
                  ? 'bg-[#09090b]/40 border-white/5 opacity-60'
                  : 'bg-[#18181b] border-white/10 hover:border-[#8b5cf6]/40 shadow-lg'
              }`}
            >
              <div className="flex items-start sm:items-center gap-3.5 flex-1 min-w-0">
                {/* Interactive Animated Checkbox */}
                <button
                  onClick={(e) => handleTaskCheck(task.id, e)}
                  className={`mt-0.5 sm:mt-0 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all cursor-pointer ${
                    task.completed
                      ? 'bg-[#8b5cf6] border-[#8b5cf6] text-white'
                      : 'border-[#a1a1aa] hover:border-[#8b5cf6]'
                  }`}
                >
                  {task.completed && <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />}
                </button>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className={`text-sm font-bold truncate ${task.completed ? 'line-through text-[#a1a1aa]' : 'text-[#fafafa]'}`}>
                      {task.name}
                    </h4>
                    {task.pinned && <Pin className="w-3 h-3 text-[#c084fc] fill-[#c084fc]" />}
                    {task.starred && <Star className="w-3 h-3 text-amber-300 fill-amber-300" />}
                  </div>

                  {task.description && (
                    <p className="text-xs text-[#a1a1aa] mt-0.5 line-clamp-1">{task.description}</p>
                  )}

                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#8b5cf6]/10 text-[#c084fc]">
                      {task.category}
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#27272a] text-[#fafafa]">
                      {task.priority}
                    </span>
                    {task.dueDate && (
                      <span className="text-[10px] text-[#a1a1aa] font-mono">Due {task.dueDate}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Task Quick Action Buttons */}
              <div className="flex items-center gap-1 self-end sm:self-auto pt-2 sm:pt-0 border-t sm:border-0 border-white/10">
                <button
                  onClick={() => handleToggleStar(task)}
                  className={`p-2 rounded-xl transition-all cursor-pointer ${
                    task.starred ? 'text-amber-300 bg-amber-300/10' : 'text-[#a1a1aa] hover:text-[#fafafa] hover:bg-[#27272a]'
                  }`}
                  title="Star Task"
                >
                  <Star className="w-4 h-4" />
                </button>

                <button
                  onClick={() => handleTogglePin(task)}
                  className={`p-2 rounded-xl transition-all cursor-pointer ${
                    task.pinned ? 'text-[#c084fc] bg-[#8b5cf6]/10' : 'text-[#a1a1aa] hover:text-[#fafafa] hover:bg-[#27272a]'
                  }`}
                  title="Pin Task"
                >
                  <Pin className="w-4 h-4" />
                </button>

                <button
                  onClick={() => handleDuplicate(task)}
                  className="p-2 rounded-xl text-[#a1a1aa] hover:text-[#fafafa] hover:bg-[#27272a] transition-all cursor-pointer"
                  title="Duplicate Task"
                >
                  <Copy className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onDeleteTask(task.id)}
                  className="p-2 rounded-xl text-[#a1a1aa] hover:text-rose-400 hover:bg-rose-500/10 transition-all cursor-pointer"
                  title="Delete Task"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
