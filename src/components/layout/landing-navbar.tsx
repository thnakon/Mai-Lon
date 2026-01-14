"use client";

import Link from "next/link";
import { useState } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon, Monitor, Globe, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const languages = [
  { code: "th", label: "ไทย", flag: "🇹🇭" },
  { code: "en", label: "English", flag: "🇺🇸" },
];

const themes = [
  { value: "light", label: "สว่าง", labelEn: "Light", icon: Sun },
  { value: "dark", label: "มืด", labelEn: "Dark", icon: Moon },
  { value: "system", label: "ระบบ", labelEn: "System", icon: Monitor },
];

export function LandingNavbar() {
  const [currentLang, setCurrentLang] = useState<"th" | "en">("th");
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useState(() => {
    setMounted(true);
  });

  const currentLanguage = languages.find((l) => l.code === currentLang);
  const currentTheme = themes.find((t) => t.value === theme) || themes[2];
  const ThemeIcon = currentTheme.icon;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <span className="text-xl">🧘</span>
            </div>
            <div>
              <span className="font-bold text-lg text-foreground">Mai Lon</span>
              <span className="hidden sm:inline text-xs text-muted-foreground ml-2">ไม่หลอน</span>
            </div>
          </Link>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2">
            {/* Language Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-1.5 px-3">
                  <Globe className="h-4 w-4" />
                  <span className="hidden sm:inline">{currentLanguage?.flag}</span>
                  <ChevronDown className="h-3 w-3 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-36">
                {languages.map((lang) => (
                  <DropdownMenuItem
                    key={lang.code}
                    onClick={() => setCurrentLang(lang.code as "th" | "en")}
                    className={currentLang === lang.code ? "bg-accent" : ""}
                  >
                    <span className="mr-2">{lang.flag}</span>
                    {lang.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Theme Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-1.5 px-3">
                  {mounted ? (
                    <ThemeIcon className="h-4 w-4" />
                  ) : (
                    <Sun className="h-4 w-4" />
                  )}
                  <ChevronDown className="h-3 w-3 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-36">
                {themes.map((t) => (
                  <DropdownMenuItem
                    key={t.value}
                    onClick={() => setTheme(t.value)}
                    className={theme === t.value ? "bg-accent" : ""}
                  >
                    <t.icon className="mr-2 h-4 w-4" />
                    {currentLang === "th" ? t.label : t.labelEn}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Sign In Button */}
            <Link href="/login">
              <Button className="bg-primary hover:bg-primary/90 text-white px-4 sm:px-6">
                {currentLang === "th" ? "เริ่มเลย" : "Get Started"}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
