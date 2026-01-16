"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/providers/language-provider";
import { useNotifications } from "@/components/providers/notification-provider";
import { useRouter } from "next/navigation";
import {
  Inbox,
  Trash2,
  CheckCheck,
  Bell,
  Sparkles,
  AlertCircle,
  Info,
  Trophy,
} from "lucide-react";
import { toast } from "sonner";

const fadeInUp = "animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both";

const typeConfig = {
  info: { icon: Info, color: "bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400" },
  success: { icon: Sparkles, color: "bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-400" },
  warning: { icon: AlertCircle, color: "bg-amber-100 text-amber-600 dark:bg-amber-900/50 dark:text-amber-400" },
  achievement: { icon: Trophy, color: "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/50 dark:text-yellow-400" },
};

function timeAgo(dateStr: string, lang: string): string {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (diff < 60) return lang === "th" ? "เมื่อสักครู่" : "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)} ${lang === "th" ? "นาทีที่แล้ว" : "min ago"}`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} ${lang === "th" ? "ชั่วโมงที่แล้ว" : "hours ago"}`;
  return `${Math.floor(diff / 86400)} ${lang === "th" ? "วันที่แล้ว" : "days ago"}`;
}

export default function NotificationsPage() {
  const { language } = useLanguage();
  const router = useRouter();
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearAll } = useNotifications();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleNotificationClick = (id: string, link?: string) => {
    markAsRead(id);
    if (link) router.push(link);
  };

  if (!mounted) return null;

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className={cn("flex items-start justify-between", fadeInUp)} style={{ animationDelay: "0ms" }}>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            {language === "th" ? "การแจ้งเตือน" : "Notifications"}
          </h1>
          <p className="text-muted-foreground">
            {unreadCount > 0
              ? (language === "th" ? `${unreadCount} รายการยังไม่ได้อ่าน` : `${unreadCount} unread notifications`)
              : (language === "th" ? "ไม่มีรายการใหม่" : "All caught up!")}
          </p>
        </div>
        <div className="flex gap-2">
          {unreadCount > 0 && (
            <Button
              variant="outline"
              onClick={markAllAsRead}
              className="rounded-xl gap-2"
            >
              <CheckCheck className="w-4 h-4" />
              {language === "th" ? "อ่านทั้งหมด" : "Mark all read"}
            </Button>
          )}
          {notifications.length > 0 && (
            <Button
              variant="outline"
              onClick={() => {
                clearAll();
                toast.success(language === "th" ? "ล้างแล้ว" : "Cleared");
              }}
              className="rounded-xl gap-2 text-destructive hover:text-destructive"
            >
              <Trash2 className="w-4 h-4" />
              {language === "th" ? "ล้างทั้งหมด" : "Clear all"}
            </Button>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className={cn("grid grid-cols-3 gap-4", fadeInUp)} style={{ animationDelay: "100ms" }}>
        <Card>
          <CardContent className="p-4 text-center">
            <Bell className="w-6 h-6 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">{notifications.length}</p>
            <p className="text-xs text-muted-foreground">{language === "th" ? "ทั้งหมด" : "Total"}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Inbox className="w-6 h-6 text-blue-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">{unreadCount}</p>
            <p className="text-xs text-muted-foreground">{language === "th" ? "ยังไม่อ่าน" : "Unread"}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <CheckCheck className="w-6 h-6 text-green-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">{notifications.length - unreadCount}</p>
            <p className="text-xs text-muted-foreground">{language === "th" ? "อ่านแล้ว" : "Read"}</p>
          </CardContent>
        </Card>
      </div>

      {/* Notifications List */}
      <Card className={cn(fadeInUp)} style={{ animationDelay: "200ms" }}>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">
            {language === "th" ? "รายการแจ้งเตือน" : "All Notifications"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {notifications.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <Bell className="w-10 h-10 text-muted-foreground" />
              </div>
              <p className="font-semibold text-foreground text-lg">
                {language === "th" ? "ไม่มีการแจ้งเตือน" : "No notifications"}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {language === "th" ? "คุณอัปเดตทุกอย่างแล้ว!" : "You're all caught up!"}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {notifications.map(notification => {
                const config = typeConfig[notification.type] || typeConfig.info;
                const Icon = config.icon;
                
                return (
                  <div
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification.id, notification.link)}
                    className={cn(
                      "flex items-start gap-4 p-4 rounded-xl transition-all cursor-pointer",
                      notification.read
                        ? "bg-muted/30 hover:bg-muted/50"
                        : "bg-primary/5 hover:bg-primary/10 border-l-4 border-l-primary"
                    )}
                  >
                    <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", config.color)}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className={cn(
                          "text-sm leading-tight",
                          notification.read ? "font-medium text-muted-foreground" : "font-bold text-foreground"
                        )}>
                          {language === "th" ? notification.title : notification.titleEn}
                        </p>
                        {!notification.read && (
                          <span className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1.5" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {language === "th" ? notification.description : notification.descriptionEn}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {timeAgo(notification.createdAt, language)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
