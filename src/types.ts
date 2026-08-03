export type PriorityLevel = 'Critical' | 'High' | 'Medium' | 'Low';
export type DifficultyLevel = 'Easy' | 'Medium' | 'Hard';

export type TaskCategory = 
  | 'College' 
  | 'Work' 
  | 'Study' 
  | 'Health' 
  | 'Fitness' 
  | 'Finance' 
  | 'Shopping' 
  | 'Travel' 
  | 'Reading' 
  | 'Projects' 
  | 'Coding' 
  | 'Personal' 
  | 'Family' 
  | 'Others';

export interface Task {
  id: string;
  name: string;
  description?: string;
  category: TaskCategory;
  priority: PriorityLevel;
  difficulty: DifficultyLevel;
  estimatedMinutes: number;
  startDate?: string;
  endDate?: string;
  dueDate: string;
  startTime?: string; // HH:mm format e.g. "09:00"
  endTime?: string;   // HH:mm format e.g. "10:30"
  recurring: 'None' | 'Daily' | 'Weekly' | 'Monthly';
  reminder?: boolean;
  location?: string;
  colorTag: string;
  notes?: string;
  attachments?: string[];
  completed: boolean;
  completedAt?: string;
  archived: boolean;
  pinned: boolean;
  starred: boolean;
  createdAt: string;
}

export interface Habit {
  id: string;
  title: string;
  category: TaskCategory;
  description?: string;
  targetCount: number;
  unit: string;
  currentCount: number;
  colorTag: string;
  streak: number;
  bestStreak: number;
  completedDates: string[]; // YYYY-MM-DD
  createdAt: string;
}

export interface Goal {
  id: string;
  title: string;
  type: 'Short Term' | 'Long Term';
  category: TaskCategory;
  deadline: string;
  targetPercentage: number;
  currentPercentage: number;
  milestones: { id: string; title: string; completed: boolean }[];
  colorTag: string;
  createdAt: string;
}

export interface PomodoroSession {
  id: string;
  taskName?: string;
  durationMinutes: number;
  mode: 'work' | 'shortBreak' | 'longBreak';
  completedAt: string;
}

export interface StickyNote {
  id: string;
  content: string;
  color: string;
  updatedAt: string;
}

export interface DailyJournal {
  id: string;
  date: string; // YYYY-MM-DD
  mood: 'great' | 'good' | 'neutral' | 'tired' | 'stressed';
  entry: string;
  energyLevel: number; // 1-10
}

export interface Achievement {
  id: string;
  code: string;
  title: string;
  description: string;
  icon: string;
  category: 'Tasks' | 'Streaks' | 'Focus' | 'Mastery';
  unlocked: boolean;
  unlockedAt?: string;
  progress: number;
  maxProgress: number;
}

export interface AppSettings {
  theme: 'dark' | 'light';
  accentColor: string;
  animationsEnabled: boolean;
  notificationsEnabled: boolean;
  wallpaper: 'gradient' | 'minimal' | 'aurora' | 'cyber';
  soundEffects: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  createdAt: string;
}

export type ViewPath = 
  | 'dashboard'
  | 'todays-planner'
  | 'monthly-planner'
  | 'calendar'
  | 'tasks'
  | 'habits'
  | 'goals'
  | 'pomodoro'
  | 'analytics'
  | 'achievements'
  | 'settings';
