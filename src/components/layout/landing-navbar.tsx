"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon, Globe, ArrowRight } from "lucide-react";
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

const navLinks = [
  { href: "#features", labelTh: "ฟีเจอร์", labelEn: "Features" },
  { href: "#zones", labelTh: "โซนต่างๆ", labelEn: "Zones" },
  { href: "#about", labelTh: "เกี่ยวกับ", labelEn: "About" },
  { href: "#help", labelTh: "ช่วยเหลือ", labelEn: "Help" },
];

export function LandingNavbar() {
  const [currentLang, setCurrentLang] = useState<"th" | "en">("th");
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const ThemeIcon = theme === "dark" ? Moon : Sun;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/60 backdrop-blur-xl border-b border-border/40 font-sans">
      <div className="max-w-7xl mx-auto px-6 sm:px-10">
        <div className="flex items-center justify-between h-20">
          {/* Left: Logo & Nav Links */}
          <div className="flex items-center gap-12">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-105 overflow-hidden border-2 border-white/20">
                <span className="text-xl">🧘</span>
              </div>
              <span className="font-bold text-xl text-foreground tracking-tight">Mai Lon</span>
            </Link>

            {/* Nav Links - Hidden on Mobile */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  {currentLang === "th" ? link.labelTh : link.labelEn}
                </Link>
              ))}
            </div>
          </div>

          {/* Right side: Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Language */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full hover:bg-muted font-medium transition-colors">
                  <Globe className="h-[18px] w-[18px] text-muted-foreground" />
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

            {/* Theme Toggle icon only like Vexly */}
            {mounted && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-10 w-10 rounded-full hover:bg-muted font-medium transition-colors"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              >
                <ThemeIcon className="h-[18px] w-[18px] text-muted-foreground" />
              </Button>
            )}

            {/* Sign In Button - Pill shape like Vexly - Sleeker version */}
            <Link href="/login">
              <Button className="group bg-primary hover:bg-primary/90 text-white px-5 h-10 rounded-full font-semibold shadow-lg transition-all duration-300 active:scale-[0.98]">
                {currentLang === "th" ? "เริ่มเลย" : "Sign In"}
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
