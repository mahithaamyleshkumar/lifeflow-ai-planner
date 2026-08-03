import { Task, Habit, Goal, PomodoroSession, StickyNote, DailyJournal, AppSettings, Achievement, User } from '../types';

export async function signupUser(data: { name: string; email: string; password: string }): Promise<{ user: User; token: string }> {
  const res = await fetch('/api/auth/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to sign up');
  localStorage.setItem('lifeflow_auth_token', json.token);
  localStorage.setItem('lifeflow_user', JSON.stringify(json.user));
  return json;
}

export async function loginUser(data: { email: string; password: string }): Promise<{ user: User; token: string }> {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to log in');
  localStorage.setItem('lifeflow_auth_token', json.token);
  localStorage.setItem('lifeflow_user', JSON.stringify(json.user));
  return json;
}

export async function getCurrentUser(): Promise<User | null> {
  const token = localStorage.getItem('lifeflow_auth_token');
  if (!token) {
    const cachedUser = localStorage.getItem('lifeflow_user');
    return cachedUser ? JSON.parse(cachedUser) : null;
  }
  try {
    const res = await fetch('/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) {
      const json = await res.json();
      localStorage.setItem('lifeflow_user', JSON.stringify(json.user));
      return json.user;
    }
  } catch (err) {
    console.warn('Failed to verify token:', err);
  }
  const cachedUser = localStorage.getItem('lifeflow_user');
  return cachedUser ? JSON.parse(cachedUser) : null;
}

export function logoutUser() {
  localStorage.removeItem('lifeflow_auth_token');
  localStorage.removeItem('lifeflow_user');
}

export async function fetchAppState() {
  try {
    const res = await fetch('/api/state');
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn('API fetch failed:', err);
  }
  return null;
}

export async function saveAppState(fullState: any) {
  try {
    const res = await fetch('/api/state', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(fullState)
    });
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn('API save state failed:', err);
  }
  return null;
}

export async function saveTask(task: Partial<Task>): Promise<Task> {
  const isUpdate = !!task.id;
  const url = isUpdate ? `/api/tasks/${task.id}` : '/api/tasks';
  const method = isUpdate ? 'PUT' : 'POST';
  
  const res = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task)
  });
  return await res.json();
}

export async function deleteTask(id: string): Promise<void> {
  await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
}

export async function saveHabit(habit: Partial<Habit>): Promise<Habit> {
  const isUpdate = !!habit.id;
  const url = isUpdate ? `/api/habits/${habit.id}` : '/api/habits';
  const method = isUpdate ? 'PUT' : 'POST';

  const res = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(habit)
  });
  return await res.json();
}

export async function deleteHabit(id: string): Promise<void> {
  await fetch(`/api/habits/${id}`, { method: 'DELETE' });
}

export async function saveGoal(goal: Partial<Goal>): Promise<Goal> {
  const isUpdate = !!goal.id;
  const url = isUpdate ? `/api/goals/${goal.id}` : '/api/goals';
  const method = isUpdate ? 'PUT' : 'POST';

  const res = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(goal)
  });
  return await res.json();
}

export async function deleteGoal(id: string): Promise<void> {
  await fetch(`/api/goals/${id}`, { method: 'DELETE' });
}

export async function recordPomodoro(session: Partial<PomodoroSession>): Promise<PomodoroSession> {
  const res = await fetch('/api/pomodoro', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(session)
  });
  return await res.json();
}

export async function updateSettings(settings: Partial<AppSettings>): Promise<AppSettings> {
  const res = await fetch('/api/settings', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(settings)
  });
  return await res.json();
}

export async function resetDatabase(): Promise<void> {
  await fetch('/api/reset-db', { method: 'POST' });
}

export async function getAISuggestions(data: { tasks: Task[]; habits: Habit[] }) {
  try {
    const res = await fetch('/api/ai/suggest', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (res.ok) return await res.json();
  } catch (err) {
    console.error('AI suggestion error:', err);
  }
  return {
    suggestion: 'Group your highest cognitive focus tasks during peak morning hours.',
    peakHours: '9:00 AM - 11:30 AM',
    actionablePlan: 'Start a 25-minute Pomodoro session for your top task.'
  };
}

export const api = {
  signupUser,
  loginUser,
  getCurrentUser,
  logoutUser,
  getAppState: fetchAppState,
  saveAppState,
  saveTask,
  deleteTask,
  saveHabit,
  deleteHabit,
  saveGoal,
  deleteGoal,
  recordPomodoro,
  updateSettings,
  resetDatabase,
  getAiSuggestion: getAISuggestions
};
