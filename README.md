# SirojbekTyping ⚡
### Professional Typing Speed Test & Learning Platform

**SirojbekTyping** is a modern, full-stack typing speed test and touch typing education platform engineered for high-performance typists, software engineers, and learners. Built with Next.js App Router, TypeScript, Tailwind CSS, Prisma ORM, and a native Web Audio API synthesizer.

---

## 🚀 Key Features

### 1. Advanced Typing Engine
- **Precise Keystroke Calculation**: Real-time evaluation of every keystroke, tracking correct, incorrect, and missed characters.
- **Accurate Mathematical Formulations**:
  $$\text{Net WPM} = \frac{\text{Correct Characters} / 5}{\text{Time in Minutes}}$$
  $$\text{Raw WPM} = \frac{\text{Total Characters Typed} / 5}{\text{Time in Minutes}}$$
  $$\text{Accuracy} = \frac{\text{Correct Keystrokes}}{\text{Total Keystrokes}} \times 100$$
  $$\text{Consistency} = 100 - \left(\frac{\sigma}{\mu}\right) \times 100$$
- **Multiple Test Modes**:
  - **Time Modes**: 15s, 30s, 60s, 120s
  - **Word Count**: 10, 25, 50, 100 words
  - **Quotes**: Famous inspiration and software engineering quotes
  - **Zen Mode**: Unhurried free-flow typing without timer stress
  - **Punctuation & Numbers**: Toggleable special character modifiers
  - **Custom Text**: Practice any article or excerpt
- **Anti-Cheat Validation**: Server-side mathematical consistency verification, biological speed boundary enforcement ($>250\text{ WPM}$ detection), and keystroke ratio validation.

### 2. Comprehensive Touch Typing Education
- **12 Progressive Lessons**:
  1. Introduction to Touch Typing (`F`, `J`, Space)
  2. Home Row Extension (`D`, `K`)
  3. Left Hand Home Row (`A`, `S`)
  4. Right Hand Home Row (`L`, `;`)
  5. Upper Row Keys (`E`, `R`, `U`, `I`)
  6. Upper Row Complete (`Q`, `W`, `T`, `Y`, `O`, `P`)
  7. Bottom Row Keys (`Z`, `X`, `C`, `V`, `B`, `N`, `M`)
  8. Capital Letters & Dual Shift Keys
  9. Number Row Navigation (`1`-`0`)
  10. Punctuation & Complex Symbols
  11. Rhythm & Flow Cadence
  12. Professional Speed Benchmark
- **Interactive Visual Keyboard Guide**: Color-coded finger assignments (Left/Right Pinky, Ring, Middle, Index, Thumbs) with live key illumination.

### 3. Adaptive Practice Center
- **Weak-Key Drill**: Automatically identifies your most frequently mistyped keys from past tests and generates targeted training exercises.
- **Multi-Language Word Banks**:
  - English Top 1,000 Common Words
  - Uzbek Latin Vocabulary & Proverbs (*O'zbekcha so'zlar va maqollar*)
  - Russian Vocabulary (*Русские слова и предложения*)
- **Developer Code Syntax**: Practice genuine JavaScript/TypeScript, Python, and Rust code snippets.

### 4. Original Arcade Typing Games
- **Word Rush**: Words cascade down the display; type them before they cross the red critical boundary. Features combo streak multipliers and 3-life survival.
- **Space Typist**: Defend your starship from incoming cosmic debris and hostile meteors. Typing targeted words triggers dual plasma laser beams with synthesized sound explosions!

### 5. Detailed Results Dashboard & Analytics
- Second-by-second WPM and Raw WPM progression chart.
- Interactive virtual keyboard mistake heatmap.
- Top 5 mistyped keys breakdown.
- GitHub-style 30-day activity heatmap.
- Result sharing, clipboard copying, and printable card generator.

### 6. Role-Based Administration & Moderation
- Protected `/admin` control dashboard for system administrators.
- Anti-cheat monitoring queue with one-click approval or deletion of flagged scores.
- User management table with instant role promotion (`USER` $\leftrightarrow$ `ADMIN`).

---

## 🎨 Brand & Color Palette

Designed with developer tool aesthetics:
- **Background**: `#101114`
- **Secondary Background**: `#181A20`
- **Elevated Card**: `#1B1E26`
- **Accent (Gold/Amber)**: `#E8B44F`
- **Primary Text**: `#F5F5F5`
- **Secondary Text**: `#969BA7`
- **Success**: `#42C98A`
- **Error**: `#EF6464`
- **Border**: `#272B37`

---

## 🔑 Demo Accounts

For testing authentication and role-based access control out of the box:

| Role | Email | Password | Features |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@sirojbektyping.com` | `admin123` | Full admin privileges, access to `/admin`, anti-cheat moderation, 138 WPM stats |
| **Standard User** | `user@sirojbektyping.com` | `user123` | Regular profile, level 6, progression history, personal records |
| **Guest** | *None required* | *None* | Instant speed tests, local caching, full access to games & lessons |

*(One-click demo login buttons are provided on the Sign In page for immediate testing!)*

---

## 🛠 Technology Stack

- **Framework**: Next.js 14 App Router
- **Language**: TypeScript (Strict Mode)
- **Styling**: Tailwind CSS with custom developer-theme extensions
- **Database & ORM**: Prisma ORM with SQLite (Local zero-config) & PostgreSQL (Docker production ready)
- **Authentication**: NextAuth.js (Auth.js) with bcrypt credential encryption and JWT sessions
- **Charts & Data Visualization**: Recharts ResponsiveContainer
- **State Management**: Zustand with persistent storage
- **Audio Synthesizer**: Native Web Audio API (`AudioContext`) with synthesized Cherry MX click, thud, laser, and explosion audio
- **Testing**: Vitest test suite for typing formulas and anti-cheat validation

---

## ⚙️ Installation & Local Development

### 1. Prerequisites
- Node.js 18+ (tested on Node v20/v24)
- npm or pnpm

### 2. Setup
```bash
# Clone or navigate to the repository
cd sirojbek-typing

# Install dependencies
npm install

# Initialize and seed the database with demo users, 12 lessons, achievements, and leaderboard
npx prisma db push
node prisma/seed.js

# Start the development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Running Tests

The test suite validates Net WPM, Raw WPM, accuracy, consistency, and server-side anti-cheat logic:

```bash
npm run test
```

---

## 🐳 Docker Deployment

To launch the full production environment with PostgreSQL and Next.js containerized:

```bash
docker compose up -d --build
```

The application will be running on `http://localhost:3000` with PostgreSQL connected on port `5432`.

---

## ⌨️ Keyboard Shortcuts

- `Esc` or `Shift + Enter`: Quickly restart current test
- `Tab + Enter`: Instant test reset
- `Ctrl + M`: Toggle synthesized mechanical keyboard sound effects

---

Developed with ❤️ by **Sirojbek**. Designed for pure typing flow.
