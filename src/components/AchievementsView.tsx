import React from 'react';
import { Achievement } from '../types';
import { Trophy, Award, Lock, Sparkles, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface AchievementsViewProps {
  achievements: Achievement[];
}

export const AchievementsView: React.FC<AchievementsViewProps> = ({ achievements }) => {
  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  const triggerConfetti = () => {
    confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-6 border-b border-white/10 gap-4">
        <div>
          <span className="text-xs font-bold text-[#c084fc] uppercase tracking-widest block mb-1">Gamified Milestones</span>
          <h1 className="text-3xl font-extrabold text-[#fafafa]">Achievements & Trophies</h1>
        </div>

        <div className="flex items-center gap-2 bg-[#18181b] px-4 py-2 rounded-full border border-white/10 text-xs font-bold text-[#c084fc]">
          <Trophy className="w-4 h-4 text-[#8b5cf6]" />
          <span>{unlockedCount} of {achievements.length} Unlocked</span>
        </div>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {achievements.map((ach) => {
          const pct = Math.round((ach.progress / ach.maxProgress) * 100);

          return (
            <div
              key={ach.id}
              onClick={() => ach.unlocked && triggerConfetti()}
              className={`p-6 rounded-3xl border backdrop-blur-xl transition-all flex flex-col justify-between shadow-xl cursor-pointer group ${
                ach.unlocked
                  ? 'bg-[#8b5cf6]/10 border-[#8b5cf6]/50 shadow-[0_0_15px_rgba(139,92,246,0.15)] hover:scale-[1.02]'
                  : 'bg-[#18181b] border-white/10 opacity-70 hover:opacity-100'
              }`}
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg ${
                      ach.unlocked ? 'bg-[#8b5cf6] text-white' : 'bg-[#27272a] text-[#a1a1aa]'
                    }`}
                  >
                    {ach.unlocked ? <Trophy className="w-6 h-6" /> : <Lock className="w-5 h-5" />}
                  </div>
                  <span className="text-[10px] font-bold text-[#c084fc] bg-[#8b5cf6]/10 px-2 py-0.5 rounded-full uppercase">
                    {ach.category}
                  </span>
                </div>

                <h3 className="text-base font-bold text-[#fafafa] mb-1">{ach.title}</h3>
                <p className="text-xs text-[#a1a1aa] mb-4">{ach.description}</p>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1.5 pt-3 border-t border-white/10">
                <div className="flex justify-between text-[11px] font-semibold">
                  <span className="text-[#a1a1aa]">{ach.unlocked ? 'Unlocked' : 'Progress'}</span>
                  <span className={ach.unlocked ? 'text-[#c084fc]' : 'text-[#a1a1aa]'}>
                    {ach.progress} / {ach.maxProgress}
                  </span>
                </div>
                <div className="h-1.5 w-full bg-[#09090b] rounded-full overflow-hidden">
                  <div
                    style={{ width: `${pct}%` }}
                    className={`h-full rounded-full transition-all duration-700 ${
                      ach.unlocked ? 'bg-[#8b5cf6] shadow-[0_0_8px_rgba(139,92,246,0.5)]' : 'bg-[#3f3f46]'
                    }`}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
