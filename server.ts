import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import JSZip from "jszip";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

const DB_FILE = path.join(process.cwd(), "database.db");

interface DatabaseSchema {
  users?: any[];
  tasks: any[];
  habits: any[];
  goals: any[];
  pomodoroSessions: any[];
  notes: any[];
  journals: any[];
  settings: any;
  achievements: any[];
}

const defaultDatabase: DatabaseSchema = {
  users: [],
  tasks: [],
  habits: [],
  goals: [],
  pomodoroSessions: [],
  notes: [],
  journals: [],
  settings: {
    theme: "dark",
    accentColor: "#abc7ff",
    animationsEnabled: true,
    notificationsEnabled: true,
    wallpaper: "aurora",
    soundEffects: true,
  },
  achievements: [
    { id: "1", code: "first_task", title: "First Step", description: "Complete your first task", icon: "task_alt", category: "Tasks", unlocked: false, progress: 0, maxProgress: 1 },
    { id: "2", code: "10_tasks", title: "Task Crusher", description: "Complete 10 tasks", icon: "done_all", category: "Tasks", unlocked: false, progress: 0, maxProgress: 10 },
    { id: "3", code: "100_tasks", title: "Productivity Master", description: "Complete 100 tasks", icon: "workspace_premium", category: "Tasks", unlocked: false, progress: 0, maxProgress: 100 },
    { id: "4", code: "7_streak", title: "Week Warrior", description: "Maintain a 7-day habit streak", icon: "local_fire_department", category: "Streaks", unlocked: false, progress: 0, maxProgress: 7 },
    { id: "5", code: "30_streak", title: "Consistency Titan", description: "Maintain a 30-day habit streak", icon: "bolt", category: "Streaks", unlocked: false, progress: 0, maxProgress: 30 },
    { id: "6", code: "early_bird", title: "Early Bird", description: "Complete a task before 8:00 AM", icon: "wb_sunny", category: "Mastery", unlocked: false, progress: 0, maxProgress: 1 },
    { id: "7", code: "night_owl", title: "Night Owl", description: "Complete a task after 10:00 PM", icon: "bedtime", category: "Mastery", unlocked: false, progress: 0, maxProgress: 1 },
    { id: "8", code: "study_master", title: "Study Master", description: "Log 5 Study or Reading tasks", icon: "menu_book", category: "Focus", unlocked: false, progress: 0, maxProgress: 5 },
    { id: "9", code: "fitness_hero", title: "Fitness Hero", description: "Complete 5 Health or Fitness tasks", icon: "fitness_center", category: "Focus", unlocked: false, progress: 0, maxProgress: 5 },
    { id: "10", code: "legend", title: "Legend of Flow", description: "Reach 50 completed Pomodoro sessions", icon: "emoji_events", category: "Focus", unlocked: false, progress: 0, maxProgress: 50 }
  ]
};

function readDb(): DatabaseSchema {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, "utf-8");
      return JSON.parse(data);
    }
  } catch (err) {
    console.error("Error reading database file:", err);
  }
  return defaultDatabase;
}

function writeDb(data: DatabaseSchema) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing to database.db:", err);
  }
}

if (!fs.existsSync(DB_FILE)) {
  writeDb(defaultDatabase);
}

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// Authentication Endpoints
app.post("/api/auth/signup", (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: "Name, email, and password are required" });
  }

  const db = readDb();
  if (!db.users) db.users = [];

  const existing = db.users.find((u: any) => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(400).json({ error: "An account with this email already exists" });
  }

  const newUser = {
    id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
    name: name.trim(),
    email: email.trim().toLowerCase(),
    password, // Store hashed or plain for simple auth
    createdAt: new Date().toISOString()
  };

  db.users.push(newUser);
  writeDb(db);

  const { password: _, ...userWithoutPassword } = newUser;
  res.status(201).json({
    success: true,
    user: userWithoutPassword,
    token: `token_${newUser.id}`
  });
});

app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  const db = readDb();
  if (!db.users) db.users = [];

  const user = db.users.find((u: any) => u.email.toLowerCase() === email.toLowerCase());
  if (!user || user.password !== password) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  const { password: _, ...userWithoutPassword } = user;
  res.json({
    success: true,
    user: userWithoutPassword,
    token: `token_${user.id}`
  });
});

app.get("/api/auth/me", (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  const token = authHeader.replace("Bearer ", "");
  const userId = token.replace("token_", "");
  const db = readDb();
  const user = (db.users || []).find((u: any) => u.id === userId);

  if (!user) {
    return res.status(401).json({ error: "User session expired or invalid" });
  }

  const { password: _, ...userWithoutPassword } = user;
  res.json({ user: userWithoutPassword });
});

app.get("/api/state", (req, res) => {
  res.json(readDb());
});

app.post("/api/state", (req, res) => {
  const db = readDb();
  const newState = { ...db, ...req.body };
  writeDb(newState);
  res.json({ success: true, state: newState });
});

app.get("/api/tasks", (req, res) => {
  res.json(readDb().tasks);
});

app.post("/api/tasks", (req, res) => {
  const db = readDb();
  const newTask = req.body;
  db.tasks.unshift(newTask);

  const completedCount = db.tasks.filter(t => t.completed).length;
  db.achievements.forEach(ach => {
    if (ach.code === "first_task" && completedCount >= 1) ach.unlocked = true;
    if (ach.code === "10_tasks") {
      ach.progress = Math.min(completedCount, 10);
      if (ach.progress >= 10) ach.unlocked = true;
    }
    if (ach.code === "100_tasks") {
      ach.progress = Math.min(completedCount, 100);
      if (ach.progress >= 100) ach.unlocked = true;
    }
  });

  writeDb(db);
  res.status(201).json(newTask);
});

app.put("/api/tasks/:id", (req, res) => {
  const db = readDb();
  const { id } = req.params;
  const index = db.tasks.findIndex(t => t.id === id);
  if (index !== -1) {
    db.tasks[index] = { ...db.tasks[index], ...req.body };
    const completedTasks = db.tasks.filter(t => t.completed);
    const completedCount = completedTasks.length;
    const nowHour = new Date().getHours();
    
    db.achievements.forEach(ach => {
      if (ach.code === "first_task" && completedCount >= 1) ach.unlocked = true;
      if (ach.code === "10_tasks") {
        ach.progress = Math.min(completedCount, 10);
        if (ach.progress >= 10) ach.unlocked = true;
      }
      if (ach.code === "100_tasks") {
        ach.progress = Math.min(completedCount, 100);
        if (ach.progress >= 100) ach.unlocked = true;
      }
      if (ach.code === "early_bird" && req.body.completed && nowHour < 8) {
        ach.unlocked = true;
        ach.progress = 1;
      }
      if (ach.code === "night_owl" && req.body.completed && nowHour >= 22) {
        ach.unlocked = true;
        ach.progress = 1;
      }
      if (ach.code === "study_master") {
        const studyCount = completedTasks.filter(t => t.category === "Study" || t.category === "Reading").length;
        ach.progress = Math.min(studyCount, 5);
        if (ach.progress >= 5) ach.unlocked = true;
      }
      if (ach.code === "fitness_hero") {
        const fitCount = completedTasks.filter(t => t.category === "Health" || t.category === "Fitness").length;
        ach.progress = Math.min(fitCount, 5);
        if (ach.progress >= 5) ach.unlocked = true;
      }
    });

    writeDb(db);
    res.json(db.tasks[index]);
  } else {
    res.status(404).json({ error: "Task not found" });
  }
});

app.delete("/api/tasks/:id", (req, res) => {
  const db = readDb();
  db.tasks = db.tasks.filter(t => t.id !== req.params.id);
  writeDb(db);
  res.json({ success: true, id: req.params.id });
});

app.get("/api/habits", (req, res) => {
  res.json(readDb().habits);
});

app.post("/api/habits", (req, res) => {
  const db = readDb();
  db.habits.push(req.body);
  writeDb(db);
  res.status(201).json(req.body);
});

app.put("/api/habits/:id", (req, res) => {
  const db = readDb();
  const index = db.habits.findIndex(h => h.id === req.params.id);
  if (index !== -1) {
    db.habits[index] = { ...db.habits[index], ...req.body };
    const maxStreak = Math.max(...db.habits.map(h => h.streak || 0), 0);
    db.achievements.forEach(ach => {
      if (ach.code === "7_streak") {
        ach.progress = Math.min(maxStreak, 7);
        if (ach.progress >= 7) ach.unlocked = true;
      }
      if (ach.code === "30_streak") {
        ach.progress = Math.min(maxStreak, 30);
        if (ach.progress >= 30) ach.unlocked = true;
      }
    });
    writeDb(db);
    res.json(db.habits[index]);
  } else {
    res.status(404).json({ error: "Habit not found" });
  }
});

app.delete("/api/habits/:id", (req, res) => {
  const db = readDb();
  db.habits = db.habits.filter(h => h.id !== req.params.id);
  writeDb(db);
  res.json({ success: true, id: req.params.id });
});

app.get("/api/goals", (req, res) => {
  res.json(readDb().goals);
});

app.post("/api/goals", (req, res) => {
  const db = readDb();
  db.goals.push(req.body);
  writeDb(db);
  res.status(201).json(req.body);
});

app.put("/api/goals/:id", (req, res) => {
  const db = readDb();
  const index = db.goals.findIndex(g => g.id === req.params.id);
  if (index !== -1) {
    db.goals[index] = { ...db.goals[index], ...req.body };
    writeDb(db);
    res.json(db.goals[index]);
  } else {
    res.status(404).json({ error: "Goal not found" });
  }
});

app.delete("/api/goals/:id", (req, res) => {
  const db = readDb();
  db.goals = db.goals.filter(g => g.id !== req.params.id);
  writeDb(db);
  res.json({ success: true, id: req.params.id });
});

app.post("/api/pomodoro", (req, res) => {
  const db = readDb();
  db.pomodoroSessions.push(req.body);
  const workCount = db.pomodoroSessions.filter(s => s.mode === "work").length;
  db.achievements.forEach(ach => {
    if (ach.code === "legend") {
      ach.progress = Math.min(workCount, 50);
      if (ach.progress >= 50) ach.unlocked = true;
    }
  });
  writeDb(db);
  res.status(201).json(req.body);
});

app.post("/api/notes", (req, res) => {
  const db = readDb();
  db.notes = req.body;
  writeDb(db);
  res.json(db.notes);
});

app.post("/api/journals", (req, res) => {
  const db = readDb();
  db.journals.unshift(req.body);
  writeDb(db);
  res.status(201).json(req.body);
});

app.put("/api/settings", (req, res) => {
  const db = readDb();
  db.settings = { ...db.settings, ...req.body };
  writeDb(db);
  res.json(db.settings);
});

app.post("/api/reset-db", (req, res) => {
  writeDb(defaultDatabase);
  res.json({ success: true, message: "Database reset to clean state" });
});

app.post("/api/ai/suggest", async (req, res) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    const { tasks, habits } = req.body;

    if (!apiKey) {
      return res.json({
        suggestion: "Based on focus metrics, morning hours (9:00 AM - 11:30 AM) are optimal for high-priority tasks.",
        peakHours: "9:00 AM - 11:30 AM",
        actionablePlan: "Schedule your highest priority task in the 9:00 AM block tomorrow."
      });
    }

    const ai = new GoogleGenAI({ apiKey });
    const prompt = `You are an elite productivity coach for LifeFlow. Analyze these tasks: ${JSON.stringify(tasks || [])} and habits: ${JSON.stringify(habits || [])}. Return JSON with format: {"suggestion": "...", "peakHours": "...", "actionablePlan": "..."}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt
    });

    const text = response.text || "";
    try {
      const parsed = JSON.parse(text.replace(/```json|```/g, "").trim());
      return res.json(parsed);
    } catch {
      return res.json({
        suggestion: text.slice(0, 180) || "Optimize daily flow by batching small context tasks together.",
        peakHours: "10:00 AM - 12:00 PM",
        actionablePlan: "Take a 15-minute break after 2 hours of focused execution."
      });
    }
  } catch (err: any) {
    res.json({
      suggestion: "Grouping similar tasks increases cognitive focus velocity.",
      peakHours: "9:00 AM - 11:30 AM",
      actionablePlan: "Start a 25-minute Pomodoro session for your top task."
    });
  }
});

app.get("/api/export-zip", async (req, res) => {
  try {
    const zip = new JSZip();
    const projectRoot = process.cwd();

    const addDirToZip = (dirPath: string, zipFolder: JSZip) => {
      const items = fs.readdirSync(dirPath);
      for (const item of items) {
        if (item === "node_modules" || item === ".git" || item === "dist" || item === ".cache") continue;
        const fullPath = path.join(dirPath, item);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
          addDirToZip(fullPath, zipFolder.folder(item)!);
        } else {
          const content = fs.readFileSync(fullPath);
          zipFolder.file(item, content);
        }
      }
    };

    const lifeflowFolder = zip.folder("LifeFlow")!;
    addDirToZip(projectRoot, lifeflowFolder);

    const buffer = await zip.generateAsync({ type: "nodebuffer" });
    res.setHeader("Content-Type", "application/zip");
    res.setHeader("Content-Disposition", 'attachment; filename="LifeFlow-AI-Daily-Planner.zip"');
    res.send(buffer);
  } catch (err: any) {
    res.status(500).json({ error: "Failed to generate ZIP export" });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`LifeFlow Server running on http://localhost:${PORT}`);
  });
}

startServer();
