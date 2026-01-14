# Mai-Lon (ไม่หลอน) - Design Specification

> Warm Minimalist Design System for Student Super App

## 🎨 Color Palette

### Light Mode
```css
--background: #FBFAF9;     /* Warm White - พื้นหลังหลัก */
--foreground: #3E3E3E;     /* Dark Warm Grey - ตัวอักษร */
--primary: #EA580C;        /* Burnt Orange - ปุ่ม Action */
--primary-soft: #FDBA74;   /* Soft Orange - Highlight */
--muted: #F5F4F3;          /* Warm Grey - Background ย่อย */
--border: #E8E6E4;         /* Soft Border */
```

### Dark Mode
```css
--background: #121212;     /* Deep Charcoal */
--foreground: #E5E5E5;     /* Off-white */
--primary: #EA580C;        /* Burnt Orange */
--primary-soft: #FDBA74;   /* Soft Orange */
--muted: #1E1E1E;          /* Dark Grey */
--border: #2E2E2E;         /* Dark Border */
```

---

## 🔤 Typography

### Font Stack
```css
font-family: 
  -apple-system, 
  BlinkMacSystemFont, 
  "San Francisco", 
  "Segoe UI", 
  Roboto, 
  "Helvetica Neue", 
  sans-serif;
```

### Font Sizes (Tailwind)
| Size | Class | Usage |
|------|-------|-------|
| 12px | `text-xs` | Caption, Badge |
| 14px | `text-sm` | Body small |
| 16px | `text-base` | Body default |
| 20px | `text-xl` | Subtitle |
| 24px | `text-2xl` | Title |
| 32px | `text-3xl` | Hero |

---

## 🖼 Iconography

### Library
**Lucide React** - https://lucide.dev

### Style Guidelines
```jsx
import { Home } from 'lucide-react';

<Home 
  size={24} 
  strokeWidth={1.5}  // ลายเส้นบาง
  className="text-primary"
/>
```

### Zone Icons
| Zone | Icon | Color |
|------|------|-------|
| Academic | `GraduationCap` | Primary |
| Teamwork | `Users` | Primary |
| Survival | `Wallet` | Primary |
| Career | `Rocket` | Primary |

---

## 📐 UI Components

### Button Variants
```jsx
// Primary (Burnt Orange)
<Button className="bg-primary text-white hover:bg-primary/90">
  Action
</Button>

// Secondary (Outline)
<Button variant="outline" className="border-primary text-primary">
  Cancel
</Button>

// Ghost
<Button variant="ghost">Menu Item</Button>
```

### Card Style
```jsx
<Card className="rounded-2xl border-border bg-white dark:bg-muted shadow-sm">
  {/* Rounded corners: 16px */}
</Card>
```

### Border Radius
```css
--radius-sm: 8px;   /* Small elements */
--radius-md: 12px;  /* Buttons, inputs */
--radius-lg: 16px;  /* Cards */
--radius-xl: 24px;  /* Modals */
```

---

## 🌗 Theme Toggle

### Implementation
```jsx
import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';

const { theme, setTheme } = useTheme();

<button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
  {theme === 'dark' ? <Sun /> : <Moon />}
</button>
```

---

## 🌐 Language Support

### Supported Locales
- `th` - ภาษาไทย (default)
- `en` - English

### Translation Keys Structure
```json
{
  "common": {
    "home": "หน้าแรก",
    "settings": "ตั้งค่า"
  },
  "zone": {
    "academic": "Academic Genius",
    "teamwork": "Teamwork Savior",
    "survival": "Survival Kit",
    "career": "Career Launchpad"
  }
}
```

---

## 📱 Responsive Breakpoints

| Breakpoint | Width | Device |
|------------|-------|--------|
| `sm` | 640px | Mobile landscape |
| `md` | 768px | Tablet |
| `lg` | 1024px | Laptop |
| `xl` | 1280px | Desktop |

### Mobile-First Approach
```css
/* Base: Mobile */
.nav { display: none; }

/* Desktop: Show sidebar */
@media (min-width: 768px) {
  .nav { display: flex; }
}
```

---

> 📝 Last Updated: 2026-01-14
