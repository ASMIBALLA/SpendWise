# 💸 SpendWise — Gen-Z Personal Finance Tracker

**SpendWise** is a high-energy, personality-driven expense management platform designed for the aesthetic-obsessed and budget-conscious. It transforms the boring task of expense logging into a witty, animated, and interactive experience.

![SpendWise App Screenshot](/api/placeholder/800/400)

## ✨ Core Features

### 🧠 Smart Reactions (The Sass Engine)
Not your average "Transaction Added" toast. SpendWise uses a context-aware reaction engine that gives you witty feedback based on:
- **Category**: Specific roasts or cheers for Food, Shopping, Transport, etc.
- **Amount**: Reacts differently to a ₹50 snack vs. a ₹5,000 "treat yourself" spree.
- **Streaks**: An AI-like escalation system that gets sassier the more you overspend in a row.

### 🛡️ Two-Layer Budgeting System
A bulletproof financial architecture to keep your savings safe:
- **Global Monthly Cap**: Set your ultimate spending goal for the month.
- **Category Allocations**: Assign specific sub-budgets for categories like Food or Entertainment.
- **Strict Validation**: The system prevents over-allocation with real-time warnings and "Safe-Locks" on savings.

### 📊 Aesthetic Analytics
Beautiful, high-refresh-rate charts colored precisely by your expense categories. 
- **Spending by Category**: Pie charts with category-locked persistent colors.
- **Daily & Weekly Trends**: Bar and Line graphs with `oklch` color accuracy (Tailwind 4).
- **Projections**: Smart estimates of your month-end total based on current daily averages.

### 🔐 Secure & Persistent Auth
- **JWT-Based Security**: Robust authentication for your financial data.
- **"Keep me signed in"**: 30-day session persistence so you don't have to re-login every morning.
- **Animated Auth UI**: A premium, motion-heavy login/signup flow with glassmorphism effects.

## 🛠️ Tech Stack

- **Framework**: [Next.js 15+](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/) + [Framer Motion](https://www.framer.com/motion/)
- **Database**: [Prisma ORM](https://www.prisma.io/) (SQLite/PostgreSQL)
- **Charts**: [Recharts](https://recharts.org/)
- **Components**: [Radix UI](https://www.radix-ui.com/) + Custom Glassmorphism System
- **Notifications**: [Sonner](https://sonner.stevenly.me/) (Adaptive Witty Toasts)

## 🚀 Getting Started

### 1. Prerequisite
- Node.js 18+
- A PostgreSQL database (or stay on SQLite for local development)

### 2. Installation
```bash
git clone https://github.com/your-repo/spendwise.git
cd spendwise
npm install
```

### 3. Setup Environment Variables
Create a `.env` file in the root directory:
```env
DATABASE_URL="file:./dev.db" # Or your Postgres URL
JWT_SECRET="your_ultra_secret_key"
```

### 4. Database Setup
```bash
npx prisma generate
npx prisma db push
```

### 5. Run it!
```bash
npm run dev
```
The app will be live at `http://localhost:3000`.

## 🎨 UI Philosophy
SpendWise is built for the **"Main Character"** energy. 
- **Bold Gradients**: Vibrant, moving backgrounds that feel alive.
- **Witty Microcopy**: No generic labels; every button and message has personality.
- **Micro-Interactions**: Hover states, spring animations, and physics-based UI elements.

