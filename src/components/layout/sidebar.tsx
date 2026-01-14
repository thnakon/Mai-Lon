"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  GraduationCap, 
  Users, 
  Wallet, 
  Rocket, 
  Home,
  Settings
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { LanguageSwitch } from "@/components/ui/language-switch";

const zones = [
  {
    id: "home",
    label: "หน้าแรก",
    labelEn: "Home",
    href: "/dashboard",
    icon: Home,
  },
  {
    id: "academic",
    label: "Academic Genius",
    labelTh: "เรียนไม่ให้หลอน",
    href: "/academic",
    icon: GraduationCap,
    color: "text-orange-600 dark:text-orange-400",
  },
  {
    id: "teamwork",
    label: "Teamwork Savior",
    labelTh: "งานกลุ่มไม่หลอน",
    href: "/teamwork",
    icon: Users,
    color: "text-emerald-600 dark:text-emerald-400",
  },
  {
    id: "survival",
    label: "Survival Kit",
    labelTh: "ใช้ชีวิตไม่หลอน",
    href: "/survival",
    icon: Wallet,
    color: "text-blue-600 dark:text-blue-400",
  },
  {
    id: "career",
    label: "Career Launchpad",
    labelTh: "อนาคตไม่หลอน",
    href: "/career",
    icon: Rocket,
    color: "text-purple-600 dark:text-purple-400",
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 h-screen bg-sidebar border-r border-sidebar-border fixed left-0 top-0">
        {/* Logo */}
        <div className="p-6 border-b border-sidebar-border">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <span className="text-xl">🧘</span>
            </div>
            <div>
              <h1 className="font-bold text-lg text-foreground">Mai Lon</h1>
              <p className="text-xs text-muted-foreground">ไม่หลอน</p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {zones.map((zone) => {
            const isActive = pathname === zone.href || 
              (zone.href !== "/" && pathname.startsWith(zone.href));
            
            return (
              <Link
                key={zone.id}
                href={zone.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all",
                  "hover:bg-sidebar-accent",
                  isActive 
                    ? "bg-sidebar-accent text-sidebar-accent-foreground" 
                    : "text-sidebar-foreground"
                )}
              >
                <zone.icon 
                  className={cn("h-5 w-5", zone.color)} 
                  strokeWidth={1.5} 
                />
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{zone.label}</span>
                  {zone.labelTh && (
                    <span className="text-xs text-muted-foreground">{zone.labelTh}</span>
                  )}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-sidebar-border">
          <Link
            href="/settings"
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl transition-all",
              "hover:bg-sidebar-accent text-sidebar-foreground"
            )}
          >
            <Settings className="h-5 w-5" strokeWidth={1.5} />
            <span className="text-sm font-medium">ตั้งค่า</span>
          </Link>
          <div className="flex items-center justify-between mt-4 px-2">
            <LanguageSwitch />
            <ThemeToggle />
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-sidebar border-t border-sidebar-border z-50">
        <div className="flex items-center justify-around py-2">
          {zones.slice(0, 5).map((zone) => {
            const isActive = pathname === zone.href || 
              (zone.href !== "/" && pathname.startsWith(zone.href));
            
            return (
              <Link
                key={zone.id}
                href={zone.href}
                className={cn(
                  "flex flex-col items-center gap-1 p-2 rounded-xl transition-all",
                  isActive 
                    ? "text-primary" 
                    : "text-muted-foreground"
                )}
              >
                <zone.icon 
                  className={cn("h-5 w-5", isActive && zone.color)} 
                  strokeWidth={1.5} 
                />
                <span className="text-[10px] font-medium">
                  {zone.id === "home" ? "Home" : zone.id.charAt(0).toUpperCase() + zone.id.slice(1)}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
