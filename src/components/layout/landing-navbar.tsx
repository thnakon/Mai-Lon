"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon, Monitor, Globe, ArrowRight } from "lucide-react";
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

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentLanguage = languages.find((l) => l.code === currentLang);
  const currentTheme = themes.find((t) => t.value === theme) || themes[2];
  const ThemeIcon = currentTheme.icon;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/70 backdrop-blur-xl border-b border-border/50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform duration-300">
              <span className="text-xl sm:text-2xl">🧘</span>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg sm:text-xl text-foreground tracking-tight">Mai Lon</span>
              <span className="text-[10px] sm:text-xs text-muted-foreground font-medium -mt-1 uppercase tracking-widest pl-0.5">ไม่หลอน</span>
            </div>
          </Link>

          {/* Right Side Actions */}
          <div className="flex items-center gap-1 sm:gap-3">
            {/* Language Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full hover:bg-muted font-medium transition-colors">
                  <Globe className="h-[18px] w-[18px]" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40 p-2 rounded-2xl border-border/50 shadow-2xl backdrop-blur-lg">
                {languages.map((lang) => (
                  <DropdownMenuItem
                    key={lang.code}
                    onClick={() => setCurrentLang(lang.code as "th" | "en")}
                    className={`rounded-xl px-3 py-2 text-sm font-medium transition-colors cursor-pointer ${currentLang === lang.code ? "bg-primary/10 text-primary" : "hover:bg-muted"}`}
                  >
                    <span className="mr-2 text-base">{lang.flag}</span>
                    {lang.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Theme Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full hover:bg-muted font-medium transition-colors">
                  {mounted ? (
                    <ThemeIcon className="h-[18px] w-[18px]" />
                  ) : (
                    <Sun className="h-[18px] w-[18px]" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40 p-2 rounded-2xl border-border/50 shadow-2xl backdrop-blur-lg">
                {themes.map((t) => (
                  <DropdownMenuItem
                    key={t.value}
                    onClick={() => setTheme(t.value)}
                    className={`rounded-xl px-3 py-2 text-sm font-medium transition-colors cursor-pointer ${theme === t.value ? "bg-primary/10 text-primary" : "hover:bg-muted"}`}
                  >
                    <t.icon className="mr-2 h-4 w-4" />
                    {currentLang === "th" ? t.label : t.labelEn}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="w-[1px] h-6 bg-border/50 mx-1 hidden xs:block" />

            {/* Sign In Button */}
            <Link href="/login" className="ml-1 sm:ml-2">
              <Button className="group bg-primary hover:bg-primary/90 text-white px-5 sm:px-7 py-5 sm:py-6 rounded-2xl font-semibold shadow-xl shadow-primary/20 hover:shadow-primary/30 active:scale-[0.98] transition-all duration-300">
                {currentLang === "th" ? "เริ่มเลย" : "Get Started"}
                <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

