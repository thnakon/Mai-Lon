"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon, Globe, ArrowRight, LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { useLanguage } from "@/components/providers/language-provider";
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
  { href: "#pricing", labelTh: "ราคา", labelEn: "Pricing" },
  { href: "#faq", labelTh: "คำถาม", labelEn: "FAQ" },
  { href: "#community", labelTh: "ชุมชน", labelEn: "Community" },
];

export function LandingNavbar() {
  const { language, setLanguage } = useLanguage();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    setMounted(true);
    
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setIsLoggedIn(!!user);
    };
    
    checkUser();
  }, [supabase.auth]);

  const ThemeIcon = theme === "dark" ? Moon : Sun;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/60 backdrop-blur-xl border-b border-border/40 font-line-seed">
      <div className="max-w-5xl mx-auto px-6 sm:px-10">
        <div className="flex items-center justify-between h-16">
          {/* Left: Logo & Nav Links */}
          <div className="flex items-center gap-12">
            {/* Logo */}
            <button 
              onClick={() => {
                const hero = document.getElementById('hero');
                if (hero) hero.scrollIntoView({ behavior: 'smooth' });
                else window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-3 group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-full overflow-hidden shadow-lg transition-transform duration-300 group-hover:scale-105 border-2 border-white/20">
                <Image 
                  src="/logo.png" 
                  alt="Mai Lon Logo" 
                  width={40} 
                  height={40}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="font-bold text-xl text-foreground tracking-tight">Mai Lon</span>
            </button>

            {/* Nav Links - Hidden on Mobile */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => {
                    const el = document.querySelector(link.href);
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  {language === "th" ? link.labelTh : link.labelEn}
                </button>
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
                    onClick={() => setLanguage(lang.code as "th" | "en")}
                    className={`rounded-xl px-3 py-2 text-sm font-medium transition-colors cursor-pointer ${language === lang.code ? "bg-primary/10 text-primary" : "hover:bg-muted"}`}
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

            {/* Sign In / Dashboard Button */}
            <Button asChild className="group bg-primary hover:bg-primary/90 text-white px-5 h-10 rounded-full font-semibold shadow-lg transition-all duration-300 active:scale-[0.98]">
              <Link href={isLoggedIn ? "/dashboard" : "/login"}>
                {isLoggedIn ? (
                  <>
                    <LayoutGrid className="mr-2 h-4 w-4" />
                    {language === "th" ? "แดชบอร์ด" : "Dashboard"}
                  </>
                ) : (
                  <>
                    {language === "th" ? "เริ่มเลย" : "Sign In"}
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}

