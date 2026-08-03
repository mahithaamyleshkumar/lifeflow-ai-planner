import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Sparkles, Timer, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface PomodoroViewProps {
  onRecordSession: (session: { durationMinutes: number; mode: 'work' | 'shortBreak' | 'longBreak' }) => void;
}

export const PomodoroView: React.FC<PomodoroViewProps> = ({ onRecordSession }) => {
  const [mode, setMode] = useState<'work' | 'shortBreak' | 'longBreak'>('work');
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [completedSessions, setCompletedSessions] = useState(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const MODE_MINUTES = {
    work: 25,
    shortBreak: 5,
    longBreak: 15,
  };

  const setTimerMode = (newMode: 'work' | 'shortBreak' | 'longBreak') => {
    setIsRunning(false);
    if (timerRef.current) clearInterval(timerRef.current);
    setMode(newMode);
    setTimeLeft(MODE_MINUTES[newMode] * 60);
  };

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setIsRunning(false);

            // Web Audio API Synthesizer Chime
            try {
              const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
              const osc = audioCtx.createOscillator();
              const gain = audioCtx.createGain();
              osc.type = 'sine';
              osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
              gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
              gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 1.5);
              osc.connect(gain);
              gain.connect(audioCtx.destination);
              osc.start();
              osc.stop(audioCtx.currentTime + 1.5);
            } catch (err) {
              console.warn('Audio chime unsupported:', err);
            }

            confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });

            if (mode === 'work') {
              setCompletedSessions((c) => c + 1);
              onRecordSession({ durationMinutes: 25, mode: 'work' });
            }

            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, mode]);

  const toggleStart = () => setIsRunning(!isRunning);

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(MODE_MINUTES[mode] * 60);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const totalSecs = MODE_MINUTES[mode] * 60;
  const progressPct = ((totalSecs - timeLeft) / totalSecs) * 100;

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-6 border-b border-white/10 gap-4">
        <div>
          <span className="text-xs font-bold text-[#c084fc] uppercase tracking-widest block mb-1">Deep Work Synthesizer</span>
          <h1 className="text-3xl font-extrabold text-[#fafafa]">Pomodoro Focus Timer</h1>
        </div>

        <div className="flex items-center gap-2 bg-[#18181b] px-4 py-2 rounded-full border border-white/10 text-xs font-bold text-[#c084fc]">
          <Sparkles className="w-4 h-4 text-[#8b5cf6]" />
          <span>{completedSessions} Sessions Completed Today</span>
        </div>
      </div>

      {/* Main Timer Display Card */}
      <div className="max-w-xl mx-auto bg-[#18181b] rounded-3xl p-8 border border-white/10 shadow-2xl text-center space-y-8 relative overflow-hidden">
        {/* Mode Selector */}
        <div className="flex justify-center gap-2 bg-[#09090b] p-1.5 rounded-full border border-white/10 max-w-md mx-auto">
          {(['work', 'shortBreak', 'longBreak'] as const).map((m) => {
            const labels = { work: '25m Focus', shortBreak: '5m Break', longBreak: '15m Rest' };
            const active = mode === m;
            return (
              <button
                key={m}
                onClick={() => setTimerMode(m)}
                className={`flex-1 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  active
                    ? 'bg-[#8b5cf6] text-white shadow-lg shadow-[#8b5cf6]/20'
                    : 'text-[#a1a1aa] hover:text-[#fafafa]'
                }`}
              >
                {labels[m]}
              </button>
            );
          })}
        </div>

        {/* Circular Animated Ring */}
        <div className="relative w-64 h-64 mx-auto flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90">
            <circle cx="128" cy="128" r="110" fill="transparent" stroke="#27272a" strokeWidth="12" />
            <circle
              cx="128"
              cy="128"
              r="110"
              fill="transparent"
              stroke="#8b5cf6"
              strokeWidth="12"
              strokeDasharray="691"
              strokeDashoffset={691 - (691 * progressPct) / 100}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-linear drop-shadow-[0_0_12px_rgba(139,92,246,0.4)]"
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-5xl font-mono font-extrabold text-[#fafafa] tracking-tight">{timeFormatted}</span>
            <span className="text-xs text-[#c084fc] font-bold uppercase tracking-widest mt-2">
              {mode === 'work' ? 'Focus Interval' : 'Rest Break'}
            </span>
          </div>
        </div>

        {/* Timer Control Buttons */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={resetTimer}
            className="p-3 rounded-full bg-[#27272a] text-[#a1a1aa] hover:text-[#fafafa] border border-white/10 transition-all hover:scale-105 cursor-pointer"
            title="Reset Timer"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          <button
            onClick={toggleStart}
            className="px-10 py-4 rounded-full bg-[#8b5cf6] text-white text-base font-extrabold hover:bg-[#7c3aed] shadow-2xl shadow-[#8b5cf6]/30 transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
          >
            {isRunning ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
            <span>{isRunning ? 'Pause' : 'Start Focus'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
