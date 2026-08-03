import React, { useState } from 'react';
import { Goal, TaskCategory } from '../types';
import { Target, Plus, CheckCircle2, Calendar, Flag, Award } from 'lucide-react';

interface GoalsViewProps {
  goals: Goal[];
  onAddGoal: (goal: Partial<Goal>) => void;
  onUpdateGoal: (goal: Partial<Goal>) => void;
  onDeleteGoal: (id: string) => void;
}

export const GoalsView: React.FC<GoalsViewProps> = ({ goals, onAddGoal, onUpdateGoal, onDeleteGoal }) => {
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [type, setType] = useState<'Short Term' | 'Long Term'>('Short Term');
  const [category, setCategory] = useState<TaskCategory>('Projects');
  const [deadline, setDeadline] = useState('');
  const [milestonesText, setMilestonesText] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const milestones = milestonesText
      .split('\n')
      .map((m) => m.trim())
      .filter(Boolean)
      .map((m, idx) => ({ id: `m_${idx}_${Date.now()}`, title: m, completed: false }));

    onAddGoal({
      id: `goal_${Date.now()}`,
      title: title.trim(),
      type,
      category,
      deadline: deadline || new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      targetPercentage: 100,
      currentPercentage: 0,
      milestones,
      colorTag: '#abc7ff',
      createdAt: new Date().toISOString(),
    });

    setTitle('');
    setMilestonesText('');
    setShowModal(false);
  };

  const toggleMilestone = (goal: Goal, milestoneId: string) => {
    const updatedMilestones = goal.milestones.map((m) =>
      m.id === milestoneId ? { ...m, completed: !m.completed } : m
    );
    const completedCount = updatedMilestones.filter((m) => m.completed).length;
    const currentPct = updatedMilestones.length > 0 ? Math.round((completedCount / updatedMilestones.length) * 100) : 0;

    onUpdateGoal({
      ...goal,
      milestones: updatedMilestones,
      currentPercentage: currentPct,
    });
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-6 border-b border-white/10 gap-4">
        <div>
          <span className="text-xs font-bold text-[#c084fc] uppercase tracking-widest block mb-1">Strategic Milestones</span>
          <h1 className="text-3xl font-extrabold text-[#fafafa]">Short & Long Term Goals</h1>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#8b5cf6] text-white rounded-full text-xs font-bold hover:bg-[#7c3aed] shadow-lg shadow-[#8b5cf6]/20 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Set Strategic Goal
        </button>
      </div>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {goals.length === 0 ? (
          <div className="col-span-full bg-[#18181b]/40 p-12 rounded-3xl text-center border border-dashed border-white/10">
            <Target className="w-12 h-12 text-[#a1a1aa] mx-auto mb-2 opacity-40" />
            <p className="text-xs text-[#a1a1aa]">No goals created yet. Set long term and short term objectives to drive focus!</p>
          </div>
        ) : (
          goals.map((goal) => (
            <div
              key={goal.id}
              className="bg-[#18181b] p-6 rounded-3xl border border-white/10 shadow-xl flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-[#c084fc] bg-[#8b5cf6]/10 px-2.5 py-0.5 rounded-full uppercase">
                    {goal.type} • {goal.category}
                  </span>
                  <span className="text-xs text-[#a1a1aa] flex items-center gap-1 font-mono">
                    <Calendar className="w-3.5 h-3.5 text-[#8b5cf6]" /> {goal.deadline}
                  </span>
                </div>

                <h3 className="text-base font-bold text-[#fafafa] mb-2">{goal.title}</h3>

                {/* Progress Bar */}
                <div className="space-y-1.5 mb-4">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-[#a1a1aa]">Overall Progress</span>
                    <span className="text-[#c084fc]">{goal.currentPercentage}%</span>
                  </div>
                  <div className="h-2 w-full bg-[#09090b] rounded-full overflow-hidden">
                    <div
                      style={{ width: `${goal.currentPercentage}%` }}
                      className="h-full bg-[#8b5cf6] rounded-full transition-all duration-700 shadow-[0_0_8px_rgba(139,92,246,0.4)]"
                    />
                  </div>
                </div>

                {/* Milestones Checklist */}
                <div className="space-y-2 pt-2 border-t border-white/10">
                  <span className="text-xs font-bold text-[#c084fc] uppercase tracking-wider block">Milestones</span>
                  {goal.milestones.length === 0 ? (
                    <p className="text-xs text-[#a1a1aa] italic">No milestones defined.</p>
                  ) : (
                    goal.milestones.map((m) => (
                      <div
                        key={m.id}
                        onClick={() => toggleMilestone(goal, m.id)}
                        className="flex items-center gap-2.5 text-xs text-[#fafafa] cursor-pointer hover:text-[#c084fc] transition-colors"
                      >
                        <div
                          className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                            m.completed ? 'bg-[#8b5cf6] border-[#8b5cf6] text-white' : 'border-[#a1a1aa]'
                          }`}
                        >
                          {m.completed && <CheckCircle2 className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <span className={m.completed ? 'line-through text-[#a1a1aa]' : ''}>{m.title}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-white/10 flex justify-end">
                <button
                  onClick={() => onDeleteGoal(goal.id)}
                  className="text-xs text-rose-400 hover:underline cursor-pointer"
                >
                  Delete Goal
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Goal Creation Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="w-full max-w-lg bg-[#18181b] border border-white/10 rounded-3xl p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-[#fafafa]">Set New Goal</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#c084fc] uppercase mb-1">Goal Objective</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Master Full Stack Development in 90 Days"
                  className="w-full bg-[#09090b] border border-white/10 rounded-xl px-3 py-2 text-sm text-[#fafafa] placeholder-[#a1a1aa] focus:outline-none focus:border-[#8b5cf6]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#a1a1aa] uppercase mb-1">Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full bg-[#09090b] border border-white/10 rounded-xl px-3 py-2 text-sm text-[#fafafa] focus:outline-none focus:border-[#8b5cf6]"
                  >
                    <option value="Short Term" className="bg-[#18181b]">Short Term</option>
                    <option value="Long Term" className="bg-[#18181b]">Long Term</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#a1a1aa] uppercase mb-1">Target Deadline</label>
                  <input
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full bg-[#09090b] border border-white/10 rounded-xl px-3 py-2 text-sm text-[#fafafa] focus:outline-none focus:border-[#8b5cf6]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#a1a1aa] uppercase mb-1">Milestones (1 per line)</label>
                <textarea
                  rows={3}
                  value={milestonesText}
                  onChange={(e) => setMilestonesText(e.target.value)}
                  placeholder="Milestone 1&#10;Milestone 2&#10;Milestone 3"
                  className="w-full bg-[#09090b] border border-white/10 rounded-xl p-3 text-sm text-[#fafafa] placeholder-[#a1a1aa] focus:outline-none focus:border-[#8b5cf6]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#a1a1aa] hover:text-[#fafafa] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-[#8b5cf6] text-white text-xs font-bold hover:bg-[#7c3aed] shadow-md cursor-pointer"
                >
                  Create Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
