# Mai Lon 🎓

> **Super App for Students** - Manage everything in student life in one place.

![Mai Lon](public/logo.png)

## ✨ Features

### 📚 Academic Zone
- **Schedule Management** - Weekly class schedule with day navigation
- **Exam Countdown** - Never miss an exam with countdown timers and reminders
- **AI Lecture Summary** - Upload audio recordings, get AI-generated transcripts and summaries
- **Citation Generator** - Automatically generate APA, MLA, Chicago citations

### 🤝 Teamwork Zone
- **Kanban Board** - Manage group projects with drag-and-drop task management
- **Shared Files** - Upload and share files with teammates via Supabase Storage
- **AI Agent** - Get answers to any questions with AI assistance

### 💰 Lifestyle Zone
- **Wallet** - Track expenses, set budgets, view spending analytics
- **Subscriptions** - Manage recurring payments with renewal reminders
- **Split Party** - Split bills with friends, track who owes what
- **Privileges** - Discover student discounts and save them

### 🎮 Gamification
- **XP & Levels** - Earn XP for activities, level up your profile
- **Streak System** - Maintain daily streaks for bonus rewards
- **Achievements** - Unlock badges for milestones

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- pnpm (recommended) or npm

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/mai-lon.git
cd mai-lon

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your Supabase credentials

# Run development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

### Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Database**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage
- **Authentication**: Supabase Auth
- **Icons**: Lucide React
- **Fonts**: LINE Seed Sans TH

## 📁 Project Structure

```
src/
├── app/
│   ├── (app)/           # Protected app routes
│   │   ├── dashboard/   # Main dashboard
│   │   ├── schedule/    # Class schedule & exams
│   │   ├── wallet/      # Expense tracking
│   │   ├── projects/    # Kanban board
│   │   └── ...          # Other features
│   ├── (auth)/          # Auth routes (login, register)
│   └── (landing)/       # Public landing page
├── components/
│   ├── layout/          # Layout components
│   ├── providers/       # Context providers
│   └── ui/              # UI components
└── lib/                 # Utilities & configs
```

## 🌐 Localization

Mai Lon supports:
- 🇹🇭 Thai (ไทย)
- 🇺🇸 English

Switch languages using the globe icon in the navigation.

## 🌙 Theme Support

- Light Mode ☀️
- Dark Mode 🌙

Toggle themes using the sun/moon icon in the navigation.

## 📱 Features Overview

| Feature | Description |
|---------|-------------|
| Dashboard | Overview of tasks, expenses, exams, and subscriptions |
| Schedule | Weekly class schedule with exam countdown |
| Lecture Notes | AI-powered lecture transcription and summarization |
| Citation | Generate citations in APA, MLA, Chicago formats |
| Projects | Kanban board for task management |
| Shared Files | Cloud file storage with sharing |
| Wallet | Expense tracking with budget management |
| Subscriptions | Manage recurring payments |
| Split Party | Split bills with friends |
| Privileges | Student discounts catalog |
| AI Agent | AI-powered assistant |
| Achievements | Gamification with XP and badges |

## 🧪 Demo Data

To explore the app with sample data:

1. Go to `/seed` in the app
2. Click "Seed Data" to populate with demo content
3. Explore all features with realistic data

## 📄 License

MIT License - See [LICENSE](LICENSE) for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Supabase](https://supabase.com/)
- [Lucide Icons](https://lucide.dev/)

---

Made with ❤️ for students everywhere.
