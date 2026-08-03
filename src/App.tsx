import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { QuickAddModal } from './components/QuickAddModal';
import { AuthModal } from './components/AuthModal';
import { DashboardView } from './components/DashboardView';
import { TodaysPlannerView } from './components/TodaysPlannerView';
import { MonthlyPlannerView } from './components/MonthlyPlannerView';
import { CalendarView } from './components/CalendarView';
import { TasksView } from './components/TasksView';
import { HabitsView } from './components/HabitsView';
import { GoalsView } from './components/GoalsView';
import { PomodoroView } from './components/PomodoroView';
import { AnalyticsView } from './components/AnalyticsView';
import { AchievementsView } from './components/AchievementsView';
import { SettingsView } from './components/SettingsView';
import { AmbientAudioPlayer } from './components/AmbientAudioPlayer';
import { api } from './services/api';
import { Task, Habit, Goal, StickyNote, DailyJournal, AppSettings, Achievement, PomodoroSession, User } from './types';

export function App() {
  const [activeView, setActiveView] = useState<
    'dashboard' | 'todays-planner' | 'monthly-planner' | 'calendar' | 'tasks' | 'habits' | 'goals' | 'pomodoro' | 'analytics' | 'achievements' | 'settings'
  >('dashboard');

  const [searchQuery, setSearchQuery] = useState('');
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [isAmbientPlaying, setIsAmbientPlaying] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<{ suggestion: string; peakHours: string; actionablePlan: string } | null>(null);

  // User Authentication State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  // Core State
  const [tasks, setTasks] = useState<Task[]>([]);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [stickyNotes, setStickyNotes] = useState<StickyNote[]>([]);
  const [journalEntries, setJournalEntries] = useState<DailyJournal[]>([]);
  const [pomodoroSessions, setPomodoroSessions] = useState<PomodoroSession[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [settings, setSettings] = useState<AppSettings>({
    theme: 'dark',
    accentColor: '#abc7ff',
    enableAnimations: true,
    enableSoundEffects: true,
    notificationsEnabled: true,
    dailyReminderTime: '08:00',
    workDuration: 25,
    shortBreakDuration: 5,
    longBreakDuration: 15,
  });

  // Fetch initial data from backend API & check user session
  useEffect(() => {
    loadAppState();
    checkAuthUser();
  }, []);

  const checkAuthUser = async () => {
    try {
      const user = await api.getCurrentUser();
      if (user) setCurrentUser(user);
    } catch (e) {}
  };

  const handleOpenAuth = (mode: 'login' | 'signup' = 'login') => {
    setAuthMode(mode);
    setIsAuthOpen(true);
  };

  const handleLogout = () => {
    api.logoutUser();
    setCurrentUser(null);
  };

  const loadAppState = async () => {
    try {
      const data = await api.getAppState();
      setTasks(data.tasks || []);
      setHabits(data.habits || []);
      setGoals(data.goals || []);
      setStickyNotes(data.stickyNotes || []);
      setJournalEntries(data.journalEntries || []);
      setPomodoroSessions(data.pomodoroSessions || []);
      setAchievements(data.achievements || []);
      if (data.settings) setSettings(data.settings);

      // Fetch AI Productivity suggestion
      const ai = await api.getAiSuggestion({ tasks: data.tasks, habits: data.habits });
      setAiSuggestion(ai);
    } catch (err) {
      console.warn('Failed to load state from API, fallback to default clean state:', err);
    }
  };

  // Sync state back to backend
  const saveAppStateToBackend = async (updatedFields: Record<string, any>) => {
    try {
      const fullState = {
        tasks,
        habits,
        goals,
        stickyNotes,
        journalEntries,
        pomodoroSessions,
        achievements,
        settings,
        ...updatedFields,
      };
      await api.saveAppState(fullState);
    } catch (err) {
      console.warn('Failed to persist state:', err);
    }
  };

  // Task Actions
  const handleToggleTask = (id: string) => {
    const updated = tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t));
    setTasks(updated);
    saveAppStateToBackend({ tasks: updated });
  };

  const handleAddTask = (newTask: Partial<Task>) => {
    const taskObj: Task = {
      id: `task_${Date.now()}`,
      name: newTask.name || 'New Task',
      description: newTask.description || '',
      category: newTask.category || 'Work',
      priority: newTask.priority || 'Medium',
      difficulty: newTask.difficulty || 'Medium',
      completed: false,
      createdAt: new Date().toISOString(),
      dueDate: newTask.dueDate || new Date().toISOString().split('T')[0],
      startTime: newTask.startTime || '09:00',
      endTime: newTask.endTime || '10:00',
      estimatedMinutes: newTask.estimatedMinutes || 60,
      starred: newTask.starred || false,
      pinned: newTask.pinned || false,
      recurring: newTask.recurring || 'None',
      colorTag: newTask.colorTag || '#abc7ff',
      archived: false,
    };

    const updated = [taskObj, ...tasks];
    setTasks(updated);
    saveAppStateToBackend({ tasks: updated });
  };

  const handleDeleteTask = (id: string) => {
    const updated = tasks.filter((t) => t.id !== id);
    setTasks(updated);
    saveAppStateToBackend({ tasks: updated });
  };

  const handleUpdateTask = (partial: Partial<Task>) => {
    const updated = tasks.map((t) => (t.id === partial.id ? { ...t, ...partial } : t));
    setTasks(updated);
    saveAppStateToBackend({ tasks: updated });
  };

  // Habit Actions
  const handleAddHabit = (h: Partial<Habit>) => {
    const habitObj: Habit = {
      id: h.id || `habit_${Date.now()}`,
      title: h.title || 'New Habit',
      category: h.category || 'Health',
      targetCount: h.targetCount || 1,
      unit: h.unit || 'times',
      currentCount: 0,
      colorTag: '#abc7ff',
      streak: 0,
      bestStreak: 0,
      completedDates: [],
      createdAt: new Date().toISOString(),
    };
    const updated = [...habits, habitObj];
    setHabits(updated);
    saveAppStateToBackend({ habits: updated });
  };

  const handleUpdateHabit = (h: Partial<Habit>) => {
    const updated = habits.map((hab) => (hab.id === h.id ? { ...hab, ...h } : hab));
    setHabits(updated);
    saveAppStateToBackend({ habits: updated });
  };

  const handleDeleteHabit = (id: string) => {
    const updated = habits.filter((h) => h.id !== id);
    setHabits(updated);
    saveAppStateToBackend({ habits: updated });
  };

  // Goal Actions
  const handleAddGoal = (g: Partial<Goal>) => {
    const goalObj: Goal = {
      id: g.id || `goal_${Date.now()}`,
      title: g.title || 'New Objective',
      type: g.type || 'Short Term',
      category: g.category || 'Projects',
      deadline: g.deadline || new Date().toISOString().split('T')[0],
      targetPercentage: 100,
      currentPercentage: 0,
      milestones: g.milestones || [],
      colorTag: '#abc7ff',
      createdAt: new Date().toISOString(),
    };
    const updated = [...goals, goalObj];
    setGoals(updated);
    saveAppStateToBackend({ goals: updated });
  };

  const handleUpdateGoal = (g: Partial<Goal>) => {
    const updated = goals.map((goal) => (goal.id === g.id ? { ...goal, ...g } : goal));
    setGoals(updated);
    saveAppStateToBackend({ goals: updated });
  };

  const handleDeleteGoal = (id: string) => {
    const updated = goals.filter((g) => g.id !== id);
    setGoals(updated);
    saveAppStateToBackend({ goals: updated });
  };

  // Notes & Journal
  const handleSaveNotes = (notes: StickyNote[]) => {
    setStickyNotes(notes);
    saveAppStateToBackend({ stickyNotes: notes });
  };

  const handleSaveJournal = (journal: DailyJournal) => {
    const updated = [journal, ...journalEntries];
    setJournalEntries(updated);
    saveAppStateToBackend({ journalEntries: updated });
  };

  // Pomodoro Recorder
  const handleRecordPomodoroSession = (session: { durationMinutes: number; mode: 'work' | 'shortBreak' | 'longBreak' }) => {
    const newSession: PomodoroSession = {
      id: `p_${Date.now()}`,
      completedAt: new Date().toISOString(),
      durationMinutes: session.durationMinutes,
      mode: session.mode,
    };
    const updated = [newSession, ...pomodoroSessions];
    setPomodoroSessions(updated);
    saveAppStateToBackend({ pomodoroSessions: updated });
  };

  // Reset DB
  const handleResetDatabase = async () => {
    setTasks([]);
    setHabits([]);
    setGoals([]);
    setStickyNotes([]);
    setJournalEntries([]);
    setPomodoroSessions([]);
    await saveAppStateToBackend({
      tasks: [],
      habits: [],
      goals: [],
      stickyNotes: [],
      journalEntries: [],
      pomodoroSessions: [],
    });
  };

  const pendingTasksCount = tasks.filter((t) => !t.completed && !t.archived).length;

  return (
    <div className="min-h-screen bg-[#09090b] text-[#fafafa] flex font-sans antialiased selection:bg-[#8b5cf6]/30 pl-[260px]">
      {/* Background Ambient Synthesizer */}
      <AmbientAudioPlayer isPlaying={isAmbientPlaying} />

      {/* Persistent Navigation Sidebar */}
      <Sidebar
        activeView={activeView}
        onSelectView={setActiveView}
        pendingTasksCount={pendingTasksCount}
      />

      {/* Main App Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden pt-[72px]">
        {/* Top Header Bar */}
        <Header
          onOpenQuickAdd={() => setIsQuickAddOpen(true)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          isAmbientPlaying={isAmbientPlaying}
          onToggleAmbient={() => setIsAmbientPlaying(!isAmbientPlaying)}
          currentUser={currentUser}
          onOpenAuth={handleOpenAuth}
          onLogout={handleLogout}
        />

        {/* Dynamic View Canvas Container */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-8 py-8 scrollbar-thin">
          <div className="max-w-7xl mx-auto">
            {activeView === 'dashboard' && (
              <DashboardView
                tasks={tasks}
                habits={habits}
                onToggleTask={handleToggleTask}
                onOpenQuickAdd={() => setIsQuickAddOpen(true)}
                onSelectView={setActiveView}
                aiSuggestion={aiSuggestion}
                stickyNotes={stickyNotes}
                onSaveNotes={handleSaveNotes}
                onSaveJournal={handleSaveJournal}
                currentUser={currentUser}
              />
            )}

            {activeView === 'todays-planner' && (
              <TodaysPlannerView
                tasks={tasks}
                onToggleTask={handleToggleTask}
                onOpenQuickAdd={() => setIsQuickAddOpen(true)}
              />
            )}

            {activeView === 'monthly-planner' && (
              <MonthlyPlannerView
                tasks={tasks}
                onOpenQuickAdd={() => setIsQuickAddOpen(true)}
                onToggleTask={handleToggleTask}
              />
            )}

            {activeView === 'calendar' && (
              <CalendarView
                tasks={tasks}
                onOpenQuickAdd={() => setIsQuickAddOpen(true)}
                onToggleTask={handleToggleTask}
              />
            )}

            {activeView === 'tasks' && (
              <TasksView
                tasks={tasks}
                onToggleTask={handleToggleTask}
                onAddTask={handleAddTask}
                onDeleteTask={handleDeleteTask}
                onUpdateTask={handleUpdateTask}
                onOpenQuickAdd={() => setIsQuickAddOpen(true)}
              />
            )}

            {activeView === 'habits' && (
              <HabitsView
                habits={habits}
                onAddHabit={handleAddHabit}
                onUpdateHabit={handleUpdateHabit}
                onDeleteHabit={handleDeleteHabit}
              />
            )}

            {activeView === 'goals' && (
              <GoalsView
                goals={goals}
                onAddGoal={handleAddGoal}
                onUpdateGoal={handleUpdateGoal}
                onDeleteGoal={handleDeleteGoal}
              />
            )}

            {activeView === 'pomodoro' && (
              <PomodoroView onRecordSession={handleRecordPomodoroSession} />
            )}

            {activeView === 'analytics' && (
              <AnalyticsView
                tasks={tasks}
                habits={habits}
                pomodoroSessions={pomodoroSessions}
              />
            )}

            {activeView === 'achievements' && (
              <AchievementsView achievements={achievements} />
            )}

            {activeView === 'settings' && (
              <SettingsView
                settings={settings}
                onUpdateSettings={(s) => setSettings({ ...settings, ...s })}
                onResetDatabase={handleResetDatabase}
                appStateJSON={JSON.stringify({ tasks, habits, goals, stickyNotes, journalEntries, settings })}
                onImportStateJSON={(json) => {
                  try {
                    const parsed = JSON.parse(json);
                    if (parsed.tasks) setTasks(parsed.tasks);
                    if (parsed.habits) setHabits(parsed.habits);
                    if (parsed.goals) setGoals(parsed.goals);
                  } catch (e) {}
                }}
                currentUser={currentUser}
                onOpenAuth={handleOpenAuth}
                onLogout={handleLogout}
              />
            )}
          </div>
        </main>
      </div>

      {/* Global Quick Add Task Modal */}
      <QuickAddModal
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
        onAddTask={handleAddTask}
      />

      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        initialMode={authMode}
        onSuccess={(user) => {
          setCurrentUser(user);
        }}
      />
    </div>
  );
}

export default App;
