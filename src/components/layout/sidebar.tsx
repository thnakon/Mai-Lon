"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  LayoutGrid,
  Bot,
  Calendar,
  FileText,
  Quote,
  FolderKanban,
  Share2,
  Wallet,
  Gift,
  CreditCard,
  Users,
  Receipt,
  Settings,
  MessageSquare,
  HelpCircle,
  MessageCircle,
  LogOut,
  PanelLeftClose,
  PanelLeft,
  Trophy,
} from "lucide-react";

// Menu Structure
const menuSections = [
  {
    title: "MAIN",
    items: [
      { id: "dashboard", label: "Dashboard", href: "/dashboard", icon: LayoutGrid },
      { id: "ai-agent", label: "AI Agent", href: "/ai-agent", icon: Bot },
      { id: "achievements", label: "Achievements", href: "/achievements", icon: Trophy },
    ],
  },
  {
    title: "STUDY",
    items: [
      { id: "schedule", label: "Schedule", href: "/schedule", icon: Calendar },
      { id: "lecture-notes", label: "Lecture Notes", href: "/lecture-notes", icon: FileText },
      { id: "citation", label: "Citation", href: "/citation", icon: Quote },
    ],
  },
  {
    title: "TEAM",
    items: [
      { id: "projects", label: "Projects", href: "/projects", icon: FolderKanban },
      { id: "shared-files", label: "Shared Files", href: "/shared-files", icon: Share2 },
    ],
  },
  {
    title: "LIFESTYLE",
    items: [
      { id: "wallet", label: "Wallet", href: "/wallet", icon: Wallet },
      { id: "privileges", label: "Privileges", href: "/privileges", icon: Gift },
    ],
  },
  {
    title: "SUBSCRIPTIONS",
    items: [
      { id: "my-subs", label: "My Subscriptions", href: "/subscriptions", icon: CreditCard },
      { id: "split-party", label: "Split Party", href: "/split-party", icon: Users },
    ],
  },
  {
    title: "ACCOUNT",
    items: [
      { id: "billing", label: "Billing", href: "/billing", icon: Receipt },
      { id: "settings", label: "Settings", href: "/settings", icon: Settings },
      { id: "feedback", label: "Feedback", href: "/feedback", icon: MessageSquare },
    ],
  },
  {
    title: "COMMUNITY",
    items: [
      { id: "help-center", label: "Help Center", href: "/help", icon: HelpCircle },
      { id: "discord", label: "Discord", href: "https://discord.gg/mailon", icon: MessageCircle, external: true },
    ],
  },
];

// Mobile bottom nav items
const mobileNavItems = [
  { id: "dashboard", label: "Home", href: "/dashboard", icon: LayoutGrid },
  { id: "schedule", label: "Schedule", href: "/schedule", icon: Calendar },
  { id: "projects", label: "Projects", href: "/projects", icon: FolderKanban },
  { id: "wallet", label: "Wallet", href: "/wallet", icon: Wallet },
  { id: "settings", label: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const supabase = createClient();

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden md:flex flex-col h-screen bg-sidebar border-r border-sidebar-border fixed left-0 top-0 transition-all duration-300 ease-in-out z-40",
          isCollapsed ? "w-[72px]" : "w-64"
        )}
      >
        {/* Header: Logo & Collapse Toggle */}
        <div className="p-4 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0">
              <Image src="/logo.png" alt="Mai Lon" width={40} height={40} className="w-full h-full object-cover" />
            </div>
            {!isCollapsed && (
              <span className="font-bold text-lg text-foreground whitespace-nowrap">Mai Lon</span>
            )}
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="h-8 w-8 shrink-0 text-muted-foreground hover:text-foreground"
          >
            {isCollapsed ? <PanelLeft className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          {menuSections.map((section) => (
            <div key={section.title} className="mb-6">
              {/* Section Header */}
              {!isCollapsed && (
                <h3 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-2">
                  {section.title}
                </h3>
              )}
              
              {/* Menu Items */}
              <div className="space-y-1">
                {section.items.map((item) => {
                  const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                  const LinkComponent = item.external ? "a" : Link;
                  const linkProps = item.external ? { target: "_blank", rel: "noopener noreferrer" } : {};

                  return (
                    <LinkComponent
                      key={item.id}
                      href={item.href}
                      {...linkProps}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200",
                        "hover:bg-sidebar-accent",
                        isActive
                          ? "bg-primary/10 text-primary font-medium"
                          : "text-sidebar-foreground hover:text-foreground",
                        isCollapsed && "justify-center px-0"
                      )}
                      title={isCollapsed ? item.label : undefined}
                    >
                      <item.icon className={cn("h-5 w-5 shrink-0", isActive && "text-primary")} strokeWidth={1.5} />
                      {!isCollapsed && <span className="text-sm">{item.label}</span>}
                    </LinkComponent>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer: Logout */}
        <div className="p-3">
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200",
              "text-destructive hover:bg-destructive/10",
              isCollapsed && "justify-center px-0"
            )}
            title={isCollapsed ? "Logout" : undefined}
          >
            <LogOut className="h-5 w-5 shrink-0" strokeWidth={1.5} />
            {!isCollapsed && <span className="text-sm font-medium">{isLoggingOut ? "Logging out..." : "Logout"}</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-sidebar border-t border-sidebar-border z-50">
        <div className="flex items-center justify-around py-2">
          {mobileNavItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");

            return (
              <Link
                key={item.id}
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-1 p-2 rounded-xl transition-all",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              >
                <item.icon className="h-5 w-5" strokeWidth={1.5} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Content Spacer for Desktop */}
      <div className={cn("hidden md:block transition-all duration-300", isCollapsed ? "w-[72px]" : "w-64")} />
    </>
  );
}
