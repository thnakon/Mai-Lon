# Mai-Lon (ไม่หลอน) - Development Roadmap

> 🎯 Vision: Super App ช่วยนักศึกษา "ไม่หลอน" กับการเรียน การสอบ และการใช้ชีวิต

## 🎨 Design System: Warm Minimalist

### Colors
| Token | Light Mode | Dark Mode | Usage |
|-------|------------|-----------|-------|
| Background | `#FBFAF9` | `#121212` | Base background |
| Primary | `#EA580C` | `#EA580C` | Action buttons, links |
| Secondary | `#FDBA74` | `#FDBA74` | Highlights, badges |
| Text | `#3E3E3E` | `#E5E5E5` | Body text |

### Typography
```css
font-family: -apple-system, BlinkMacSystemFont, "San Francisco", "Segoe UI", Roboto, sans-serif;
```

### Icons
- Library: **Lucide React**  
- Style: `strokeWidth: 1.5` (rounded)

---

## 🛠 Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + Shadcn/ui |
| Theme | next-themes |
| i18n | next-intl (TH/EN) |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| AI | Vercel AI SDK |
| Deploy | Vercel |

---

## 📱 Feature Zones

### Zone A: 📚 Academic Genius (เรียนไม่ให้หลอน)
- [ ] AI Lecture Note (Audio → Text → Summary)
- [ ] Easy Citation (APA/MLA/IEEE generator)
- [ ] Smart Schedule (Card View + Countdown)

### Zone B: 🤝 Teamwork Savior (งานกลุ่มไม่หลอน)
- [ ] Minimal Kanban (Todo/Doing/Done)
- [ ] Auto-Nudge (แจ้งเตือนเพื่อนร่วมทีม)
- [ ] File Drop (พื้นที่แชร์ไฟล์)

### Zone C: 💰 Survival Kit (ใช้ชีวิตไม่หลอน)
- [ ] Cozy Wallet (รายรับรายจ่าย)
- [ ] Privilege Hub (ส่วนลดนักศึกษา)

### Zone D: 🚀 Career Launchpad (อนาคตไม่หลอน)
- [ ] Resume Magic (Minimalist templates)
- [ ] Job Match (AI recommend)

---

## 🚀 Development Phases

```
Phase 1: Project Setup (1 day)
    └→ Next.js + Tailwind + Shadcn/ui

Phase 2: Core Layout (2 days)
    └→ Layout, Navigation, Theme, i18n

Phase 3-6: Features (10 days)
    └→ Zone A (3d) → Zone B (3d) → Zone C (2d) → Zone D (2d)

Phase 7: Integration (2 days)
    └→ Supabase + AI + Deploy
```

---

## 🔮 Future: Line OA Integration
- Line LIFF for in-app features
- Webhook notifications
- Rich Menu navigation

---

## Quick Start

```bash
# Initialize project
npx -y create-next-app@latest ./ --typescript --tailwind --eslint --app --src-dir

# Install dependencies
npm install next-themes next-intl lucide-react @supabase/supabase-js

# Install Shadcn/ui
npx --yes shadcn@latest init

# Run dev server
npm run dev
```

---

> 📝 Last Updated: 2026-01-14
