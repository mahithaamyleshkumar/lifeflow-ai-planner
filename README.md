# ⚡ LifeFlow — AI Daily Planner & Productivity Suite

LifeFlow is an all-in-one productivity suite and daily life planner built with **React 19**, **TypeScript**, **Tailwind CSS**, **Express**, and **Google Gemini AI**. It combines time blocking, task execution, habit tracking, goal setting, pomodoro focus timers, analytics, and AI-powered scheduling insights into a high-performance workspace.

---

## ✨ Features

- 👤 **User Authentication**: Built-in Sign In and Sign Up system with dynamic user profiles, secure session handling, and welcome greetings (`Welcome, <Name>!`).
- 📅 **Daily & Monthly Planner**: Time-blocking interface for scheduling days, setting priority focus blocks, and viewing monthly milestone calendars.
- ✅ **Task Management**: Categorize tasks by tags, priority levels (`P1 High`, `P2 Medium`, `P3 Low`), due dates, and status checkboxes with instant completion animations.
- 🔥 **Habit Tracker & Streaks**: Track daily habits, build streaks, and visualize completion stats with interactive daily toggle grids.
- 🎯 **Goal Setting**: Break down long-term goals into actionable milestones and monitor progress towards target completion dates.
- ⏱️ **Focus Pomodoro Timer**: Custom pomodoro focus cycles (25min focus, 5min short break, 15min long break) with ambient audio feedback.
- 📊 **Productivity Analytics**: Visual charts powered by Chart.js tracking weekly completion rates, habit streaks, and focus metrics.
- 🏆 **Achievements & Gamification**: Earn badges and milestone rewards as you complete tasks, maintain habit streaks, and hit goal targets.
- 🤖 **AI Assistant (Google Gemini)**: Analyzes your daily workload, identifies peak productivity hours, and generates actionable daily routines.
- 🎵 **Ambient Audio Player**: Integrated ambient audio generator for deep focus and background concentration.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS, Lucide Icons, Chart.js, Canvas Confetti, Motion / GSAP
- **Backend Server**: Node.js, Express, `esbuild` ESM bundler, `tsx` runner
- **AI Integration**: Google GenAI SDK (`@google/genai`)
- **Build System**: Vite 6, `esbuild`

---

## 📁 Project Structure

```text
lifeflow-ai-planner/
├── src/
│   ├── components/       # UI Components (Dashboard, Planners, AuthModal, Header, etc.)
│   ├── services/         # API Service client & auth functions (api.ts)
│   ├── types.ts          # TypeScript interfaces (User, Task, Habit, Goal, etc.)
│   ├── App.tsx           # Main application state & route orchestration
│   ├── main.tsx          # React entrypoint
│   └── index.css         # Global Tailwind CSS imports & theme rules
├── server.ts             # Express backend server with auth & state storage APIs
├── package.json          # Dependencies, scripts, and build metadata
├── vite.config.ts        # Vite configuration
├── metadata.json         # AI Studio Applet Configuration
└── README.md             # Project documentation
```

---

## 🚀 Local Development Setup

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### Steps

1. **Clone the repository**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/lifeflow-ai-planner.git
   cd lifeflow-ai-planner
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root directory (optional, for Gemini AI features):
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   PORT=3000
   ```

4. **Start the Development Server**:
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:3000` to run the application.

---

## 🐙 How to Push to GitHub

Follow these steps to initialize and push your repository to GitHub:

1. **Initialize Git & Commit Files**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: LifeFlow AI Planner with User Auth & Welcome banner"
   ```

2. **Set Default Branch to Main**:
   ```bash
   git branch -M main
   ```

3. **Link to Your GitHub Repository**:
   Create a new repository on [GitHub](https://github.com/new) named `lifeflow-ai-planner`, then run:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/lifeflow-ai-planner.git
   ```

4. **Push to GitHub**:
   ```bash
   git push -u origin main
   ```

---

## ☁️ How to Deploy on Render

Render provides free Node.js web service hosting. Follow these instructions to deploy LifeFlow:

### Step 1: Create a Web Service on Render
1. Sign in to your Render Dashboard.
2. Click **New +** > **Web Service**.
3. Connect your GitHub account and select your `lifeflow-ai-planner` repository.

### Step 2: Configure Deployment Settings
Fill in the deployment configuration fields on Render:

| Setting | Value |
| :--- | :--- |
| **Name** | `lifeflow-ai-planner` |
| **Environment** | `Node` |
| **Region** | Select your nearest region |
| **Branch** | `main` |
| **Build Command** | `npm run build` |
| **Start Command** | `npm start` |

### Step 3: Add Environment Variables
Under the **Environment Variables** section on Render, add:
- `NODE_ENV` = `production`
- `GEMINI_API_KEY` = *(Your Gemini API key, optional for AI daily advice)*

### Step 4: Deploy
Click **Create Web Service**. Render will automatically pull your repository, run `npm run build`, and execute `npm start` (`node dist/server.js`). Your live application URL will be displayed at the top of the Render dashboard!

---

## ⚙️ Build Scripts Reference

- `npm run dev`: Runs `tsx server.ts` for local development with hot reloads.
- `npm run build`: Bundles the React Vite frontend into `/dist` and compiles `server.ts` into `dist/server.js` via `esbuild`.
- `npm start`: Runs the production ESM bundle `node dist/server.js`.
- `npm run lint`: Validates TypeScript type safety across the project without emitting output (`tsc --noEmit`).

---

## 📄 License

MIT License — feel free to customize and expand LifeFlow for your own personal or organizational productivity needs!
