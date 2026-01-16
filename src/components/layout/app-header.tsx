"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/providers/language-provider";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useNotifications } from "@/components/providers/notification-provider";
import {
  Search,
  Smartphone,
  Globe,
  Sun,
  Moon,
  Monitor,
  Download,
  Wifi,
  BellOff,
  LayoutGrid,
  Settings,
  LogOut,
  Check,
  ExternalLink,
  Home,
  X,
  Inbox,
} from "lucide-react";

const languages = [
  { code: "th", label: "ไทย", flag: "🇹🇭" },
  { code: "en", label: "English", flag: "🇺🇸" },
];

export function AppHeader() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<{ email?: string; name?: string } | null>(null);
  const [profilePicture, setProfilePicture] = useState<string>("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const supabase = createClient();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  useEffect(() => {
    setMounted(true);
    
    // Get user info
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Multi-account session management for localStorage
        const lastUserId = localStorage.getItem("mailon_user_id");
        if (lastUserId && lastUserId !== user.id) {
          localStorage.removeItem("onboarding_complete");
          localStorage.removeItem("onboarding_data");
          localStorage.removeItem("mailon_settings");
          localStorage.removeItem("mailon_profile_picture");
          localStorage.removeItem("show_celebration");
        }
        localStorage.setItem("mailon_user_id", user.id);

        const onboardingData = localStorage.getItem("onboarding_data");
        const displayName = onboardingData ? JSON.parse(onboardingData).displayName : "";
        setUser({
          email: user.email,
          name: displayName || user.email?.split("@")[0],
        });
      }
    };
    getUser();

    const loadProfilePicture = () => {
      const saved = localStorage.getItem("mailon_profile_picture");
      if (saved) setProfilePicture(saved);
    };
    loadProfilePicture();

    // Listen for storage changes to update profile picture across tabs/components
    window.addEventListener("storage", loadProfilePicture);

    // Keyboard shortcut for search
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      if (e.key === "Escape") {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    // Check for welcome toast
    const shouldShowWelcome = localStorage.getItem("show_welcome_toast");
    if (shouldShowWelcome === "true") {
      localStorage.removeItem("show_welcome_toast");
      const onboardingData = localStorage.getItem("onboarding_data");
      const name = onboardingData ? JSON.parse(onboardingData).displayName : "";
      
      setTimeout(() => {
        toast.success(language === "th" ? `ยินดีต้อนรับกลับมานะ ${name || ""}! 🌈` : `Welcome back, ${name || ""}! 🌈`, {
          description: language === "th" ? "วันนี้เรามาทำชีวิตให้ไม่หลอนกันเถอะ! ✨" : "Let's make today less chaotic together! ✨",
          icon: "👋",
          duration: 5000,
        });
      }, 500);
    }

    return () => {
      window.removeEventListener("storage", loadProfilePicture);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [supabase.auth, language]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    
    // Clear application-specific local storage
    localStorage.removeItem("onboarding_complete");
    localStorage.removeItem("onboarding_data");
    localStorage.removeItem("mailon_settings");
    localStorage.removeItem("mailon_profile_picture");
    localStorage.removeItem("show_celebration");
    localStorage.removeItem("show_welcome_toast");

    router.push("/login");
    router.refresh();
  };

  const handleLanguageChange = (lang: "th" | "en") => {
    setLanguage(lang);
    toast.success(lang === "th" ? "เปลี่ยนภาษาเป็นไทย" : "Language changed to English", {
      description: lang === "th" ? "อินเทอร์เฟซจะแสดงเป็นภาษาไทย" : "Interface will be displayed in English",
    });
  };

  if (!mounted) return null;

  return (
    <header className="h-14 bg-background/80 backdrop-blur-sm sticky top-0 z-30 flex items-center gap-4 px-4 md:px-6">
      {/* Search & Landing Page Link */}
      <div className="flex-1 max-w-md flex items-center gap-2">
        <div className="relative flex-1">
          <button
            className="w-full flex items-center gap-2 h-9 px-3 rounded-lg border border-input bg-muted/50 text-muted-foreground text-sm hover:bg-muted transition-colors"
            onClick={() => setIsSearchOpen(true)}
          >
            <Search className="w-4 h-4" />
            <span className="flex-1 text-left">{language === "th" ? "ค้นหา..." : "Search..."}</span>
            <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-background border border-border text-[10px] font-medium">
              ⌘K
            </kbd>
          </button>
        </div>
        
        {/* Landing Page Link */}
        <Link 
          href="/" 
          className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          title={language === "th" ? "ไปที่หน้าหลัก" : "Go to Landing Page"}
        >
          <Home className="w-4 h-4" />
        </Link>
      </div>

      <div className="flex-1" />

      {/* Right Actions */}
      <div className="flex items-center gap-1">
        {/* PWA Status */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-foreground">
              <Smartphone className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-72 p-4 rounded-2xl">
            <div className="mb-4">
              <h3 className="font-semibold text-foreground">{language === "th" ? "สถานะ PWA" : "PWA Status"}</h3>
              <p className="text-sm text-muted-foreground">{language === "th" ? "ฟีเจอร์และการตั้งค่า Progressive Web App" : "Progressive Web App features and settings"}</p>
            </div>
            
            <div className="space-y-4">
              {/* App Installed */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Download className="w-5 h-5 text-muted-foreground" />
                  <span className="text-sm font-medium">{language === "th" ? "แอปติดตั้งแล้ว" : "App Installed"}</span>
                </div>
                <Button variant="outline" size="sm" className="h-8 rounded-full">
                  {language === "th" ? "ติดตั้ง" : "Install"}
                </Button>
              </div>
              
              {/* Connection */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Wifi className="w-5 h-5 text-muted-foreground" />
                  <span className="text-sm font-medium">{language === "th" ? "การเชื่อมต่อ" : "Connection"}</span>
                </div>
                <span className="px-3 py-1 rounded-full bg-primary text-white text-xs font-medium">
                  {language === "th" ? "ออนไลน์" : "Online"}
                </span>
              </div>
              
              {/* Push Notifications */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <BellOff className="w-5 h-5 text-muted-foreground" />
                  <span className="text-sm font-medium">{language === "th" ? "การแจ้งเตือน Push" : "Push Notifications"}</span>
                </div>
                <button className="w-10 h-5 rounded-full bg-muted relative transition-colors">
                  <span className="absolute left-0.5 top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform" />
                </button>
              </div>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Language Switcher */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-foreground">
              <Globe className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40 p-2 rounded-xl">
            {languages.map((lang) => (
              <DropdownMenuItem
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code as "th" | "en")}
                className={cn(
                  "rounded-lg px-3 py-2 cursor-pointer flex items-center justify-between",
                  language === lang.code && "bg-primary/10 text-primary"
                )}
              >
                <div className="flex items-center gap-2">
                  <span>{lang.flag}</span>
                  <span className="text-sm font-medium">{lang.label}</span>
                </div>
                {language === lang.code && <Check className="w-4 h-4" />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Theme Toggle */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-foreground">
              {theme === "dark" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40 p-2 rounded-xl">
            <DropdownMenuItem
              onClick={() => setTheme("light")}
              className={cn("rounded-lg px-3 py-2 cursor-pointer flex items-center justify-between", theme === "light" && "bg-primary/10 text-primary")}
            >
              <div className="flex items-center gap-2">
                <Sun className="w-4 h-4" />
                <span className="text-sm font-medium">{language === "th" ? "สว่าง" : "Light"}</span>
              </div>
              {theme === "light" && <Check className="w-4 h-4" />}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setTheme("dark")}
              className={cn("rounded-lg px-3 py-2 cursor-pointer flex items-center justify-between", theme === "dark" && "bg-primary/10 text-primary")}
            >
              <div className="flex items-center gap-2">
                <Moon className="w-4 h-4" />
                <span className="text-sm font-medium">{language === "th" ? "มืด" : "Dark"}</span>
              </div>
              {theme === "dark" && <Check className="w-4 h-4" />}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setTheme("system")}
              className={cn("rounded-lg px-3 py-2 cursor-pointer flex items-center justify-between", theme === "system" && "bg-primary/10 text-primary")}
            >
              <div className="flex items-center gap-2">
                <Monitor className="w-4 h-4" />
                <span className="text-sm font-medium">{language === "th" ? "ระบบ" : "System"}</span>
              </div>
              {theme === "system" && <Check className="w-4 h-4" />}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        {/* Inbox */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-foreground relative">
              <Inbox className="h-4 w-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-primary rounded-full flex items-center justify-center text-[10px] text-white font-bold">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 p-0 rounded-2xl overflow-hidden border-border/50 shadow-2xl">
            <div className="p-4 border-b border-border bg-muted/30">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm">{language === "th" ? "กล่องขาเข้า" : "Inbox"}</h3>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-[10px] text-primary hover:underline font-medium"
                  >
                    {language === "th" ? "อ่านทั้งหมด" : "Mark all read"}
                  </button>
                )}
              </div>
            </div>
            <div className="max-h-[300px] overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  <Inbox className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">{language === "th" ? "ไม่มีการแจ้งเตือน" : "No notifications"}</p>
                </div>
              ) : (
                notifications.slice(0, 10).map((item) => {
                  const timeAgo = () => {
                    const diff = Math.floor((Date.now() - new Date(item.createdAt).getTime()) / 1000);
                    if (diff < 60) return language === "th" ? "เมื่อสักครู่" : "just now";
                    if (diff < 3600) return `${Math.floor(diff / 60)}${language === "th" ? " นาทีที่แล้ว" : "m ago"}`;
                    if (diff < 86400) return `${Math.floor(diff / 3600)}${language === "th" ? " ชม.ที่แล้ว" : "h ago"}`;
                    return `${Math.floor(diff / 86400)}${language === "th" ? " วันที่แล้ว" : "d ago"}`;
                  };
                  
                  return (
                    <DropdownMenuItem
                      key={item.id}
                      className="p-4 cursor-pointer hover:bg-muted/50 focus:bg-muted/50 border-b border-border/50 last:border-0"
                      onClick={() => {
                        markAsRead(item.id);
                        if (item.link) router.push(item.link);
                      }}
                    >
                      <div className="flex gap-3 w-full">
                        <div className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                          item.read ? "bg-muted text-muted-foreground" : "bg-primary/10 text-primary"
                        )}>
                          <Inbox className="w-5 h-5" />
                        </div>
                        <div className="flex-1 space-y-1 min-w-0">
                          <p className={cn("text-sm leading-tight truncate", !item.read ? "font-bold" : "font-medium text-muted-foreground")}>
                            {language === "th" ? item.title : item.titleEn}
                          </p>
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {language === "th" ? item.description : item.descriptionEn}
                          </p>
                          <p className="text-[10px] text-muted-foreground">{timeAgo()}</p>
                        </div>
                        {!item.read && <div className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" />}
                      </div>
                    </DropdownMenuItem>
                  );
                })
              )}
            </div>
            {notifications.length > 0 && (
              <div className="p-3 bg-muted/30 text-center border-t border-border/50">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push("/notifications")}
                  className="w-full text-xs font-bold text-primary hover:text-primary hover:bg-primary/5 rounded-xl"
                >
                  {language === "th" ? "ดูการแจ้งเตือนทั้งหมด" : "View all notifications"}
                </Button>
              </div>
            )}
          </DropdownMenuContent>
        </DropdownMenu>


        {/* User Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full overflow-hidden p-0 ml-1">
              <Image src={profilePicture || "/logo.png"} alt="Profile" width={36} height={36} className="w-full h-full object-cover" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 p-2 rounded-xl">
            {/* User Info */}
            <div className="px-3 py-2 mb-1">
              <p className="font-semibold text-foreground">{user?.name || "User"}</p>
              <p className="text-sm text-muted-foreground">{user?.email || "email@example.com"}</p>
            </div>
            <DropdownMenuSeparator />
            
            <DropdownMenuItem asChild className="rounded-lg px-3 py-2 cursor-pointer">
              <Link href="/dashboard" className="flex items-center gap-3">
                <LayoutGrid className="w-4 h-4" />
                <span>{language === "th" ? "แดชบอร์ด" : "Dashboard"}</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="rounded-lg px-3 py-2 cursor-pointer">
              <Link href="/settings" className="flex items-center gap-3">
                <Settings className="w-4 h-4" />
                <span>{language === "th" ? "ตั้งค่า" : "Settings"}</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            
            <DropdownMenuItem
              onClick={handleLogout}
              className="rounded-lg px-3 py-2 cursor-pointer flex items-center gap-3 text-destructive focus:text-destructive"
            >
              <LogOut className="w-4 h-4" />
              <span>{language === "th" ? "ออกจากระบบ" : "Log out"}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Search Overlay */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4">
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setIsSearchOpen(false)}
          />
          <div className="relative w-full max-w-xl bg-background rounded-2xl shadow-2xl border border-border overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center px-4 border-b">
              <Search className="w-5 h-5 text-muted-foreground" />
              <input
                autoFocus
                type="text"
                placeholder={language === "th" ? "ค้นหางาน, โน้ต, หรือการตั้งค่า..." : "Search tasks, notes, or settings..."}
                className="w-full h-14 px-4 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button 
                onClick={() => setIsSearchOpen(false)}
                className="p-1 rounded-md hover:bg-muted text-muted-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-2 max-h-[60vh] overflow-y-auto">
              {searchQuery ? (
                <div className="p-8 text-center text-muted-foreground">
                  {language === "th" ? "ไม่พบผลลัพธ์สำหรับ" : "No results for"} &quot;{searchQuery}&quot;
                </div>
              ) : (
                <div className="p-4 space-y-4">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground px-2 mb-2 uppercase tracking-wider">
                      {language === "th" ? "คำแนะนำ" : "Suggestions"}
                    </p>
                    <div className="space-y-1">
                      {[
                        { icon: LayoutGrid, label: language === "th" ? "แดชบอร์ด" : "Dashboard", href: "/dashboard" },
                        { icon: Settings, label: language === "th" ? "ตั้งค่า" : "Settings", href: "/settings" },
                        { icon: Globe, label: language === "th" ? "เปลี่ยนภาษา" : "Change Language", action: () => {/* focus lang switcher */} },
                      ].map((item, i) => (
                        <button
                          key={i}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-primary/10 hover:text-primary transition-colors text-left"
                          onClick={() => {
                            if (item.href) router.push(item.href);
                            setIsSearchOpen(false);
                          }}
                        >
                          <item.icon className="w-4 h-4" />
                          <span className="text-sm font-medium">{item.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
